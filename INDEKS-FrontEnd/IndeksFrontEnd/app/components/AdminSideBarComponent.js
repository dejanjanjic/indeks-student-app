import React from "react";
import { View } from "react-native";
import GenericSidebarComponent from "./GenericSidebarComponent";

const AdminSidebarComponent = ({ visible, onClose }) => {
  const menuItems = [
    {
      label: "Materijali",
      icon: "folder",
      route: "Materijali",
      iconType: "FontAwesome",
    },
    {
      label: "Instrukcije",
      icon: "book",
      route: "Instruction",
      iconType: "FontAwesome",
    },
    {
      label: "Osnovne grupe",
      icon: "users",
      route: "ElementaryGroupChat",
      iconType: "FontAwesome",
    },
    {
      label: "Prijavljeni problemi",
      icon: "alert-triangle",
      route: "Problems",
      iconType: "Feather",
    },
    {
      label: "Registrovani korisnici",
      icon: "settings",
      route: "RegisteredUsersScreen",
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

export default AdminSidebarComponent;
