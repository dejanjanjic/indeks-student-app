import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function TutorAppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}></Stack.Navigator>
  );
}
