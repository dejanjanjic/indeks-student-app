import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import HttpService from "../services/HttpService";
import { useUser } from "../hooks/useUser";
import ModalBlockingUserFromChat from "../components/ModalBlockingUserFromChat";
import ModalOptionsForUserChat from "../components/ModalOptionsForUserChat";
import ModalReportingUserFromChat from "../components/ModalReportingUserFromChat";
import ModalLeaveGroup from "../components/ModalLeaveGroup";

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useUser();
  var IdChat;
  var { chatId, userId, name, group, elementary, fromElementary } =
    route.params;
  var br = 0;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(true);
  const [load, setLoad] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBlockingUserModalVisible, setIsBlockingUserModalVisible] =
    useState(false);
  const [isLeavingGroupModalVisible, setIsLeavingGroupModalVisible] =
    useState(false);

  const [isReportingUserModalVisible, setIsReportingUserModalVisible] =
    useState(false);

  const handleBlockUser = async () => {
    console.log(route.params);
    try {
      console.log("USER id: ", user.accountId);
      const response = await HttpService.create(
        `blocked-accounts/${userId}/block/${chatId}`
      );
      console.log("RESPONSE", response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalVisible(false); // Zatvori modal
      setIsBlockingUserModalVisible(true);
    }
  };

  const handleReportUser = async () => {
    console.log(route.params);
    try {
      console.log("prijavljenooo");
      //treba logika za prijavljivanje korisnika
      // console.log("USER id: ", user.accountId);
      // const response = await HttpService.create(
      //   `blocked-accounts/${userId}/block/${chatId}`
      // );
      // console.log("RESPONSE", response);
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setIsModalVisible(false);
      setIsReportingUserModalVisible(true);
    }
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchMessages = async () => {
      let response;

      try {
        if (elementary) {
          response = await HttpService.get(
            `elementaryGroup/${chatId}/messages?userId=${userId}`
          );
          if (response.error) {
            navigation.navigate("ElementaryGroupChat");
            return;
          }
        } else if (group) {
          response = await HttpService.get(
            `privateGroup/${chatId}/messages?userId=${userId}`
          );
        } else {
          response = await HttpService.get(
            `singleChat/${chatId}/messages?userId=${userId}`
          );
        }

        let sortedMessages;
        if (response.error) sortedMessages = [];
        else
          sortedMessages = response.sort(
            (a, b) => new Date(b.time) - new Date(a.time)
          );

        setMessages((prevMessages) => {
          const existingIds = new Set(prevMessages.map((msg) => msg.id));
          const newMessages = sortedMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );
          const updatedMessages = [...prevMessages, ...newMessages];

          return updatedMessages.sort(
            (a, b) => new Date(b.time) - new Date(a.time)
          );
        });
      } catch (error) {}
    };

    const intervalId = setInterval(fetchMessages, 5000);
    const focusListener = navigation.addListener("focus", () => {
      fetchMessages();
    });

    return () => {
      clearInterval(intervalId);
      focusListener();
    };
  }, [chatId, userId, elementary, group, navigation]);

  useEffect(() => {
    userId = user.accountId;

    const fetchMessages = async () => {
      try {
        IdChat = chatId;
        const block = await HttpService.get(
          `blocked-accounts/is-blocked/${userId}/${chatId}`
        );
        if (block === true) {
          setBlocked(true);
          setLoad(true);
          console.log("true");
        } else {
          setBlocked(false);
          setLoad(true);
          console.log(chatId);
        }
        let response;
        try {
          var id = await HttpService.get(
            `singleChat/exists?firstParticipantId=${userId}&secondParticipantId=${route.params.otherUserId[0]}`
          );
          console.log("AAAAAAAAAAAAAAAA");
          console.log(id);
        } catch (error) {}

        if (id && !group) chatId = id;
        console.log(chatId);
        if (elementary) {
          response = await HttpService.get(
            `elementaryGroup/${chatId}/messages?userId=${userId}`
          );
          if (response.error) {
            navigation.navigate("ElementaryGroupChat");
            return;
          }
        } else if (group) {
          response = await HttpService.get(
            `privateGroup/${chatId}/messages?userId=${userId}`
          );
        } else {
          response = await HttpService.get(
            `singleChat/${chatId}/messages?userId=${userId}`
          );
        }

        if (response.error) {
          console.log("Chat ne postoji. Kreiram novi chat...");

          const otherUserId = route.params.otherUserId;
          console.log(otherUserId);
          console.log(userId);
          let resp;
          console.log(otherUserId);
          if (Array.isArray(otherUserId) && otherUserId.length > 1) {
            console.log("Više korisnika pronađeno. Kreiram grupni chat...");

            resp = await HttpService.create("privateGroup", {
              name: route.params.groupName,
              memberIds: [userId, ...otherUserId],
            });
            chatId = resp.id;
            console.log(resp);
            navigation.navigate("Chat", {
              chatId: chatId,
              elementary: false,
              name: route.params.groupName,
              group: true,
            });
          } else {
            resp = await HttpService.create("singleChat", {
              firstParticipantId: userId,
              secondParticipantId: otherUserId[0],
            });

            chatId = resp.chatId;

            console.log(resp);

            console.log(resp.chatId);
            navigation.navigate("Chat", {
              chatId: chatId,
              otherUserId: otherUserId,
              name: resp.otherUserName,
              group: false,
            });
          }

          setMessages([]);
          console.log("Novi chat kreiran uspješno.");
        } else {
          const sortedMessages = response.sort(
            (a, b) => new Date(b.time) - new Date(a.time)
          );
          console.log(sortedMessages);
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, userId, group]);

  const addMessage = (newMessage) => {
    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
  };

  const generateUniqueId = () => {
    let newId;
    let exists = true;

    while (exists) {
      newId = Math.random().toString(36).substr(2, 9);
      exists = messages.some((message) => message.id === newId);
    }

    return newId;
  };
  const back = () => {
    if (!fromElementary) navigation.navigate("ChatList");
    else navigation.navigate("ElementaryGroupChat");
  };
  const sendMessage = async (chatId) => {
    if (messageText.trim() === "") return;
    setMessageText("");
    let newMessage;
    if (group) {
      newMessage = {
        text: messageText,
        time: new Date().toISOString(),
        singleChatId: 0,
        groupChatId: chatId,
        status: "SENT",
        userAccountId: user.accountId,
      };
    } else {
      newMessage = {
        text: messageText,
        time: new Date().toISOString(),
        singleChatId: chatId,
        groupChatId: 0,
        status: "SENT",
        userAccountId: user.accountId,
      };
    }

    console.log(newMessage);
    const mess = {
      id: generateUniqueId(),
      text: messageText,
      time: newMessage.time,
      sentByUser: true,
    };
    addMessage(mess);
    try {
      await HttpService.create("message", newMessage);

      console.log(user.accountId);
      console.log(chatId);
      let response;
      if (elementary) {
        response = await HttpService.get(
          `elementaryGroup/${chatId}/messages?userId=${user.accountId}`
        );
        console.log(response);
      } else if (group) {
        response = await HttpService.get(
          `privateGroup/${chatId}/messages?userId=${user.accountId}`
        );
      } else {
        response = await HttpService.get(
          `singleChat/${chatId}/messages?userId=${user.accountId}`
        );
        console.log(response);
      }
      const sortedMessages = response.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );

      setMessages(sortedMessages);
    } catch (error) {
      // console.error("Error sending message:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageWrapper,
        item.sentByUser
          ? styles.userMessageWrapper
          : styles.otherMessageWrapper,
      ]}
    >
      <View
        style={[
          styles.messageContainer,
          item.sentByUser
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {!item.sentByUser && (
          <Text style={styles.senderName}>{item.senderFullName}</Text>
        )}
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.messageTime}>{formatTime(item.time)}</Text>
          {item.sentByUser && (
            <Ionicons name="checkmark-done-outline" size={14} color="#999" />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <TouchableOpacity
          onPress={() => {
            if (!group) setIsModalVisible(true);
            else setIsLeavingGroupModalVisible(true);
            console.log("Proba, test, test");
          }}
        >
          {!blocked && (
            <Ionicons
              name="ellipsis-vertical-outline"
              size={24}
              color="black"
            />
          )}
        </TouchableOpacity>
        {isModalVisible && (
          // <ModalBlockingUserFromChat
          //   visible={isModalVisible}
          //   onClose={() => setIsModalVisible(false)}
          //   onConfirm={() => {
          //     navigation.navigate("ChatList");
          //   }}
          //   userName={name}
          //   userId={user.accountId}
          //   chatId={chatId}
          // />
          <ModalOptionsForUserChat
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onConfirm={() => {
              navigation.navigate("ChatList");
            }}
            onBlockUser={handleBlockUser}
            onReportUser={handleReportUser}
            userName={name}
            userId={user.accountId}
            chatId={chatId}
          />
        )}

        {isBlockingUserModalVisible && (
          <ModalBlockingUserFromChat
            visible={isBlockingUserModalVisible}
            onClose={() => setIsBlockingUserModalVisible(false)}
            onConfirm={() => {
              navigation.navigate("ChatList");
            }}
            userName={name}
            userId={user.accountId}
            chatId={chatId}
          />
        )}
        {isReportingUserModalVisible && (
          <ModalReportingUserFromChat
            visible={isReportingUserModalVisible}
            onClose={() => setIsReportingUserModalVisible(false)}
            //onConfirm={handleConfirmBlock} // Poziva handleConfirmBlock nakon potvrde blokiranja
            userName={name}
            userId={user.accountId}
            chatId={chatId}
          />
        )}
        {isLeavingGroupModalVisible && (
          <ModalLeaveGroup
            visible={isLeavingGroupModalVisible}
            onClose={() => setIsLeavingGroupModalVisible(false)}
            chatId={chatId}
          />
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          inverted
          contentContainerStyle={styles.chatContainer}
        />
      )}
      <View style={styles.inputContainer}>
        {blocked && load ? (
          <Text style={styles.blockedMessage}>
            Ne možete pristupiti ovom časkanju.
          </Text>
        ) : load ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Poruka..."
              value={messageText}
              onChangeText={setMessageText}
              editable={!blocked}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => sendMessage(chatId)}
              disabled={blocked}
            >
              <Ionicons
                name="send-outline"
                size={24}
                color={blocked ? "#ccc" : "#007aff"}
              />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 5,
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  otherMessageWrapper: {
    justifyContent: "flex-start",
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignSelf: "flex-end",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  userMessageContainer: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },
  messageText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#000",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sendButton: {
    marginLeft: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  blockedMessage: {
    color: "red",
    marginLeft: "15%",
  },
});

export default ChatScreen;
