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
import IconFeather from "react-native-vector-icons/Feather";
import HttpService from "../services/HttpService";

const SubscriptionCards = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      const response = await HttpService.get("subscriptions/dto");
      setSubscriptions(response);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      Alert.alert("Error", "Failed to load subscription requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAccept = async (student) => {
    try {
      setProcessingId(student);
      await HttpService.update(`subscriptions/accept?id=${student}`);
      await fetchSubscriptions();
      Alert.alert("Success", `Subscription accepted`);
    } catch (error) {
      console.error("Error accepting subscription:", error);
      Alert.alert("Error", "Failed to accept subscription");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (student) => {
    try {
      setProcessingId(student);
      await HttpService.update(`subscriptions/reject?id=${student}`);
      await fetchSubscriptions();
      Alert.alert("Success", `Subscription rejected`);
    } catch (error) {
      console.error("Error rejecting subscription:", error);
      Alert.alert("Error", "Failed to reject subscription");
    } finally {
      setProcessingId(null);
    }
  };

  const renderItem = ({ item }) => {
    if (item.request === false) {
      return null;
    }

    return (
      <View style={styles.itemContainer}>
        <View style={styles.iconContainer}>
          <IconFeather name="user" size={40} color="#a6a6a6" />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.nameText}>{item.student}</Text>
          <Text style={styles.statusText}>{item.subject}</Text>
        </View>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item.id)}
          disabled={processingId === item.id}
        >
          {processingId === item.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <IconFeather name="check" size={22} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(item.id)}
          disabled={processingId === item.id}
        >
          {processingId === item.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <IconFeather name="x" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#013868" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Zahtjevi za instrukcije</Text>
      {subscriptions.length > 0 ? (
        <FlatList
          data={subscriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nema zahtjeva za instrukcije</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginVertical: 6,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#013868",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default SubscriptionCards;
