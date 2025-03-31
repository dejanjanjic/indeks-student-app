import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import HeaderComponent from "../components/HeaderComponent";
import Sidebar from "../components/SidebarComponent";
import HttpService from "../services/HttpService";
import { useUser } from "../hooks/useUser";
import { useNavigation } from "@react-navigation/native";

const BlockedUsersScreen = () => {
  const user = useUser();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const navigation = useNavigation();

  const fetchBlockedUsers = async () => {
    try {
      console.log(user.accountId);
      const data = await HttpService.get(`blocked-accounts/${user.accountId}`);
      if (data.error) {
        console.log(data);
        console.error();
      } else {
        setBlockedUsers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  const handleUnblock = async (blockedUserId) => {
    console.log(blockedUserId);
    setBlockedUsers((blockedUsers) =>
      blockedUsers.filter((user) => user.id !== blockedUserId)
    );
    await HttpService.delete(
      `blocked-accounts/unblock/chat/${user.accountId}/${blockedUserId}`
    );
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <IconFeather name="user" size={40} color="#a6a6a6" />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.nameText}>
          {item.firstName + " " + item.lastName}
        </Text>
        <Text style={styles.dateText}>
          Blokiran {formatDate(item.dateBlocked)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item.id)}
      >
        <Text style={styles.unblockButtonText}>Odblokiraj</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#013868" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="arrow-left"
        leftAction={() => navigation.goBack()}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.headerTitle}>Blokirani korisnici</Text>
      <FlatList
        data={blockedUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingVertical: 7,
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
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#013868",
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
  unblockButton: {
    backgroundColor: "#013868",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  unblockButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default BlockedUsersScreen;
