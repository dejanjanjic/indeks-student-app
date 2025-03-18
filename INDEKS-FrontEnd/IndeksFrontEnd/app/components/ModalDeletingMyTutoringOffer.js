import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ModalDeletingMyTutoringOffer = ({
  visible,
  onClose,
  onConfirm,
  tutoringOfferId,
  subjectName,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Brisanje ponude za instrukcije</Text>
          <Text style={styles.message}>
            Da li ste sigurni da želite izbrisati ponudu za predmet{" "}
            <Text style={styles.subjectName}>{subjectName}</Text>?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Otkaži</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                console.log(
                  `Ponuda  "${subjectName}" sa ID-jem ${tutoringOfferId} je obrisana.`
                );
                onConfirm(tutoringOfferId);
              }}
            >
              <Text style={styles.confirmButtonText}>Izbriši</Text>
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
  groupName: {
    fontWeight: "bold",
    color: "#d32f2f",
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

export default ModalDeletingMyTutoringOffer;
