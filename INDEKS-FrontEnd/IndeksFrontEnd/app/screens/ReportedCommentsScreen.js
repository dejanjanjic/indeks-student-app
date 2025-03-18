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
import ModalForReportedComments from "../components/ModalForReportedComments";
import httpService from "../services/HttpService";
const data = [
  {
    id: "1",
    icon: "comments",
    title: "Prijavljen komentar #1",
    text: "Tekst prijavljenog komentara #1",
    reportedUser: "Reported user #1",
    creatorOfReport: "Reported by #1",
    date: "13:40",
  },
  {
    id: "2",
    icon: "comments",
    title: "Prijavljen komentar #2",
    text: "Tekst prijavljenog komentara #2",
    reportedUser: "Reported user #2",
    creatorOfReport: "Reported by #2",
    date: "Juče",
  },
  {
    id: "3",
    icon: "comments",
    title: "Prijavljen komentar #3",
    text: "Tekst prijavljenog komentara #3",
    reportedUser: "Reported user #3",
    creatorOfReport: "Reported by #3",
    date: "28. 3. 2024.",
  },
];

const ReportedCommentsScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isLoading, setisLoading] = useState(false); 
  const navigation = useNavigation();


  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        try {
          const response = await httpService.get("problemReport/type/0"); 
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

  const handleDelete = async () => {
    setisLoading(true); 
    try {
      await httpService.delete(`problemReport/${selectedItem.id}`);
      await httpService.delete(`review/${selectedItem.reviewId}`);
      
      const updatedData = data.filter(item => item.id !== selectedItem.id);
      setData(updatedData); 
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setisLoading(false);
      setModalVisible(false); 
    }
  };
  

  const handleSuspendAndDelete = () => {
    setisLoading(false)
    console.log(
      `Komentar ${selectedItem.title} izbrisan i korisnik suspendovan`
    );
    setModalVisible(false);
  };

  const handleCancel = () => {
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
      <TouchableOpacity
          onPress={() => handleMorePress(item)}
          style={{ padding: 10 }}
        >
          <Icon name="ellipsis-h" style={styles.moreIcon} />
    </TouchableOpacity>
        <Text style={styles.itemTitle}>{item.reviewText}</Text>
        <Text style={styles.itemText}>{item.reason}</Text>
        <Text style={styles.itemCreator}>{item.reporterName + ' '+item.reporterSurname}</Text>
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
      <Text style={styles.headerTitle}>Prijavljeni komentari</Text>
      {loading ? (
              <ActivityIndicator size="large" color="#013868" style={styles.loader} />
            ) : (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />)}
      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />

      <ModalForReportedComments
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDelete={handleDelete}
        onSuspendAndDelete={handleSuspendAndDelete}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
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
  itemCreator: {
    fontSize: 12,
    color: "#013868",
    marginLeft: 10,
    marginTop: 7,
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

export default ReportedCommentsScreen;
