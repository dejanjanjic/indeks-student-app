import React, { useState } from "react";
import HttpService from "../services/HttpService";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

const ModalReportingUserFromChat = ({
  visible,
  onClose,
  userName,
  userId,
  chatId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportDescription, setReportDescription] = useState("");

  const handleReportUser = async () => {
    if (!reportDescription.trim()) {
      Alert.alert("Greška", "Molimo vas da unesete razlog prijave.");
      return;
    }

    const payload = {
      reason: reportDescription,
      time: new Date().toISOString(),
      type: 2,
      reviewId: 0,
      materialId: 0,
      reporterId: userId,
      reportedId: chatId,
    };

    setIsLoading(true);
    try {
      const response = await HttpService.create("problemReport/newReport", payload);
      console.log(payload);
      Alert.alert("Uspješno", "Vaša prijava je poslata.");
      setReportDescription(""); 
      onClose(); 
    } catch (error) {
      console.error(error);
      Alert.alert("Greška", "Došlo je do greške prilikom prijave.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Prijavljivanje korisnika</Text>
          <Text style={styles.message}>
            Da li ste sigurni da želite prijaviti korisnika{" "}
            <Text style={styles.userName}>{userName}</Text>?
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Unesite razlog prijave"
            value={reportDescription}
            onChangeText={setReportDescription}
            multiline
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Otkaži</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleReportUser}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Prijavi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  userName: {
    fontWeight: "bold",
    color: "#d32f2f",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    minHeight: 60,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ddd",
    borderRadius: 5,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#d32f2f",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ModalReportingUserFromChat;
