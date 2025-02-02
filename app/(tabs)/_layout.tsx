import React, { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, StatusBar } from "react-native";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import { useFonts, LexendGiga_400Regular } from "@expo-google-fonts/lexend-giga";
import AppLoading from "expo-app-loading";
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

// Define navigation types
type RootStackParamList = {
  GameMenu: undefined;
  Settings: undefined;
};

type NavigationType = NavigationProp<RootStackParamList>;

// Import the image
import backgroundImage from "../../assets/images/473753636_9289227874474994_6464077677548443709_n.jpg";

// Use require for the background music
const backgroundMusic = require("../../assets/sounds/Heroes.mp3");

const GameMenu: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const [fontsLoaded] = useFonts({
    LexendGiga: LexendGiga_400Regular,
  });

  useEffect(() => {
    let sound: Audio.Sound | null = null;

    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    const playBackgroundMusic = async () => {
      try {
        const { sound: loadedSound } = await Audio.Sound.createAsync(backgroundMusic);
        sound = loadedSound;
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
      } catch (error) {
        console.error("Error playing background music:", error);
      }
    };

    lockOrientation();
    playBackgroundMusic();

    return () => {
      ScreenOrientation.unlockAsync();
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

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
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GameMenu')}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="bounceIn" duration={1500} delay={500} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="bounceIn" duration={1500} delay={1000} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
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
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 50,
  },
  buttonWrapper: {
    marginTop: 50,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default GameMenu;