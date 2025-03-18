import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import fonts from "../config/fonts";
import LogoWithTitleComponent from "../components/LogoWithTitleComponent";
import IndeksBackground from "../components/IndeksBackground";

const InitialScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <IndeksBackground>
      <LogoWithTitleComponent style={styles.logoContainer} />
    </IndeksBackground>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: "center",
    flex: 1,
  },
});

export default InitialScreen;
