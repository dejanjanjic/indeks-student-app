import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  TouchableHighlight,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import fonts from "../config/fonts";
import { Formik } from "formik";
import * as Yup from "yup";
import { BlurView } from "expo-blur";

import IndeksBackground from "../components/IndeksBackground";
import colors from "../config/colors";
import IndeksTextInput from "../components/IndeksTextInput";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BigBasicButtonComponent from "../components/BigBasicButtonComponent";
import authApi from "../api/auth";

Yup.setLocale({
  mixed: {
    required: 'Polje "${label}" je obavezno.',
  },
  string: {
    email: "Unesite ispravnu e-mail adresu.",
    min: 'Polje "${label}" mora sadržavati najmanje ${min} karaktera.',
    domain: "E-mail adresa mora biti od ETF studentskog naloga.",
  },
});

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().label("Ime"),
  lastName: Yup.string().required().label("Prezime"),
  email: Yup.string()
    .required()
    .email()
    // .matches(
    //   /^[^@]+@([a-zA-Z0-9-]+\.)*etf\.unibl\.org$/,
    //   "E-mail mora završavati na etf.unibl.org."
    // )

    .label("E-Mail"),
  password: Yup.string().required().min(8).label("Lozinka"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Lozinke se ne poklapaju.")
    .required()
    .label("Ponovljena lozinka"),
});

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [userAccountSelected, setUserAccountSelected] = useState(true);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [registerError, setRegisterError] = useState("");
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
  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleRegisterPress = async ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    setLoading(true);
    try {
      const accountType = userAccountSelected ? "STUDENT" : "TUTOR";
      console.log(firstName + " " + lastName + " " + email + " " + password);
      const response = await authApi.register(
        firstName,
        lastName,
        email,
        password,
        userAccountSelected
      );
      console.log(response);
      if (response.message) {
        navigation.navigate("Login");
      } else {
        setRegisterError("E-Mail već postoji.");
      }
    } catch (error) {
      setRegisterError("Greška prilikom registracije.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAccountSelect = () => {
    if (!userAccountSelected) {
      setUserAccountSelected(true);
    }
  };
  const handleInstructorAccountSelect = () => {
    if (userAccountSelected) {
      setUserAccountSelected(false);
    }
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
      <View style={[styles.container, loading && styles.disabledContainer]}>
        <Text style={styles.title}>Registracija</Text>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            repeatPassword: "",
          }}
          onSubmit={handleRegisterPress}
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
              <IndeksTextInput
                placeholder="Ime"
                style={styles.input}
                onChangeText={handleChange("firstName")}
                onBlur={() => setFieldTouched("firstName")}
              />
              <IndeksTextInput
                placeholder="Prezime"
                style={styles.input}
                onChangeText={handleChange("lastName")}
                onBlur={() => setFieldTouched("lastName")}
              />
              <IndeksTextInput
                placeholder="E-Mail"
                style={styles.input}
                onChangeText={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <IndeksTextInput
                placeholder="Lozinka"
                style={styles.input}
                secureTextEntry={true}
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                autoCapitalize="none"
              />
              <IndeksTextInput
                placeholder="Ponovljena lozinka"
                style={styles.input}
                secureTextEntry={true}
                onChangeText={handleChange("repeatPassword")}
                onBlur={() => setFieldTouched("repeatPassword")}
                autoCapitalize="none"
              />
              <View style={styles.buttonsContainer}>
                <TouchableHighlight
                  style={[
                    styles.iconButton,
                    styles.iconButtonLeft,
                    {
                      backgroundColor: userAccountSelected
                        ? colors.white
                        : colors.primary,
                    },
                  ]}
                  onPress={handleUserAccountSelect}
                >
                  <View style={styles.iconButtonContent}>
                    <FontAwesome5
                      name="user-graduate"
                      size={30}
                      color={
                        userAccountSelected ? colors.primary : colors.white
                      }
                    />
                    <Text
                      style={[
                        styles.iconButtonText,
                        {
                          color: userAccountSelected
                            ? colors.primary
                            : colors.white,
                        },
                      ]}
                    >
                      Student
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[
                    styles.iconButton,
                    styles.iconButtonRight,
                    {
                      backgroundColor: userAccountSelected
                        ? colors.primary
                        : colors.white,
                    },
                  ]}
                  onPress={handleInstructorAccountSelect}
                >
                  <View style={styles.iconButtonContent}>
                    <FontAwesome5
                      name="book-reader"
                      size={30}
                      color={
                        userAccountSelected ? colors.white : colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.iconButtonText,
                        {
                          color: userAccountSelected
                            ? colors.white
                            : colors.primary,
                        },
                      ]}
                    >
                      Instruktor
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

              {(touched.firstName ||
                touched.lastName ||
                touched.email ||
                touched.password ||
                touched.password ||
                touched.repeatPassword) && (
                <Text style={styles.errorText}>
                  {errors.firstName ||
                    errors.lastName ||
                    errors.email ||
                    errors.password ||
                    errors.repeatPassword ||
                    registerError}
                </Text>
              )}
              <BigBasicButtonComponent
                style={styles.registerButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                REGISTRUJ SE
              </BigBasicButtonComponent>
            </>
          )}
        </Formik>
      </View>
      {!keyboardVisible && !loading && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Imate nalog?</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.footerLink}>Prijavite se</Text>
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "60%",
    marginTop: 15,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    alignSelf: "flex-end",
    color: "red",
    fontFamily: fonts.primaryBold,
    paddingRight: 10,
    fontSize: 10,
  },
  footer: {
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    borderTopWidth: 3,
    borderColor: colors.primary,
    flexDirection: "row",
  },
  footerLink: {
    color: colors.primary,
    fontFamily: fonts.primaryBold,
    fontSize: 18,
    paddingLeft: 10,
  },
  footerText: {
    color: colors.black,
    fontFamily: fonts.primaryMedium,
    fontSize: 18,
  },
  iconButton: {
    width: "40%",
    height: 50,
    justifyContent: "center",
  },
  iconButtonContent: {
    alignItems: "center",
  },
  iconButtonLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  iconButtonRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  iconButtonText: {
    fontFamily: fonts.primaryBold,
    fontSize: 10,
  },
  input: {
    marginVertical: 7,
  },
  logoContainer: {
    height: "25%",
    paddingBottom: 60,
    alignItems: "center",
    padding: 30,
  },
  registerButton: {
    width: "65%",
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    paddingLeft: 15,
    color: colors.white,
    fontFamily: fonts.primaryBold,
    width: "100%",
    marginBottom: 10,
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

export default RegisterScreen;
