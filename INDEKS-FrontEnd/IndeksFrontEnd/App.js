import { React, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import * as Notificatons from "expo-notifications";

import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import StudentAppNavigator from "./app/navigation/StudentAppNavigator";
import TutorAppNavigator from "./app/navigation/TutorAppNavigator";
import AdminAppNavigator from "./app/navigation/AdminAppNavigator";
import authStorage from "./app/auth/storage";
import {navigationRef } from "./app/services/NavigationService"

SplashScreen.preventAutoHideAsync();

const App = () => {
  const requestPermissions = async () => {
    const { granted } = await Notificatons.requestPermissionsAsync();
    if (!granted) {
      console.log("nije prihvaceno");
    } else {
      console.log("prihvaceno");
    }
  };
  useEffect(() => {
    requestPermissions();
  }, []);
  const [loaded, error] = useFonts({
    Kodchasan: require("./app/assets/fonts/KodchasanRegular.ttf"),
    KodchasanMedium: require("./app/assets/fonts/KodchasanMedium.ttf"),
    KodchasanSemiBold: require("./app/assets/fonts/KodchasanSemiBold.ttf"),
    KodchasanBold: require("./app/assets/fonts/KodchasanBold.ttf"),
  });

  const [user, setUser] = useState();

  const restoreToken = async () => {
    const token = await authStorage.getToken();
    if (!token) return;

    const tokenDecoded = jwtDecode(token);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    console.log(currentTimestamp);
    if (tokenDecoded.exp && tokenDecoded.exp < currentTimestamp) {
      // ako je token istekao
      console.log("Token is expired");
      return;
    }

    console.log(tokenDecoded);
    setUser(tokenDecoded);
  };

  useEffect(() => {
    restoreToken();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
    <NavigationContainer ref={navigationRef}>
      {user ? renderAppNavigator(user.accountType) : <AuthNavigator />}
    </NavigationContainer>
  </AuthContext.Provider>
  );

  function renderAppNavigator(accountType) {
     console.log("Account type:", accountType);
    switch (accountType) {
      case "STUDENT":
        return <StudentAppNavigator />;
      case "TUTOR":
        return <TutorAppNavigator />;
      case "ADMIN":
        return <AdminAppNavigator />;
      default:
        return <AuthNavigator />;
    }
  }
 
};

export default App;
