import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { BlurView } from "expo-blur";
import Sidebar from "../components/SidebarComponent";
import AdminSidebarComponent from "../components/AdminSideBarComponent";
import HeaderComponent from "../components/HeaderComponent";
import HttpService from "../services/HttpService";
import ElementaryGroup from "../model/ElementaryGroup";
import ModalDeletingElementaryGroup from "../components/ModalDeletingElementaryGroup";
import ModalAddGroup from "../components/ModalAddElementaryGroupChat";
import AuthContext from "../auth/context";

const ElementaryGroupsListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [blurredItem, setBlurredItem] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  useEffect(() => {
    if (user) {
      setIsAdmin(user.accountType === "ADMIN");
    }
  }, [user]);
  const handleLongPressDelete = (item) => {
    setSelectedGroup(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setBlurredItem(null);
  };
  const handlePlusPress = () => setAddModalVisible(true);
  const handleAddGroup = async (groupName) => {
    try {
      const response = await HttpService.create("elementaryGroup", {
        name: groupName,
      });
      console.log("Odgovor servera:", response);
      if (response) {
        const newGroup = new ElementaryGroup(response.id, groupName);
        setData((prevData) => [...prevData, newGroup]);
        setAddModalVisible(false);
      } else {
        console.error("Greška pri dodavanju grupe");
      }
    } catch (error) {
      console.error("Greška pri slanju POST zahteva:", error);
    }
  };
  const handleModalConfirm = async () => {
    try {
      if (!selectedGroup?.id) {
        console.error("ID grupe nije definisan.");
        return;
      }

      const response = await HttpService.delete(
        `elementaryGroup/${selectedGroup.id}`
      );

      if (response == null) {
        console.log(`Grupa "${selectedGroup?.title}" je uspešno obrisana.`);
        setData((prevData) =>
          prevData.filter((group) => group.id !== selectedGroup.id)
        );
        setModalVisible(false);
        setBlurredItem(null);
      } else {
        console.error(
          `Nepoznat odgovor servera. Status: ${
            response?.status
          }. Telo odgovora: ${JSON.stringify(response?.data)}`
        );
      }
    } catch (error) {
      console.error("Greška pri slanju DELETE zahteva:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await HttpService.get("elementaryGroup");
        const formattedData = result.map(
          (item) => new ElementaryGroup(item.groupChat.id, item.groupChat.name)
        );
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLongPress = (item) => {
    setBlurredItem(item.id);
  };

  const handleClose = () => {
    setBlurredItem(null);
  };

  const handleOutsidePress = () => {
    setBlurredItem(null);
  };
  
  const handleChatPress = (chat) => {
    console.log(chat);
    if(user.accountType === "ADMIN")
      return
     navigation.navigate("Chat", {
       chatId: chat.id,
       name: chat.title,
       group : true,
       elementary : true,
       fromElementary : true
     });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onLongPress={() => handleLongPress(item)} onPress={() => {handleChatPress(item)}}>
        <View style={styles.cardContainer}>
          {blurredItem === item.id
            ? isAdmin && (
                <BlurView style={styles.absoluteBlur} intensity={50}>
                  <View style={styles.iconOverlayContainer}>
                    <TouchableOpacity
                      onPress={() => handleLongPressDelete(item)}
                    >
                      <View style={styles.iconCircle}>
                        <Icon name="trash-o" size={15} color="#fff" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleClose}>
                      <View style={styles.iconCircle}>
                        <Icon name="close" size={15} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              )
            : null}

          <View style={styles.iconContainer}>
            <Icon name="group" size={30} color="#013868" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{item.title}</Text>
            {item.description ? (
              <Text style={styles.descriptionText}>{item.description}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const loading = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#013868"
          style={styles.loadingIndicator}
        />
      );
    } else {
      return (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => (item.id ? item.id.toString() : item.name)}
          contentContainerStyle={styles.cardList}
        />
      );
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <HeaderComponent
          leftIcon="bars"
          leftAction={toggleSidebar}
          centerLogo={require("../assets/images/logo.png")}
          centerText="Indeks"
        />
        <Text style={styles.screenTitle}>Osnovne grupe</Text>
        {loading()}
        {isAdmin && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handlePlusPress}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>
        )}
        <ModalAddGroup
          visible={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          onAdd={handleAddGroup}
        />
        {isSidebarVisible &&
          (isAdmin ? (
            <AdminSidebarComponent
              visible={isSidebarVisible}
              onClose={toggleSidebar}
            />
          ) : (
            <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
          ))}
        <ModalDeletingElementaryGroup
          visible={isModalVisible}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          groupName={selectedGroup?.title}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7c7c7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#013868",
    paddingTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#C7C7C7",
  },
  headerLogo: {
    width: 100,
    height: 40,
    marginRight: 20,
  },
  headerTitle: {
    marginRight: 40,
    marginLeft: -100,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#013868",
    textAlign: "center",
    marginVertical: 10,
  },
  cardList: {
    paddingHorizontal: 15,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    position: "relative",
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8EAF6",
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#013868",
  },
  descriptionText: {
    fontSize: 14,
    color: "#737373",
  },

  absoluteBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  iconOverlayContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 7,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#013868",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  loadingIndicator: {
    marginTop: 300,
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

export default ElementaryGroupsListScreen;
