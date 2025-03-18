import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

function IndeksBackground({ children }) {
  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.background}
    >
      {children}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
export default IndeksBackground;
