import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const ModalReportReview = ({
  visible,
  onClose,
  onSubmit,
  reportDescription,
  setReportDescription,
}) => {
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async () => {
    setIsLoading(true); 
    try {
      await onSubmit(); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Prijava recenzije</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Opis prijave"
            value={reportDescription}
            onChangeText={setReportDescription}
            multiline
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading} // Onemogući dugme dok traje učitavanje
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" /> // Prikaz loading indikatora
              ) : (
                <Text style={styles.modalButtonText}>Prijavi</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
              disabled={isLoading} // Onemogući zatvaranje dok traje učitavanje
            >
              <Text style={styles.modalButtonText}>Otkaži</Text>
            </TouchableOpacity>
          </View>
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
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#999" },
  disabledButton: {
    backgroundColor: "#7a7a7a", // Tamnija boja za disabled dugme
  },
});

export default ModalReportReview;
