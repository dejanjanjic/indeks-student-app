import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HeaderComponent from "../components/HeaderComponent";
import Sidebar from "../components/SidebarComponent";
import TutorSidebar from "../components/TutorSideBarComponent";
import * as FileSystem from "expo-file-system";
import { useUser } from "../hooks/useUser";
import HttpService from "../services/HttpService";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

const MyMaterialScreen = ({ route, navigation }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [reportDescription, setReportDescription] = useState("");
  const user = useUser();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      console.log(id);

      const id = user.accountId;

      const response = await HttpService.get(`material/owner/${id}`);
      console.log(response);
      if (response.error) {
        console.error(response.message);
      } else {
        setMaterials(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (material) => {
    try {
      console.log("Material info:", material);

      const response = await HttpService.get(
        `material/material/${material.id}`
      );
      if (response.error) {
        Alert.alert(
          "Download Failed",
          response.message || "Unknown error occurred"
        );
        return;
      }

      const base64 = response.base64Content;
      const tempUri = FileSystem.documentDirectory + material.name;

      await FileSystem.writeAsStringAsync(tempUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileInfo = await FileSystem.getInfoAsync(tempUri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "Temporary file could not be created.");
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this device.");
        return;
      }

      await Sharing.shareAsync(tempUri);
      //Alert.alert("Success", `${material.name} has been shared successfully.`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    }
  };

  const handlePlusClick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

      if (result.canceled) {
        console.log("File selection canceled");
        return;
      }

      const file = result.assets[0];
      const fileUri = file.uri;

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const payload = {
        base64: base64,
        name: file.name,
        subjectId: 163,
        ownerAccountId: user.accountId,
      };

      const response = await HttpService.create("material/upload", payload);

      if (response.error) {
        console.error(response.message);
      } else {
        console.log("File uploaded successfully:", response);
        fetchMaterials();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLongPress = (material) => {
    setSelectedMaterial(material);
    setReportDescription("");
    setModalVisible(true);
  };

  const handleSubmitReport = async () => {
    if (!reportDescription.trim()) {
      Alert.alert("Greška", "Opis prijave ne može biti prazan.");
      return;
    }

    console.log("Prijava za:", selectedMaterial?.name);
    console.log("Opis:", reportDescription);

    const payload = {
      reason: reportDescription,
      time: new Date().toISOString(),
      type: 1,
      reviewId: 0,
      materialId: selectedMaterial.id,
      reporterId: user.accountId,
      reportedId: 0,
    };
    const response = await HttpService.create(
      "problemReport/newReport",
      payload
    );
    console.log(response);
    console.log(payload);
    Alert.alert("Uspješno", "Vaša prijava je poslata.");
    setModalVisible(false);
    setReportDescription("");
    setSelectedMaterial(null);
  };

  const handleSubmitDelete = async () => {
    console.log(selectedMaterial.id);
    await HttpService.delete(`material/${selectedMaterial.id}`);
    setModalVisible(false);
    setSelectedMaterial(null);
    setMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material.id !== selectedMaterial.id)
    );
    Alert.alert("Uspješno", "Materijal je uspješno obrisan");
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onLongPress={() => handleLongPress(item)}
    >
      <View style={styles.iconContainer}>
        <Icon name="file-text" size={22} color="#013868" />
      </View>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => {
          setSelectedMaterial(item);
          setModalVisible(true);
        }}
      >
        <Icon name="trash" size={30} color="#013868" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="bars"
        leftAction={() => toggleSidebar()}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />
      <Text style={styles.title}>Moji materijali</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#013868" />
      ) : (
        <FlatList
          data={materials}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.cardList}
        />
      )}

      {user.accountType === "STUDENT" ? (
        <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
      ) : (
        <TutorSidebar visible={isSidebarVisible} onClose={toggleSidebar} />
      )}

      {user.accountType !== "STUDENT" && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handlePlusClick}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#c7c7c7" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#013868",
    textAlign: "center",
    marginVertical: 15,
  },
  cardList: { marginTop: 10, paddingHorizontal: 20 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8EAF6",
    borderRadius: 20,
  },
  itemTitle: { fontSize: 16, fontWeight: "bold", color: "#013868", flex: 1 },
  downloadButton: { padding: 10 },
  floatingButton: {
    position: "absolute",
    right: 30,
    bottom: 60,
    width: 60,
    height: 60,
    backgroundColor: "#013868",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 33,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalDescription: { fontSize: 16, color: "#013868", marginBottom: 10 },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    backgroundColor: "#013868",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  floatingButton: {
    position: "absolute",
    right: 30,
    bottom: 60,
    width: 60,
    height: 60,
    backgroundColor: "#013868",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 33,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#999" },
});

export default MyMaterialScreen;
