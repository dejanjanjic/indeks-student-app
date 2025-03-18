import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { BlurView } from "expo-blur";

import BigBasicButtonComponent from "../components/BigBasicButtonComponent";
import IndeksBackground from "../components/IndeksBackground";
import IndeksTextInput from "../components/IndeksTextInput";
import LogoWithTitleComponent from "../components/LogoWithTitleComponent";
import colors from "../config/colors";
import fonts from "../config/fonts";
import HttpService from "../services/HttpService";

Yup.setLocale({
  mixed: {
    required: "Polje ${label} je obavezno.",
  },
});

const validationSchema = Yup.object().shape({
  password: Yup.string().required().label("Lozinka"),
});

export default function NewPasswordScreen({ route }) {
  const { email } = route.params;
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const showKeyboard = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, []);

  const handleSss = async ({ email }) => {
    setLoading(true);
    try {
      const response = await HttpService.create(
        `account/recover?email=${email}`
      );

      if (response.status === undefined) {
        Alert.alert(
          "Kod za oporavak lozinke je poslan na uneseni imejl.",
          "Unesite novu lozinku kako biste potvrdili da ste dobili mejl.",
          [{ text: "OK" }]
        );
        navigation.navigate("NewPassword", { email: email });
      } else {
        Alert.alert(
          "Greška",
          "Došlo je do greške prilikom slanja koda. Ne postoji nalog za navedeni mejl."
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Greška",
        "Došlo je do greške prilikom slanja koda. Server nije u funkciji."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendCodePress = async ({ password }) => {
    console.log("a");
    console.log(password);
    setLoading(true);
    try {
      const response = await HttpService.create(
        `account/update-password?email=${email}&tempPassword=${password}&newPassword=${password}`
      );
      console.log(password);
      console.log(response);
      if (response === "Password updated successfully.") {
        Alert.alert("Čestitamo", "Uspješno ste promijenili lozinku.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Greška", "Unijeli ste pogrešnu lozinku.");
      }
    } catch (error) {
      Alert.alert("Greška", "Greška u oporavku lozinke.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <IndeksBackground>
      {loading && (
        <BlurView style={StyleSheet.absoluteFill} intensity={50} tint="dark" />
      )}
      <LogoWithTitleComponent style={styles.logoContainer} />
      <View style={[styles.container, loading && styles.disabledContainer]}>
        <Text style={styles.title}>Oporavak lozinke</Text>
        <Formik
          initialValues={{ password: "" }}
          onSubmit={handleSendCodePress}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <IndeksTextInput
                placeholder="Lozinka"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry={true}
                autoCapitalize="none"
              />
              <BigBasicButtonComponent
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
              >
                POTVRDI
              </BigBasicButtonComponent>
            </>
          )}
        </Formik>
      </View>
      {!keyboardVisible && !loading && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBackToLoginPress}>
            <Text style={styles.footerText}>Vrati se na prijavu</Text>
          </TouchableOpacity>
        </View>
      )}
      {loading && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </IndeksBackground>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "85%",
    marginVertical: 15,
  },
  container: {
    flex: 3,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoContainer: {
    flex: 2,
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    width: "100%",
    paddingLeft: 15,
    color: colors.white,
    fontFamily: fonts.primaryBold,
    marginBottom: 10,
  },
  footer: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    borderTopWidth: 2,
    borderColor: colors.primary,
  },
  footerText: {
    color: colors.primary,
    fontFamily: fonts.primaryBold,
    fontSize: 18,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontFamily: fonts.primaryBold,
  },
  activityIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  disabledContainer: {
    opacity: 0.5,
  },
});
