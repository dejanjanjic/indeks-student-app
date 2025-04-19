import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import HttpService from "../services/HttpService";
import HeaderComponent from "../components/HeaderComponent";
import CourseMaterialsComponent from "../components/CourseMaterialsComponent";
import ModalReportReview from "../components/ModalReportReview";
import ModalAddReview from "../components/ModalAddReview";
import { useUser } from "../hooks/useUser";
import ModalDeleteReview from "../components/ModelDeleteReview";
import httpService from "../services/HttpService";

const InstructionDetailsScreen = ({ route }) => {
  const { navigate, id, courseTitle, instructor, description } = route.params;
  const navigation = useNavigation();

  const [reviews, setReviews] = useState([]);
  const [editableDescription, setEditableDescription] = useState(description);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReportReviewModalVisible, setReportReviewModalVisible] =
    useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reportDescription, setReportDescription] = useState("");

  const [isAddReviewModalVisible, setAddReviewModalVisible] = useState(false);
  //const [selectedReview, setSelectedReview] = useState(null);
  const [addReviewDescription, setAddReviewDescription] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const user = useUser();
  const [instructorAccountId, setInstructorAccountId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await HttpService.get(`tutoringOffer/${id}/with-reviews`);
        console.log(data);
        if (data) {
          setReviews(data.reviews || []);
          setEditableDescription(data.description || description);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [description]);

  useEffect(() => {
    const fetchInstructorId = async () => {
      if (instructor) {
        const [firstName, lastName] = instructor.split(" ");
        try {
          const response = await HttpService.get(
            `tutorAccount/by-name?firstName=${firstName}&lastName=${lastName}`
          );
          setInstructorAccountId(response);
        } catch (error) {
          console.error("Error fetching instructor ID:", error);
        }
      }
    };

    fetchInstructorId();
  }, [instructor]);

  const handleSubscribeButton = async () => {
    console.log("povezano");
  };
  const handleSubmitReport = async () => {
    if (!reportDescription.trim()) {
      Alert.alert("Greška", "Opis prijave ne može biti prazan.");
      return;
    }

    console.log(selectedReview);
    console.log("Opis:", reportDescription);

    const payload = {
      reason: reportDescription,
      time: new Date().toISOString(),
      type: 0,
      reviewId: selectedReview.id,
      materialId: 0,
      reporterId: user.accountId,
      reportedId: 0,
    };
    const response = await HttpService.create(
      "problemReport/newReport",
      payload
    );
    console.log(response);
    console.log(payload);
    setReportReviewModalVisible(false);

    setReportDescription("");
    setSelectedReview(null);

    Alert.alert("Uspješno", "Vaša prijava je poslata.");
  };

  const handleAddReview = async () => {
    if (!addReviewDescription.trim()) {
      Alert.alert("Greška", "Opis recenzije ne može biti prazan.");
      return;
    }
    if (selectedRating == 0) {
      Alert.alert("Greška", "Rating ne može biti prazan.");
      return;
    }
    console.log("Recenzija za:", courseTitle, " : ", instructor);
    console.log("Opis:", addReviewDescription);
    setAddReviewModalVisible(false);
    setReportDescription("");
    setSelectedReview(null);
    const payload = {
      comment: addReviewDescription,
      dateTime: new Date().toISOString(),
      tutoringOfferId: id,
      studentAccountId: user.accountId,
      rating: selectedRating,
    };

    const response = await HttpService.create("review", payload);
    console.log(payload);
    console.log(response);
    reviews.push(response);
    Alert.alert("Uspješno", "Vaša recenzija je dodata.");
  };

  const back = () => {
    navigation.navigate(navigate);
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? "star" : "star-border"}
          size={24}
          color={i <= rating ? "#c7c7c7" : "#ccc"}
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };
  const handleDelete = async () => {
    await httpService.delete(`review/${selectedReview.id}`);
    const updatedData = reviews.filter((item) => item.id !== selectedReview.id);
    setReviews(updatedData);
  };
  const handleLongPress = (review) => {
    setSelectedReview(review);
    setReportDescription("");
    setReportReviewModalVisible(true);
  };

  const renderInteractiveStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setSelectedRating(i)}>
          <Icon
            name={i <= selectedRating ? "star" : "star-border"}
            size={32}
            color={i <= selectedRating ? "#ccc" : "#ccc"}
            style={styles.starIcon}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handlePlusPress = () => {
    setAddReviewDescription("");
    setAddReviewModalVisible(true);
    setSelectedRating(0);
  };

  const renderReview = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onLongPress={() => handleLongPress(item)}
    >
      <View style={styles.reviewContainer}>
        <Icon name="person" size={40} color="#888" style={styles.userIcon} />
        <View style={styles.reviewTextContainer}>
          <Text style={styles.userName}>{item.reviewerName}</Text>
          <Text style={styles.comment}>{item.description}</Text>
        </View>
        <View style={styles.ratingContainer}>{renderStars(item.grade)}</View>
      </View>
    </TouchableOpacity>
  );

  const handleChatPress = async () => {
    if (!instructorAccountId) {
      Alert.alert("Greška", "ID instruktora nije pronađen.");
      return;
    }

    try {
      const existingChatId = await HttpService.get(
        `singleChat/exists?firstParticipantId=${user.accountId}&secondParticipantId=${instructorAccountId}`
      );

      let finalChatId = existingChatId;

      if (!existingChatId) {
        const response = await HttpService.create("singleChat", {
          firstParticipantId: user.accountId,
          secondParticipantId: instructorAccountId,
        });

        // Dodajemo proveru da li `response` nije null/undefined i da li sadrži `chatId` ????
        if (response && response.chatId) {
          finalChatId = response.chatId;
        } else {
          Alert.alert("Greška", "Nije moguće kreirati razgovor.");
          return;
        }
      }

      if (finalChatId) {
        navigation.navigate("Chat", {
          chatId: finalChatId,
          otherUserId: instructorAccountId,
          name: instructor,
          group: false,
        });
      }
    } catch (error) {
      console.error("Error opening chat:", error);
      Alert.alert("Greška", "Došlo je do problema pri otvaranju chata.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="arrow-left"
        leftAction={() => navigation.goBack()}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
      />

      <View style={styles.content}>
        <View style={styles.courseInfoContainer}>
          <View style={styles.courseHeader}>
            <Icon
              name="menu-book"
              size={50}
              color="#003366"
              style={styles.courseIcon}
            />
            <View>
              <Text style={styles.courseTitle}>{courseTitle}</Text>
              <Text style={styles.instructor}>{instructor}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Opis</Text>
          {isEditing ? (
            <TextInput
              style={styles.descriptionInput}
              value={editableDescription}
              onChangeText={setEditableDescription}
              onBlur={() => setIsEditing(false)}
              autoFocus={true}
            />
          ) : (
            <TouchableOpacity onLongPress={() => setIsEditing(true)}>
              <Text style={styles.description}>{editableDescription}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => handleSubscribeButton()}
            >
              <Text style={styles.buttonText}>Prijava</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => handleChatPress()}
            >
              <Text style={styles.buttonText}>Razgovor</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recenzije</Text>
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
        />
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePlusPress}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      {user.accountType === "STUDENT" ? (
        <ModalReportReview
          visible={isReportReviewModalVisible}
          onClose={() => setReportReviewModalVisible(false)}
          onSubmit={handleSubmitReport}
          reportDescription={reportDescription}
          setReportDescription={setReportDescription}
        />
      ) : user.accountType === "ADMIN" ? (
        <ModalDeleteReview
          visible={isReportReviewModalVisible}
          onClose={() => setReportReviewModalVisible(false)}
          onSubmit={handleDelete}
        />
      ) : null}

      <ModalAddReview
        visible={isAddReviewModalVisible}
        onClose={() => setAddReviewModalVisible(false)}
        onSubmit={handleAddReview}
        courseTitle={courseTitle}
        instructor={instructor}
        renderInteractiveStars={renderInteractiveStars}
        addReviewDescription={addReviewDescription}
        setAddReviewDescription={setAddReviewDescription}
        selectedRating={selectedRating}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7c7c7",
  },
  descriptionInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginRight: 130,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  courseInfoContainer: {
    marginVertical: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseIcon: {
    marginRight: 15,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  instructor: {
    color: "#555",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "bold",
  },
  description: {
    color: "#555",
    marginTop: 8,
    lineHeight: 20,
  },
  reviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  reviewTextContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  userName: {
    fontWeight: "bold",
    color: "#003366",
  },
  comment: {
    color: "#555",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginHorizontal: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#999" },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  customButton: {
    flex: 1,
    backgroundColor: "#013868",
    paddingVertical: 7,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InstructionDetailsScreen;
//idemoooo
