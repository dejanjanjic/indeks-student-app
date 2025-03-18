import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const HeaderComponent = ({
  leftIcon,
  leftAction,
  centerLogo,
  centerText,
  rightIcon,
  rightAction,
}) => {
  return (
    <View style={styles.header}>
      {/* Levi deo */}
      {leftIcon ? (
        <TouchableOpacity onPress={leftAction} style={styles.iconContainer}>
          <Icon name={leftIcon} size={28} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      {/* Srednji deo */}
      <View style={styles.centerContainer}>
        {centerLogo && (
          <Image
            source={centerLogo}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        )}
        {centerText && <Text style={styles.headerText}>{centerText}</Text>}
      </View>

      {/* Desni deo */}
      {rightIcon ? (
        <TouchableOpacity onPress={rightAction} style={styles.iconContainer}>
          <Icon name={rightIcon} size={28} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#013868",
    paddingTop: 45,
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: "relative", // Potrebno za apsolutno pozicioniranje centra
  },
  centerContainer: {
    position: "absolute", // Apsolutno centriranje
    top: 45, // Mora biti isto kao paddingTop za pravilno poravnanje
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: 40, // Veličina logotipa
    height: 40,
    marginRight: 8, // Razmak između logoa i teksta
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  iconPlaceholder: {
    width: 28, // Širina ikone za balans
  },
});

export default HeaderComponent;
