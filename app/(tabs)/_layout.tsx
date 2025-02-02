import AppNavigator from "./index"; // Ensure correct path

export default function Layout() {
  return <AppNavigator />; // ✅ Remove any extra NavigationContainer
}
