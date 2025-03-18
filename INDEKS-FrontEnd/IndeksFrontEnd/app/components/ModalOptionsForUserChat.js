import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ModalOptionsForUserChat = ({
  visible,
  onClose,
  onBlockUser,
  onReportUser,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Dodatne opcije</Text>

          {/* Prijava korisnika */}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              onClose();
              onReportUser();
            }}
          >
            <Text style={styles.modalButtonText}>Prijavi korisnika</Text>
          </TouchableOpacity>

          {/* Blokiranje korisnika */}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              onClose();
              onBlockUser();
            }}
          >
            <Text style={styles.modalButtonText}>Blokiraj korisnika</Text>
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
    backgroundColor: "#013868",
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

export default ModalOptionsForUserChat;
