import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Sidebar from "../components/AdminSideBarComponent";
import HeaderComponent from "../components/HeaderComponent";
import { useNavigation } from "@react-navigation/native";
import ModalForReportedUser from "../components/ModalForReportedUser";
import httpService from "../services/HttpService";

const data = [
  {
    id: "1",
    icon: "user",
    title: "Prijavljen nalog #1",
    text: "Razlog prijavljenog nalog #1",
    date: "18:00",
  },
];

const ReportedUsersScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [data, setData] = useState([]); 
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true)
      const fetchData = async () => {
        try {
          const response = await httpService.get("problemReport/type/2"); 
          setData(response); 
          console.log(response)
        } catch (error) {
          console.error("Error fetching reported materials:", error);
        } finally {
          setLoading(false); 
        }
      };
  
      fetchData();
    }, []); 


  const handleMorePress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };


  const handleSuspendAndDelete = async () => {
    setIsLoading(true); 
    console.log(`Korisnik ${selectedItem.title} suspendovan`);
    const response =   await httpService.create(`userAccount/${selectedItem.reportedId}/suspend`);
    await httpService.delete(`problemReport/${selectedItem.id}`)
    const updatedData = data.filter(item => item.id !== selectedItem.id);
    setData(updatedData);
    setIsLoading(false); 
    setModalVisible(false);
  };

  const handleCancel = () => {
    console.log("Canceled.");
    setModalVisible(false);
  };
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()} ${date.getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds()
      .toString()
      .padStart(2, '0')}`;
  };
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Icon name={item.icon} size={24} color="#013868" />
      </View>
      <View style={styles.detailsContainer}>
        <TouchableOpacity onPress={() => handleMorePress(item)}>
          <Icon name="ellipsis-h" style={styles.moreIcon} />
        </TouchableOpacity>
        <Text style={styles.itemTitle}>{item.reportedName + ' ' + item.reportedSurname}</Text>
        <Text style={styles.itemText}>{item.reason}</Text>
        <Text style={styles.itemDate}>{formatDateTime(item.time)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="arrow-left"
        leftAction={() => navigation.goBack()}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.headerTitle}>Prijavljeni nalozi</Text>
      {loading ? (
              <ActivityIndicator size="large" color="#013868" style={styles.loader} />
            ) :(
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />)}
      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
      <ModalForReportedUser
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSuspend={handleSuspendAndDelete}
        onCancel={handleCancel}
        isLoading={isLoading}
      ></ModalForReportedUser>
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
  detailsContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    color: "#013868",
    marginLeft: 10,
  },
  itemText: {
    fontSize: 12,
    color: "#013868",
    marginLeft: 10,
    marginTop: 10,
  },
  itemDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "right",
  },
  moreIcon: {
    color: "#013868",
    fontSize: 27,
    marginRight: 5,
    marginTop: 5,
    position: "absolute",
    right: 0,
  },
});

export default ReportedUsersScreen;
