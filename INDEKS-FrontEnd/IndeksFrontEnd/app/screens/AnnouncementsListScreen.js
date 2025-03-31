import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Sidebar from "../components/SidebarComponent";
import Icon from "react-native-vector-icons/FontAwesome";
import HeaderComponent from "../components/HeaderComponent";
import httpService from "../services/HttpService";
import Announcements from "../model/Announcements";

const AnnouncementsListScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [adsData, setAdsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchAdsByYear = async (year) => {
    try {
      console.log("123123");
      setIsLoading(true);
      const result = await httpService.get(`announcements/year/${year}`);
      const formattedData = result.map(
        (item) =>
          new Announcements(
            item.id,
            item.title,
            item.header,
            item.content,
            item.signature,
            item.timeOfCreation,
            item.timeOfDeletion,
            item.year,
            item.announcementAttachment
          )
      );
      setAdsData((prevData) => ({ ...prevData, [year]: formattedData })); // ovde imamo kao 1 : pa oglasi njegovi 2: pa oglsi njegovi da bi mogli lakse dole parsirat to
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemPress = (year) => {
    if (expandedCard === year) {
      setExpandedCard(null);
    } else {
      setExpandedCard(year);

      fetchAdsByYear(year);
    }
  };

  const renderOglasi = (year) => {
    const oglasi = adsData[year] || [];
    return (
      <View style={styles.oglasiContainer}>
        {oglasi.length > 0 ? (
          oglasi.map((oglas, index) => (
            <View key={index} style={styles.oglasCard}>
              <Text style={styles.oglasDate}>
                {new Date(oglas.timeOfCreation).toLocaleString("sr-RS", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.oglasTitle}>{oglas.title}</Text>
              <Text style={styles.oglasBody}>{oglas.content}</Text>
              <Text style={styles.oglasSignature}>{oglas.signature}</Text>
            </View>
          ))
        ) : isLoading ? (
          <ActivityIndicator size="small" color="#013868" />
        ) : (
          <Text style={styles.noAdsText}>Nema oglasa za ovu godinu.</Text>
        )}
      </View>
    );
  };

  const yearTitles = [
    { year: "I", title: "Prva godina" },
    { year: "II", title: "Druga godina" },
    { year: "III", title: "Treća godina" },
    { year: "IV", title: "Četvrta godina" },
  ];

  const renderItem = ({ index }) => {
    const year = index + 1;
    return (
      <>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleItemPress(year)}
        >
          <View style={styles.iconContainer}>
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{yearTitles[index].year}</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.itemTitle}>{yearTitles[index].title}</Text>
          </View>
          <Icon
            name={expandedCard === year ? "chevron-up" : "chevron-down"}
            size={20}
            color="#013868"
          />
        </TouchableOpacity>

        {expandedCard === year && renderOglasi(year)}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="bars"
        leftAction={toggleSidebar}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.title}>Oglasi</Text>
      <FlatList
        data={yearTitles}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#013868",
    textAlign: "center",
    marginVertical: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 20,
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
  detailsContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#013868",
  },
  oglasiContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    flexDirection: "column",
  },
  oglasCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 2,
  },
  oglasDate: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 5,
  },
  oglasTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#013868",
    marginBottom: 8,
  },
  oglasBody: {
    fontSize: 14,
    color: "#013868",
  },
  oglasSignature: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#013868",
    marginTop: 15,
  },
  noAdsText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 5,
  },
});

export default AnnouncementsListScreen;
