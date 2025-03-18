import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import fonts from "../config/fonts";
import colors from "../config/colors";

function IndeksTextInput({
  placeholder,
  secureTextEntry,
  style,
  onChangeText,
  value,
  enabled,
  keyboardType,
  autoCapitalize,
  autoComplete,
}) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#919191"
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
      value={value}
      enabled={enabled}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: fonts.primary,
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
  },
});
export default IndeksTextInput;
