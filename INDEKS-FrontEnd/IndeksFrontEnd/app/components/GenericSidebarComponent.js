import colors from "../config/colors";
import React, { useRef, useEffect, useContext } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import { useUser } from "../hooks/useUser";
import HttpService from "../services/HttpService";

const GenericSidebarComponent = ({ visible, onClose, menuItems }) => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(-350)).current;
  const user = useUser()
  const { setUser } = useContext(AuthContext);
  useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -350,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuPress = (route) => {
    onClose();
    navigation.navigate(route);
  };

  const handleSignOut = async () => {
    setUser(null);
    console.log("AAAAAA")
    await HttpService.create("auth/logout");
    authStorage.removeToken();
  };

  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <View style={styles.SidebarComponentOverlay}>
        <Animated.View
          style={[
            styles.SidebarComponentContainer,
            { transform: [{ translateX }] },
          ]}
        >
          <View style={styles.SidebarComponentProfileSection}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.SidebarComponentCloseButton}
            >
              <Icon name="bars" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.SidebarComponentProfilePicture}>
              <Icon name="user" size={80} color="#0b4b85" />
            </View>
            <View style={styles.SidebarComponentProfileDetails}>
              <Text style={styles.SidebarComponentName}>{user.firstName +' '+ user.lastName}</Text>
              <Text style={styles.SidebarComponentEmail}>
                {user.sub}
              </Text>
            </View>
          </View>
          <View style={styles.SidebarComponentMenuSection}>
            <ScrollView style={styles.SidebarComponentMenu}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.SidebarComponentMenuItem}
                  onPress={() => handleMenuPress(item.route)}
                >
                  {item.iconType === "FontAwesome" ? (
                    <Icon name={item.icon} size={25} color={colors.primary} />
                  ) : (
                    <FeatherIcon
                      name={item.icon}
                      size={25}
                      color={colors.primary}
                    />
                  )}
                  <Text style={styles.SidebarComponentMenuText}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.SidebarComponentMenuItem,
                styles.SidebarComponentLogout,
              ]}
              onPress={handleSignOut}
            >
              <Icon name="sign-out" size={25} color={colors.red} />
              <Text
                style={[styles.SidebarComponentMenuText, { color: colors.red }]}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  SidebarComponentOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  SidebarComponentContainer: {
    width: 330,
    height: "100%",
    backgroundColor: colors.white,
    padding: 0,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  SidebarComponentCloseButton: {
    paddingTop: 30,
    alignItems: "flex-end",
    marginBottom: 20,
    backgroundColor: colors.primary,
    width: "100%",
    paddingRight: 20,
  },
  SidebarComponentProfileSection: {
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  SidebarComponentProfilePicture: {
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.white,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  SidebarComponentProfileDetails: {
    padding: 20,
    alignItems: "center",
  },
  SidebarComponentName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  SidebarComponentEmail: {
    color: colors.white,
  },
  SidebarComponentMenuSection: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  SidebarComponentMenu: {
    flex: 1,
  },
  SidebarComponentMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  SidebarComponentMenuText: {
    color: colors.lightBlue,
    fontSize: 18,
    marginLeft: 15,
  },
  SidebarComponentLogout: {
    marginTop: "auto",
    borderTopWidth: 0,
    paddingTop: 10,
    borderBottomWidth: 0,
  },
});

export default GenericSidebarComponent;
