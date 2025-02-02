import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider"; // Correct import
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native"; // Import navigation

const clickSoundFile = require("../../assets/sounds/settings.mp3"); // Button click sound
const voiceSettings = require("../../assets/sounds/settings.mp3"); // Voice saying "Settings"

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [soundEffects, setSoundEffects] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [voiceOver, setVoiceOver] = useState(true);
  let clickSound: Audio.Sound | null = null;

  useEffect(() => {
    console.log("SettingsScreen is rendering"); // Log statement to confirm rendering
    return () => {
      if (clickSound) {
        clickSound.unloadAsync();
      }
    };
  }, []);

  const toggleSoundEffects = () => setSoundEffects((prev) => !prev);
  const toggleVoiceOver = () => setVoiceOver((prev) => !prev);

  const playClickSound = async () => {
    if (soundEffects) {
      const { sound } = await Audio.Sound.createAsync(clickSoundFile);
      clickSound = sound;
      await clickSound.playAsync();
    }
  };

  const playVoiceOver = async () => {
    if (voiceOver) {
      const { sound } = await Audio.Sound.createAsync(voiceSettings);
      await sound.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.text}>Sound Effects</Text>
        <Switch value={soundEffects} onValueChange={toggleSoundEffects} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.text}>Music Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={musicVolume}
          onValueChange={(value: number) => setMusicVolume(value)} // Fixed TypeScript error
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.text}>Voice Over</Text>
        <Switch value={voiceOver} onValueChange={toggleVoiceOver} />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => {
        playClickSound();
        navigation.goBack(); // Navigate back to GameMenu
      }}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  header: {
    fontSize: 30,
    color: "#fff",
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },
  slider: {
    width: 150,
  },
  button: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#f1916d",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default SettingsScreen;