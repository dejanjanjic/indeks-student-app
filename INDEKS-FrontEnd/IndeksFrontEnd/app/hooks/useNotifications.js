import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";

import expoPushTokensApi from "../api/expoPushTokens";
import { useUser } from "./useUser";
import { useNavigation } from "@react-navigation/native";

// Required
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default useNotifications = () => {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();
  const user = useUser();

  useEffect(() => {
    registerForPushNotifications();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) =>
        setNotification(notification)
      );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response.notification.request.content.data);
        console.log(response.notification.request.content.body);
        const type = response.notification.request.content.data.type;
        if (type === "message") {
          navigation.navigate("Chat", {
            chatId: response.notification.request.content.data.chatId,
            userId: user.accountId,
            name: response.notification.request.content.data.chatName,
            group: response.notification.request.content.data.isGroup,
            elementary:
              response.notification.request.content.data.isElementaryGroup,
          });
        } else if (type === "announcement") {
          navigation.navigate("Ads");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permissions = await Notifications.getPermissionsAsync();
      if (!permissions.granted) {
        const finalPermissions = await Notifications.requestPermissionsAsync();
        if (!finalPermissions.granted) {
          console.log("permissions NOT granted!");
          return;
        }
      }
      console.log("permissions granted!");

      const token = await Notifications.getExpoPushTokenAsync();
      console.log("Bitno:");
      console.log(token);
      expoPushTokensApi.register(
        encodeURIComponent(token.data),
        user.accountId
      );
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };
};
