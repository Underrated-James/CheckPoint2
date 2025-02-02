import React, { useEffect, useState, useRef } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, StatusBar, BackHandler } from "react-native";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import AppLoading from "expo-app-loading";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define navigation types
type RootStackParamList = {
  GameMenu: undefined;
  Settings: undefined;
};

type NavigationType = NavigationProp<RootStackParamList>;

// Import assets
import backgroundImage from "../../assets/images/473753636_9289227874474994_6464077677548443709_n.jpg";
const backgroundMusic = require("../../assets/sounds/Heroes.mp3");
const clickSoundFile = require("../../assets/sounds/settings.mp3");

const GameMenu: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const [fontsLoaded] = useFonts({ PressStart2P: PressStart2P_400Regular });
  const [musicVolume, setMusicVolume] = useState(0.5);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    const loadSettings = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem("musicVolume");
        if (savedVolume !== null) setMusicVolume(parseFloat(savedVolume));

        const { sound } = await Audio.Sound.createAsync(backgroundMusic);
        soundRef.current = sound;
        await sound.setIsLoopingAsync(true);
        await sound.setVolumeAsync(musicVolume);
        await sound.playAsync();
      } catch (error) {
        console.error("Error loading settings or playing music:", error);
      }
    };

    lockOrientation();
    loadSettings();

    return () => {
      ScreenOrientation.unlockAsync();
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const checkVolumeUpdates = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem("musicVolume");
        if (savedVolume !== null) {
          const volume = parseFloat(savedVolume);
          setMusicVolume(volume);
          if (soundRef.current) {
            await soundRef.current.setVolumeAsync(volume);
          }
        }
      } catch (error) {
        console.error("Error updating music volume:", error);
      }
    };

    const interval = setInterval(checkVolumeUpdates, 1000);
    return () => clearInterval(interval);
  }, []);

  const playClickSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(clickSoundFile);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing click sound:", error);
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <StatusBar hidden />
        <Animatable.Text animation="fadeInDown" duration={1500} style={styles.title}>
          Echo World
        </Animatable.Text>
        <View style={styles.buttonWrapper}>
          <Animatable.View animation="bounceIn" duration={1500} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => console.log("Starting game...")}> 
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="bounceIn" duration={1500} delay={500} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                playClickSound();
                navigation.navigate("Settings");
              }}
            >
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="bounceIn" duration={1500} delay={1000} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => BackHandler.exitApp()}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
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
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 50,
    textAlign: "center",
    fontFamily: "PressStart2P",
  },
  buttonWrapper: {
    marginTop: 50,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "rgba(165, 42, 42, 0.8)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 220,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(248, 182, 1, 0.85)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontFamily: "PressStart2P",
  },
});

export default GameMenu;