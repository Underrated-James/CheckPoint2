import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./index"; // Ensure correct path

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
