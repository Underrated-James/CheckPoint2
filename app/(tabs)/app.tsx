import React from 'react';
import AppNavigator from '../(tabs)/navigation'; // Ensure this path is correct

export default function App() {
  console.log("App component is rendering"); // Log statement to confirm rendering
  return <AppNavigator />;
}