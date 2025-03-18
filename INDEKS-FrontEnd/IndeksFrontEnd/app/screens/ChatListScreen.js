import React, { useState, useEffect,useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Sidebar from "../components/SidebarComponent";
import HttpService from "../services/HttpService";
import { useUser } from "../hooks/useUser";
import HeaderComponent from "../components/HeaderComponent";
import AuthContext from "../auth/context";
const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const user = useUser();
  
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    let intervalId;
  
    const fetchChats = async () => {
      try {
     
        const response = await HttpService.get(
          `singleChat/user/${user.accountId}/summary`,setUser
        );
  
        //console.log("ChatList", response);
  
        const mappedChats = response.map((chat) => ({
          id: chat.id.toString(),
          name: chat.name,
          sender: chat.sender,
          lastMessage: chat.lastMessage,
          group: chat.group,
          elementary: chat.elementaryGroup,
        }));
  
        setChats(mappedChats);
      } catch (error) {
        
       // console.error("Error fetching chats:", error.message);
      } finally {
        
      }
    };
  
    const startFetchingChats = () => {
      fetchChats(); 
      intervalId = setInterval(fetchChats, 5000); 
    };
  
    const unsubscribe = navigation.addListener("focus", () => {
      startFetchingChats();
    });
  
    return () => {
      unsubscribe();
      clearInterval(intervalId); 
    };
  }, [navigation, user.accountId]);

  

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const fetchChats = async () => {
        try {
          setIsLoading(true);
          const response = await HttpService.get(
            `singleChat/user/${user.accountId}/summary`
          );

          console.log("ChatList", response);

          const mappedChats = response.map((chat) => ({
            id: chat.id.toString(),
            name: chat.name,
            sender: chat.sender,
            lastMessage: chat.lastMessage,
            group: chat.group,
            elementary : chat.elementaryGroup
          }));

          setChats(mappedChats);
        } catch (error) {
         // console.error("Error fetching chats:", error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchChats();
    });

    return unsubscribe;
  }, [navigation, user.accountId]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleChatPress = (chat) => {
    console.log(chat);
    navigation.navigate("Chat", {
      chatId: chat.id,
      userId: user.accountId,
      name: chat.name,
      group : chat.group,
      elementary : chat.elementary
    });
  };

  const handlePlusPress = () => {
    console.log("Plus button pressed!");
    navigation.navigate("NewPrivateGroupScreen");
  };

  const handleSearchPress = () => {
    console.log("Search button pressed!");
    navigation.navigate("SearchScreen");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.chatAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="bars"
        leftAction={toggleSidebar}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
        rightIcon="search"
        rightAction={handleSearchPress}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#013868" />
      ) : (
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={handlePlusPress}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C7C7C7",
  },
  chatItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#013868",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatDetails: {
    marginLeft: 15,
    justifyContent: "center",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatLastMessage: {
    fontSize: 14,
    color: "#888",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#013868",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default ChatListScreen;
