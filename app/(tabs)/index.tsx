import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GameMenu from "./GameMenu";
import SettingsScreen from "./Settings";
import GameScreen from "./GameScreen"; // Import Game Screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GameMenu" component={GameMenu} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="GameScreen" component={GameScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
