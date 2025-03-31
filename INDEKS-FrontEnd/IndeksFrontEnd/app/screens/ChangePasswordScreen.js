import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Sidebar from "../components/SidebarComponent";
import HeaderComponent from "../components/HeaderComponent";
import { useNavigation } from "@react-navigation/native";
import HttpService from "../services/HttpService";
import { useUser } from "../hooks/useUser";

const ChangePasswordScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const user = useUser()
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleConfirm = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Greška", "Lozinke se ne podudaraju!");
      return;
    }
    
    
    setLoading(true);
    console.log("AAAAAAAa")
    try {
      const response = await HttpService.update("account/password", {
        userId: user.accountId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      console.log(response)
      setLoading(false);

      if (response.error) {
        Alert.alert("Greška", response.message || "Došlo je do greške.");
        return;
      }

      Alert.alert("Uspjeh", "Lozinka je uspješno izmijenjena!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Greška", "Došlo je do greške. Pokušajte ponovo.");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="arrow-left"
        leftAction={() => navigation.goBack()}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <View style={styles.inputContainer}>
        <Text style={styles.headerTitle}>Promjena lozinke</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesite staru lozinku"
          secureTextEntry={true}
          value={oldPassword}
          onChangeText={(text) => setOldPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Unesite novu lozinku"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Potvrdite novu lozinku"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#013868" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Potvrdi</Text>
        </TouchableOpacity>
      )}

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
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#013868",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: "#013868",
    borderRadius: 8,
    marginHorizontal: 100,
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default ChangePasswordScreen;
