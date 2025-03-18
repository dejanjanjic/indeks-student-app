import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import HttpService from "../services/HttpService";
import { useUser } from "../hooks/useUser";
import { useNavigation, useRoute } from "@react-navigation/native";

const ModalLeaveGroup = ({ visible, onClose, chatId }) => {
  const user = useUser();
  const navigation = useNavigation();
  const onLeaveGroup = async () => {
    try {
      const id = user.accountId;
      const payload = {
        groupChatId: chatId,
        accountId: id,
      };
      await HttpService.create("group/removeMember", payload);
      Alert.alert("Uspešno", "Napustili ste grupu.");
    } catch (error) {
      Alert.alert("Greška", "Došlo je do greške prilikom napuštanja grupe.");
    }
    onClose();
    navigation.navigate("ChatList");
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Postavke grupe</Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={onLeaveGroup} // Poziv funkcije za HTTP zahtev
          >
            <Text style={styles.modalButtonText}>Napusti grupu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.closeButton]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Zatvori</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ccc",
  },
});

export default ModalLeaveGroup;
