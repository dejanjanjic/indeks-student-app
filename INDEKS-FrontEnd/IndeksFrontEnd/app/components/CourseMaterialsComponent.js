import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "react-native";

const CourseMaterialsComponent = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Materijali</Text>
      <TouchableOpacity>
        <Image
          source={require("../assets/images/zip.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 9,
    margin: 0,
    height: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginLeft: 17,
    padding: 0,
    textAlign: "left",
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 17,
    marginTop: 10,
  },
});
export default CourseMaterialsComponent;
