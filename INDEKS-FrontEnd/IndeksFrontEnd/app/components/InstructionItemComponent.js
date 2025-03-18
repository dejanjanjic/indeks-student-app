import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const InstructionItemComponent = ({
  navigate,
  id,
  course,
  teacher,
  rating,
  icon,
}) => {
  const navigation = useNavigation();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? "star" : "star-o"}
          size={26}
          color="#A9A9A9"
        />
      );
    }
    return stars;
  };

  const CourseInfo = (course) => {
    console.log("AAAAAAAAAAa");
    console.log(navigate);
    console.log(id);
    const courseData = {
      id: id,
      courseTitle: course,
      instructor: teacher,
      description: "Zovem se Milan i držaću vam instrukcije iz matematike 1.",
    };

    navigation.navigate("InstructionInfo", { navigate, ...courseData });
  };

  return (
    <TouchableWithoutFeedback
      accessible={false}
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <TouchableOpacity
          style={[styles.itemContainer, styles.blurredContainer]}
          onPress={() => CourseInfo(course)}
        >
          <View style={styles.courseIconContainer}>
            <Icon name={icon} size={28} color="#013868" />
          </View>

          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course}</Text>
            <Text style={styles.teacherName}>{teacher}</Text>
          </View>

          <View style={styles.ratingContainer}>{renderStars()}</View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  blurredContainer: {
    backgroundColor: "#EDEDED",
  },
  courseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },
  courseInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  teacherName: {
    fontSize: 14,
    color: "#555",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  actionButtons: {
    flexDirection: "row",
    position: "absolute",
    right: 10,
    top: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#013868",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default InstructionItemComponent;
