import { createStackNavigator } from "@react-navigation/stack";

import ChatList from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import MaterialsScreen from "../screens/MaterialsScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import InstructionsListScreen from "../screens/InstructionsListScreen";
import InstructionDetailsScreen from "../screens/InstructionDetailsScreen";
import ElementaryGroupChatScreen from "../screens/ElementaryGroupsListScreen";
import AnnouncementsListScreen from "../screens/AnnouncementsListScreen";
import BlockedUsersScreen from "../screens/BlockedUsersScreen";

import SearchScreen from "../screens/SearchScreen";
import NewPrivateGroupScreen from "../screens/NewPrivateGroupScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SettingsPersonalDataScreen from "../screens/SettingsPersonalDataScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import AnnouncementsSelectionScreen from "../screens/AnnouncementsSelectionScreen";
import AddingNewInstructionOfferScreen from "../screens/AddingNewInstructionOfferScreen";
import ListOfMyInstructionsScreen from "../screens/ListOfMyInstructionsScreen";
import MaterialsYearsItemsScreen from "../screens/MaterialsYearsItemsScreen";
import MaterialsSubjectItemsScreen from "../screens/MaterialsSubjectItemsScreen";
import useNotifications from "../hooks/useNotifications";
import MyMaterialScreen from "../screens/MyMaterialsScreen";

const Stack = createStackNavigator();

export default function StudentAppNavigator() {
  useNotifications();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="Chat" component={ChatScreen} />

      <Stack.Screen name="Materijali" component={MaterialsScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Instruction" component={InstructionsListScreen} />
      <Stack.Screen
        name="InstructionInfo"
        component={InstructionDetailsScreen}
      />

      <Stack.Screen
        name="ElementaryGroupChat"
        component={ElementaryGroupChatScreen}
      />
      <Stack.Screen name="Ads" component={AnnouncementsListScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen
        name="NewPrivateGroupScreen"
        component={NewPrivateGroupScreen}
      />
      {/* <Stack.Screen
        name="InstructorProfileScreen"
        component={InstructorProfileScreen}
      /> */}
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="SettingsPersonalDataScreen"
        component={SettingsPersonalDataScreen}
      />

      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="AnnouncementsSelectionScreen"
        component={AnnouncementsSelectionScreen}
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

      <Stack.Screen
        name="MaterialsYearsItemsScreen"
        component={MaterialsYearsItemsScreen}
      />
      <Stack.Screen
        name="MaterialsSubjectItemsScreen"
        component={MaterialsSubjectItemsScreen}
      />

      <Stack.Screen name="MyMaterialScreen" component={MyMaterialScreen} />
    </Stack.Navigator>
  );
}
