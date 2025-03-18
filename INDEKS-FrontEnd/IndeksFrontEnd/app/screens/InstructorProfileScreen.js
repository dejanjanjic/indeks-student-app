//TODO tijana
import React, { useState } from "react";
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

const data = [
  {
    id: "1",
    course: "Matematika 1",

    rating: 5,
    icon: "calculator",
  },
  {
    id: "2",
    course: "OET 1",

    rating: 5,
    icon: "bolt",
  },
  {
    id: "3",
    course: "Matematika 2",

    rating: 4,
    icon: "calculator",
  },
];
const InstructorProfileScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [blurredItem, setBlurredItem] = useState(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const handleCoursePress = (course) => {
    console.log("Selected course:", course);
  };
  const handlePlusPress = () => {
    console.log("Plus");
  };

  const loadData = () => {
    return (
      <FlatList
        data={data}
        renderItem={renderInstructionItem}
        keyExtractor={(item) => item.id}
      />
    );
  };

  const renderAddButton = () => (
    <TouchableOpacity style={styles.floatingButton} onPress={handlePlusPress}>
      <Image
        source={require("../assets/images/plus.png")}
        style={styles.floatingButtonImage}
      />
    </TouchableOpacity>
  );

  const renderInstructionItem = ({ item }) => (
    <TouchableOpacity>
      <InstructionItemComponent
        navigate={"InstructorProfileScreen"}
        course={item.course}
        rating={item.rating}
        teacher={"444 recenzije"} //todo dodati recenzije tj prebrojavanje
        icon={item.icon}
        onPress={() => handleCoursePress(item.course)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent toggleSidebar={toggleSidebar} />
      <Text style={styles.title}>Moja ponuda</Text>
      {loadData()}
      {renderAddButton()}
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
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Prozirna pozadina za dugme
    borderRadius: 50,
    padding: 5,
  },
  blurredItem: {
    filter: "blur(5px)", // Blur efekat
  },
  deleteIcon: {
    width: 25,
    height: 25,
  },
});

export default InstructorProfileScreen;
