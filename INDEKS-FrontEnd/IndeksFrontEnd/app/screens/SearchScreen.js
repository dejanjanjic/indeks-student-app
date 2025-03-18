import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";  

import Icon from "react-native-vector-icons/FontAwesome";
import HttpService from "../services/HttpService";
import { useUser } from "../hooks/useUser";

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const user = useUser()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await HttpService.get("userAccount"); 
        console.log(response)
      
        const resp = response.filter(
          (account) => account.id !== user.accountId
        );
        
       setUsers(resp)
        setFilteredUsers(resp); 
        console.log(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = users.filter((user) =>
      user.firstName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (user) => {
    navigation.navigate("Chat", {
     
      otherUserId: [user.id],
      name: user.firstName + ' '+ user.lastName,
    });
  };
  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
      <Text style={styles.userName}>{item.firstName + ' '+ item.lastName || "Nepoznati korisnik"}</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#013868" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Potražite"
            value={searchText}
            onChangeText={handleSearch}
            autoFocus={true}
          />
        </View>
        {loading ? ( 
          <ActivityIndicator size="large" color="#013868" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.userList}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C7C7C7",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C7C7C7",
    paddingTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 5,
  },
  userList: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  userItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userName: {
    fontSize: 16,
    color: "#000",
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default SearchScreen;
