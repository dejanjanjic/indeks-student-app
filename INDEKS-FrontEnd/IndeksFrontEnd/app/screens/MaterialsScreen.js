import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderComponent from "../components/HeaderComponent";
import AdminSidebarComponent from "../components/AdminSideBarComponent";
import AuthContext from "../auth/context";
import SidebarComponent from "../components/SidebarComponent";

const data = [
  { id: "1", year: "I", title: "Prva godina" },
  { id: "2", year: "II", title: "Druga godina" },
  { id: "3", year: "III", title: "Treća godina" },
  { id: "4", year: "IV", title: "Četvrta godina" },
];

const MaterialsScreen = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    if (user) {
      setIsAdmin(user.accountType === "ADMIN");
    }
  }, [user]);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleItemPress = (id) => {
    const selectedYear = data.find((item) => item.id === id);
    navigation.navigate("MaterialsYearsItemsScreen", {
      year: id,
      title: selectedYear.title, // Šaljemo title
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={styles.iconContainer}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{item.year}</Text>
        </View>
      </View>
      <Text style={styles.itemTitle}>{item.title}</Text>
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
      <Text style={styles.title}>Materijali</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {isAdmin ? (
        <AdminSidebarComponent
          visible={isSidebarVisible}
          onClose={toggleSidebar}
        />
      ) : (
        <SidebarComponent visible={isSidebarVisible} onClose={toggleSidebar} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7c7c7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#013868",
    textAlign: "center",
    marginVertical: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
  },
  numberCircle: {
    backgroundColor: "#E8EAF6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#013868",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#013868",
  },
});

export default MaterialsScreen;
