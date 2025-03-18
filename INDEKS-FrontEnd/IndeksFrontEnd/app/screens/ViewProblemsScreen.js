import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Sidebar from "../components/AdminSideBarComponent";
import HeaderComponent from "../components/HeaderComponent";
import { useNavigation } from "@react-navigation/native";
import ReportedProblemGenericComponent from "../components/ReportedProblemGenericComponent";
import Icon from "react-native-vector-icons/FontAwesome";

const data = [
  {
    id: "1",
    iconName: "comments",
    title: "Prijavljeni komentari",

    screen: "ReportedCommentsScreen",
  },
  {
    id: "2",
    iconName: "folder",
    title: "Prijavljeni materijali",
    
    screen: "ReportedMaterialsScreen",
  },
  {
    id: "3",
    iconName: "user",
    title: "Prijavljeni nalozi",

    screen: "ReportedUsersScreen",
  },
];

const ProblemsScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const navigation = useNavigation();

  const handleItemPress = (screen) => {
    navigation.navigate(screen);
  };

  const renderItem = ({ item }) => (
    <ReportedProblemGenericComponent
      title={item.title}
      iconName={item.iconName}
      onPress={() => handleItemPress(item.screen)}
      count={item.count}
    ></ReportedProblemGenericComponent>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="bars"
        leftAction={toggleSidebar}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.headerTitle}>Prijavljeni problemi</Text>
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
  icon: {
    color: "#013868",
    fontSize: 24,
  },
});

export default ProblemsScreen;
