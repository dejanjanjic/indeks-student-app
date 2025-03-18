import React, { useState, useCallback  } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Sidebar from "../components/SidebarComponent";
import HeaderComponent from "../components/HeaderComponent";
import InstructionItemComponent from "../components/InstructionItemComponent";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../hooks/useUser";
import HttpService from "../services/HttpService";
import ModalDeletingMyTutoringOffer from "../components/ModalDeletingMyTutoringOffer";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

const ListOfMyInstructionsScreen = () => {
  const user = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTutoringOffer, setSelectedTutoringOffer] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [blurredItem, setBlurredItem] = useState(null);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      console.log("Ulogovani korisnik:", user);
      const fetchInstructions = async () => {
        if (!user?.accountId) {
          console.warn("Korisnik nema accountId!");
          return;
        }

        try {
          const response = await HttpService.getById(
            "tutoringOffer/student",
            user.accountId
          );
          console.log("Odgovor API-ja:", response);
          setInstructions(response || []);
        } catch (err) {
          console.log("Greška pri učitavanju podataka:", err);
        }
      };

      fetchInstructions();
    }, [user?.accountId]) 
  );
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTutoringOffer(null);
  };

  const handleModalConfirm = async (tutoringOfferId) => {
    if (!selectedTutoringOffer?.tutoringOfferId) {
      console.log("ID ponude nije definisan.");
      return;
    }
    try {
      const response = await HttpService.delete(
        "tutoringOffer/",
        tutoringOfferId
      );
      if (response) {
        console.log(`Ponuda sa ID-jem ${tutoringOfferId} je obrisana.`);
        setInstructions((prev) =>
          prev.filter((item) => item.tutoringOfferId !== tutoringOfferId)
        );
        handleModalClose();
      }
    } catch (error) {
      console.log("Greška pri brisanju ponude:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLongPress = (item) => {
    setSelectedTutoringOffer(item);
    setBlurredItem(item.tutoringOfferId);
  };

  const handleClose = () => {
    setBlurredItem(null);
  };

  const handlePlusPress = () => {
    navigation.navigate("AddingNewInstructionOfferScreen");
    
  };

  const handleLongPressDelete = (item) => {
    setSelectedTutoringOffer(item);
    setModalVisible(true);
  };

  const renderAddButton = () => (
    <TouchableOpacity style={styles.floatingButton} onPress={handlePlusPress}>
      <Image
        source={require("../assets/images/plus.png")}
        style={styles.floatingButtonImage}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="bars"
        leftAction={toggleSidebar}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.title}>Moja ponuda</Text>
      <FlatList
        data={instructions}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            style={styles.instructionItem}
          >
            <InstructionItemComponent
              navigate={"Instruction"}
              id={item.tutoringOfferId}
              course={item.subjectName}
              teacher={item.instructorName}
              rating={item.averageRating}
              icon="pencil"
            />
            {blurredItem === item.tutoringOfferId && (
              <BlurView style={styles.absoluteBlur} intensity={50}>
                <View style={styles.iconOverlayContainer}>
                  <TouchableOpacity
                    onPress={() => handleLongPressDelete(item)} // Brisanje ponude
                  >
                    <View style={styles.iconCircle}>
                      <Icon name="trash-o" size={15} color="#fff" />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleClose}>
                    {" "}
                    <View style={styles.iconCircle}>
                      <Icon name="close" size={15} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </View>
              </BlurView>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.tutoringOfferId.toString()}
      />
      {renderAddButton()}
      <ModalDeletingMyTutoringOffer
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
        tutoringOfferId={selectedTutoringOffer?.tutoringOfferId}
        subjectName={selectedTutoringOffer?.subjectName}
      />
      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7c7c7",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#013868",
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginVertical: 10,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  floatingButtonImage: {
    width: 70,
    height: 70,
  },
  absoluteBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconOverlayContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 10,
  },
  iconCircle: {
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 5,
    marginLeft: 10,
  },
});

export default ListOfMyInstructionsScreen;
