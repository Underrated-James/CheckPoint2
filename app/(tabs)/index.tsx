import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GameMenu from "./GameMenu";
import SettingsScreen from "./Settings";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ✅ Hides header for all screens
      }}
    >
      <Stack.Screen name="GameMenu" component={GameMenu} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
