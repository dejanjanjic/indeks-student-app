import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity } from "react-native";
import Sidebar from "../components/AdminSideBarComponent";
import IconFeather from "react-native-vector-icons/Feather";
import HeaderComponent from "../components/HeaderComponent";
import httpService from "../services/HttpService"; 

const RegistredUsersScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await httpService.get("userAccount/user-accounts/summary");
      if (response.error) {
        console.log(response)
        setError(response.message || "Failed to fetch users.");
      } else {
        console.log(response)
        setUsers(response);
      }
    } catch (err) {
      console.log("Error")
   //  setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchUsers();
  }, []);

  const handleStatusChange = async (item) => {
   
    const updatedUsers = users.map((user) =>
      user.id === item.id ? { ...user, active: !user.active } : user
    );
    console.log(item.id)
    setUsers(updatedUsers);
    await httpService.create(`userAccount/${item.id}/suspend`);
    
    
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <IconFeather name="user" size={27} color="#a6a6a6" />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.nameText}>{item.firstName + ' ' +item.lastName}</Text>
        <Text style={styles.emailText}>{item.email}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}> {item.active ?  "Aktivan" :  "Suspendovan" }</Text>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor:
                item.active  ? "#FF6F61" : "#81C784",
            },
          ]}
          onPress={() => handleStatusChange(item)}
        >
          <Text style={styles.actionText}>
            {item.active ? "Suspenduj" : "Reaktiviraj"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#013868" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="bars"
        leftAction={toggleSidebar}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.headerTitle}>Registrovani korisnici</Text>
      <FlatList
        data={users}
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
    marginRight: 10,
    marginLeft: -8,
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
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  emailText: {
    fontSize: 11,
    color: "#a6a6a6",
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
  },
  actionText: {
    textAlign: "center",
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RegistredUsersScreen;
