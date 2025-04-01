import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Sidebar from "../components/SidebarComponent";
import HeaderComponent from "../components/HeaderComponent";
import HttpService from "../services/HttpService";

const MaterialsYearsItemsScreen = ({ route, navigation }) => {
  const { year, title } = route.params; 
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await HttpService.get(`subject/year/${year}`);
        console.log(response);
        setData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("MaterialsSubjectItemsScreen", {
          id: item.id,
          subjectTitle: item.name,
        })
      }
    >
      <View style={styles.iconContainer}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{item.name[0].toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.itemTitle}>{item.name}</Text>
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
      <Text style={styles.title}>{title}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#013868" style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
  loader: {
    marginTop: 50,
  },
});

export default MaterialsYearsItemsScreen;
