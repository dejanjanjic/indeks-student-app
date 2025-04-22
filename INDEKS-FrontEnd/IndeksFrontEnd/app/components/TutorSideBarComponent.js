import React from "react";
import { View, Button } from "react-native";
import GenericSidebarComponent from "./GenericSidebarComponent";

const TutorSidebarComponent = ({ visible, onClose }) => {
  const menuItems = [
    {
      label: "Aktivni razgovori",
      icon: "comments",
      route: "ChatList",
      iconType: "FontAwesome",
    },
    {
      label: "Moji Materijali",
      icon: "folder-open",
      route: "MyMaterialScreen",
      iconType: "FontAwesome",
    },
    {
      label: "Moja ponuda",
      icon: "book",
      route: "ListOfMyInstructionsScreen",
      iconType: "Feather",
    },
    {
      label: "Zahtjevi",
      icon: "envelope",
      route: "SubscriptionsScreen",
      iconType: "FontAwesome",
    },
    {
      label: "Podešavanja",
      icon: "settings",
      route: "SettingsScreen",
      iconType: "Feather",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <GenericSidebarComponent
        visible={visible}
        onClose={onClose}
        menuItems={menuItems}
      />
    </View>
  );
};

export default TutorSidebarComponent;
