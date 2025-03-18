import { StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../config/colors";
import fonts from "../config/fonts";

export default function BigBasicButtonComponent({
  children,
  style,
  onPress,
  disabled,
}) {
  return (
    <TouchableOpacity
      style={[styles.loginButton, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.loginText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  loginText: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 26,
  },
});
