import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import AppLoading from "expo-app-loading";

// Import background image
import backgroundImage from "../../assets/images/settings.png";

const clickSoundFile = require("../../assets/sounds/Back.mp3");

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [soundEffects, setSoundEffects] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [voiceOver, setVoiceOver] = useState(true);
  const [colorblindMode, setColorblindMode] = useState(false); // New Colorblind Mode
  let clickSound: Audio.Sound | null = null;

  // Load fonts
  const [fontsLoaded] = useFonts({
    PressStart2P: PressStart2P_400Regular,
  });

  useEffect(() => {
    // Load saved settings from AsyncStorage
    const loadSettings = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem("musicVolume");
        const savedColorblindMode = await AsyncStorage.getItem("colorblindMode");

        if (savedVolume !== null) setMusicVolume(parseFloat(savedVolume));
        if (savedColorblindMode !== null) setColorblindMode(savedColorblindMode === "true");
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  const toggleSoundEffects = () => setSoundEffects((prev) => !prev);
  const toggleVoiceOver = () => setVoiceOver((prev) => !prev);

  // Toggle Colorblind Mode
  const toggleColorblindMode = async () => {
    const newValue = !colorblindMode;
    setColorblindMode(newValue);
    await AsyncStorage.setItem("colorblindMode", newValue.toString());
  };

  const playClickSound = async () => {
    if (soundEffects) {
      const { sound } = await Audio.Sound.createAsync(clickSoundFile);
      clickSound = sound;
      await clickSound.playAsync();
    }
  };

  // Save music volume to AsyncStorage
  const handleVolumeChange = async (value: number) => {
    setMusicVolume(value);
    try {
      await AsyncStorage.setItem("musicVolume", value.toString());
    } catch (error) {
      console.error("Error saving volume:", error);
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <View style={styles.settingBox}>
          <Text style={styles.text}>Sound Effects</Text>
          <Switch
            value={soundEffects}
            onValueChange={toggleSoundEffects}
            trackColor={{ false: "#654321", true: "#b5651d" }}
            thumbColor={soundEffects ? "#8B4513" : "#A0522D"}
          />
        </View>

        <View style={styles.settingBox}>
          <Text style={styles.text}>Music Volume</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={musicVolume}
            onValueChange={handleVolumeChange}
            minimumTrackTintColor="#8B4513"
            maximumTrackTintColor="#D2B48C"
            thumbTintColor="#A0522D"
          />
        </View>

        <View style={styles.settingBox}>
          <Text style={styles.text}>Voice Over</Text>
          <Switch
            value={voiceOver}
            onValueChange={toggleVoiceOver}
            trackColor={{ false: "#654321", true: "#b5651d" }}
            thumbColor={voiceOver ? "#8B4513" : "#A0522D"}
          />
        </View>

        <View style={styles.settingBox}>
          <Text style={styles.text}>Colorblind Mode (Protanopia)</Text>
          <Switch
            value={colorblindMode}
            onValueChange={toggleColorblindMode}
            trackColor={{ false: "#654321", true: "#b5651d" }}
            thumbColor={colorblindMode ? "#8B4513" : "#A0522D"}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            playClickSound();
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "PressStart2P",
  },
  settingBox: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Light black transparent background
    padding: 15,
    borderRadius: 10,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "PressStart2P",
  },
  slider: {
    width: 150,
  },
  button: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(165, 42, 42, 0.8)", // Brown button
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontFamily: "PressStart2P",
  },
});

export default SettingsScreen;
