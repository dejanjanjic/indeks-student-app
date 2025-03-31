import { createStackNavigator } from "@react-navigation/stack";
import ChatList from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import InstructionsListScreen from "../screens/InstructionsListScreen";
import InstructionDetailsScreen from "../screens/InstructionDetailsScreen";
import BlockedUsersScreen from "../screens/BlockedUsersScreen";

import SearchScreen from "../screens/SearchScreen";
import NewPrivateGroupScreen from "../screens/NewPrivateGroupScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SettingsPersonalDataScreen from "../screens/SettingsPersonalDataScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import AddingNewInstructionOfferScreen from "../screens/AddingNewInstructionOfferScreen";
import ListOfMyInstructionsScreen from "../screens/ListOfMyInstructionsScreen";
import useNotifications from "../hooks/useNotifications";
import MyMaterialScreen from "../screens/MyMaterialsScreen";

const Stack = createStackNavigator();

export default function TutorAppNavigator() {
  useNotifications();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="Chat" component={ChatScreen} />

      <Stack.Screen name="Instruction" component={InstructionsListScreen} />
      <Stack.Screen
        name="InstructionInfo"
        component={InstructionDetailsScreen}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen
        name="NewPrivateGroupScreen"
        component={NewPrivateGroupScreen}
      />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="SettingsPersonalDataScreen"
        component={SettingsPersonalDataScreen}
      />

      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen name="BlockedUsersScreen" component={BlockedUsersScreen} />
      <Stack.Screen
        name="ListOfMyInstructionsScreen"
        component={ListOfMyInstructionsScreen}
      />
      <Stack.Screen
        name="AddingNewInstructionOfferScreen"
        component={AddingNewInstructionOfferScreen}
      />

      <Stack.Screen name="MyMaterialScreen" component={MyMaterialScreen} />
    </Stack.Navigator>
  );
}
