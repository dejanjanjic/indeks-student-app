import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderComponent from "../components/HeaderComponent";
import TutorSideBar from "../components/TutorSideBarComponent";
import SubscriptionCards from "../components/SubscriptionCards";

const SubscriptionsScreen = () => {
  const [isTutorSideBarVisible, setTutorSideBarVisible] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setTutorSideBarVisible(!isTutorSideBarVisible);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        leftIcon="arrow-left"
        leftAction={() => navigation.goBack()}
        centerLogo={require("../assets/images/logo.png")}
        centerText="Indeks"
        rightAction={toggleSidebar}
      />
      <SubscriptionCards />
      <TutorSideBar visible={isTutorSideBarVisible} onClose={toggleSidebar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
});

export default SubscriptionsScreen;
