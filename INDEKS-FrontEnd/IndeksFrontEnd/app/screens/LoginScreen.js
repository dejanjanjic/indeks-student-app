import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { BlurView } from "expo-blur";

import fonts from "../config/fonts";
import IndeksBackground from "../components/IndeksBackground";
import LogoWithTitleComponent from "../components/LogoWithTitleComponent";
import colors from "../config/colors";
import IndeksTextInput from "../components/IndeksTextInput";
import BigBasicButtonComponent from "../components/BigBasicButtonComponent";
import authApi from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import { jwtDecode } from "jwt-decode";

Yup.setLocale({
  mixed: {
    required: 'Polje "${label}" je obavezno.',
  },
  string: {
    email: "Unesite ispravnu e-mail adresu.",
    min: 'Polje "${label}" mora sadržavati najmanje ${min} karaktera.',
  },
});

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("E-Mail"),
  password: Yup.string().required().label("Lozinka"),
});

const LoginScreen = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
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

  const handleLoginPress = async ({ email, password }) => {
    setLoading(true);
    try {
      setLoginError(""); // Reset error state
      const response = await authApi.login(email, password);
      if (response.token) {
        authStorage.storeToken(response.token);
        const user = jwtDecode(response.token);
        authContext.setUser(user);
      } else {
        setLoginError("Neispravni kredencijali.");
      }
    } catch (error) {
      setLoginError("Greška u prijavi. Molimo proverite vaše podatke.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <IndeksBackground>
      {loading && (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
        />
      )}
      <LogoWithTitleComponent style={styles.logoContainer} />
      <View style={[styles.container, loading && styles.disabledContainer]}>
        <Text style={styles.title}>Prijava</Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleLoginPress}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <>
              <View style={styles.inputs}>
                <IndeksTextInput
                  placeholder="E-Mail"
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  style={styles.usernameInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <IndeksTextInput
                  placeholder="Lozinka"
                  secureTextEntry={true}
                  onChangeText={handleChange("password")}
                  autoCapitalize="none"
                />
                {(touched.email || touched.password) && (
                  <Text style={styles.errorText}>
                    {errors.email || errors.password || loginError}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPasswordPress}
              >
                <Text style={styles.forgotPassword}>Zaboravljena šifra?</Text>
              </TouchableOpacity>
              <BigBasicButtonComponent
                style={styles.loginButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                PRIJAVI SE
              </BigBasicButtonComponent>
            </>
          )}
        </Formik>
      </View>
      {!keyboardVisible && !loading && (
        <View style={styles.loginLink}>
          <Text style={styles.accountText}>Nemate nalog?</Text>
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text style={styles.createAccount}>Kreirajte nalog</Text>
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
};
const styles = StyleSheet.create({
  accountText: {
    color: colors.black,
    fontFamily: fonts.primaryMedium,
    fontSize: 18,
  },
  container: {
    flex: 1,
    flexBasis: "25%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  createAccount: {
    color: colors.primary,
    fontFamily: fonts.primaryBold,
    fontSize: 18,
    paddingLeft: 10,
  },
  errorText: {
    alignSelf: "flex-end",
    color: "red",
    fontFamily: fonts.primaryBold,
    paddingRight: 10,
    fontSize: 10,
  },
  forgotPassword: {
    color: colors.primary,
    fontFamily: fonts.primaryBold,
    fontSize: 14,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    paddingRight: 10,
  },
  inputs: {
    width: "100%",
  },
  loginButton: {
    width: "65%",
    marginVertical: 5,
  },
  loginLink: {
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    borderTopWidth: 3,
    borderColor: colors.primary,
    flexDirection: "row",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    paddingBottom: 5,
    paddingLeft: 15,
    width: "100%",
    fontSize: 32,
    color: colors.white,
    fontFamily: fonts.primaryBold,
  },
  usernameInput: {
    marginBottom: 25,
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

export default LoginScreen;
