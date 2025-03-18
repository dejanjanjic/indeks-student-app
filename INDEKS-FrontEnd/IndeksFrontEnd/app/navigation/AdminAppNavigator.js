import { createStackNavigator } from "@react-navigation/stack";
import MaterialsScreen from "../screens/MaterialsScreen";
import ViewProblemsScreen from "../screens/ViewProblemsScreen";
import InstructionsListScreen from "../screens/InstructionsListScreen";
import ElementaryGroupChatScreen from "../screens/ElementaryGroupsListScreen";

import ReportedCommentsScreen from "../screens/ReportedCommentsScreen";
import ReportedMaterialsScreen from "../screens/ReportedMaterialsScreen";
import ReportedUsersScreen from "../screens/ReportedUsersScreen";
import RegisteredUsersScreen from "../screens/RegisteredUsersScreen";
import MaterialsSubjectItemsScreen from "../screens/MaterialsSubjectItemsScreen";
import MaterialsYearsItemsScreen from "../screens/MaterialsYearsItemsScreen";
import InstructionDetailsScreen from "../screens/InstructionDetailsScreen";
const Stack = createStackNavigator();

export default function AdminAppNavigator() {
  console.log("Rendering AdminAppNavigator");
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ElementaryGroupChat"
        component={ElementaryGroupChatScreen}
      />
      <Stack.Screen name="Materijali" component={MaterialsScreen} />
      <Stack.Screen
        name="RegisteredUsersScreen"
        component={RegisteredUsersScreen}
      />
      <Stack.Screen name="Problems" component={ViewProblemsScreen} />
      <Stack.Screen
        name="ReportedCommentsScreen"
        component={ReportedCommentsScreen}
      />
      <Stack.Screen
        name="ReportedMaterialsScreen"
        component={ReportedMaterialsScreen}
      />
      <Stack.Screen
        name="ReportedUsersScreen"
        component={ReportedUsersScreen}
      />
      <Stack.Screen name="Instruction" component={InstructionsListScreen} />
      <Stack.Screen
        name="InstructionInfo"
        component={InstructionDetailsScreen}
      />
      <Stack.Screen
        name="MaterialsYearsItemsScreen"
        component={MaterialsYearsItemsScreen}
      />
      <Stack.Screen
        name="MaterialsSubjectItemsScreen"
        component={MaterialsSubjectItemsScreen}
      />
    </Stack.Navigator>
  );
}
