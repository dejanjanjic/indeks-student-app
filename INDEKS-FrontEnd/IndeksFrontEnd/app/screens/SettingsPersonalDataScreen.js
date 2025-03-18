import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Sidebar from "../components/SidebarComponent";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Icon6 from "react-native-vector-icons/FontAwesome6";
import IconFeather from "react-native-vector-icons/Feather";
import HeaderComponent from "../components/HeaderComponent";
import { useNavigation } from "@react-navigation/native";

const data = [
  {
    id: "1",
    icon: "key",
    title: "Promjena lozinke",
    family: "FontAwesome5",
    screen: "ChangePasswordScreen",
  },
];
const SettingsPersonalDataScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const navigation = useNavigation();

  const handleItemPress = (screen) => {
    navigation.navigate(screen);
  };

  const back = () => {
    console.log(navigate);
    navigation.navigate(navigate);
  };

  const renderIcon = (family, iconName) => {
    switch (family) {
      case "FontAwesome":
        return <Icon name={iconName} size={24} color="#013868" />;
      case "FontAwesome5":
        return <Icon5 name={iconName} size={24} color="#013868" />;
      case "Feather":
        return <Icon6 name={iconName} size={24} color="#013868" />;
      default:
        return <Icon name="question-circle" size={24} color="red" />; // Fallback ikona
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.screen)}
    >
      <View style={styles.iconContainer}>
        {renderIcon(item.family, item.icon)}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="arrow-left"
        leftAction={() => navigation.goBack()}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.headerTitle}>Lični podaci</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#013868",
    textAlign: "center",
    marginVertical: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: "#013868",
  },
  countContainer: {
    backgroundColor: "#013868",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default SettingsPersonalDataScreen;
