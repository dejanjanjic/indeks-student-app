import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HttpService from "../services/HttpService";
import { useUser } from "../hooks/useUser";

const NewPrivateGroupScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [groupName, setGroupName] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useUser()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await HttpService.get("userAccount");
        console.log("API response:", users);

        const resp = users.filter(
          (account) => account.id !== user.accountId
        );
        
        setAllUsers(
          resp.map((user) => ({
            id: user.id,
            name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
          }))
        );
        setLoading(false);
      } catch (err) {
        setError("Greška prilikom učitavanja korisnika.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) &&
      !addedUsers.some((added) => added.id === user.id)
  );

  const addUser = (user) => {
    setAddedUsers([...addedUsers, user]);
    setSearchText("");
  };

  const removeUser = (user) => {
    setAddedUsers(addedUsers.filter((u) => u.id !== user.id));
  };

  const createGroup = () => {
    if (addedUsers.length < 2) {
      alert("Morate dodati najmanje 2 korisnika.");
      return;
    }

    if (!groupName.trim()) {
      alert("Unesite naziv grupe.");
      return;
    }

    console.log("Grupa kreirana sa nazivom:", groupName);
    const userIds = addedUsers.map(user => user.id);

    
    navigation.navigate("Chat", { otherUserId: userIds, groupName : groupName,group :true });
  };

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
          <Text style={styles.title}>Nova grupa</Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Pronađite korisnike koje ćete dodati"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.searchContainer}>
          <Icon name="users" size={20} color="#aaa" />
          <TextInput
            style={[
              styles.input,
              addedUsers.length < 2 && styles.disabledInput,
            ]}
            placeholder="Unesite naziv grupe"
            value={groupName}
            onChangeText={setGroupName}
            editable={addedUsers.length >= 2}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => addUser(item)}
              >
                <Text style={styles.userText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.userList}
          />
        ) : (
          <Text style={styles.noResultsText}>Nema rezultata za pretragu.</Text>
        )}

        {/* Prikaz dodanih korisnika */}
        <View style={styles.addedUsersContainer}>
          {addedUsers.map((user) => (
            <View style={styles.addedUserItem} key={user.id}>
              <Text style={styles.addedUserText}>{user.name}</Text>
              <TouchableOpacity onPress={() => removeUser(user)}>
                <Icon name="times" size={20} color="#f00" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {addedUsers.length > 0 && (
          <TouchableOpacity style={styles.createButton} onPress={createGroup}>
            <Icon name="check" size={24} color="#fff" />
          </TouchableOpacity>
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
    justifyContent: "flex-start",
    backgroundColor: "#C7C7C7",
    paddingTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  userList: {
    maxHeight: 150,
    marginHorizontal: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userText: {
    fontSize: 16,
  },
  addedUsersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
  },
  addedUserItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e7f3ff",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  addedUserText: {
    marginRight: 10,
  },
  disabledInput: {
    backgroundColor: "#e0e0e0",
    color: "#aaa",
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  noResultsText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#555",
  },
});

export default NewPrivateGroupScreen;
