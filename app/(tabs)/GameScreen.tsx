import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter, { Engine, World, Bodies, Body } from "matter-js";
import tilemap from "../../assets/images/MapTile.png"; // Background map
import CharacterSprite from "./CharacterSprite"; // Import animated sprite

const { width, height } = Dimensions.get("window");

// Physics system to update the engine
const Physics = (entities: { physics: { engine: Engine }; player: { body: Body; position: { x: number; y: number } } }, { time }: { time: { delta: number } }) => {
  if (!entities.physics || !entities.physics.engine || !entities.player) return entities;

  Matter.Engine.update(entities.physics.engine, time.delta);
  entities.player.position = { ...entities.player.body.position }; // Ensure position updates

  return entities;
};

const GameScreen: React.FC = () => {
  const engineRef = useRef<Engine | null>(null);
  const [playerBody, setPlayerBody] = useState<Body | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 0 = down, 1 = left, 2 = right, 3 = up

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = Matter.Engine.create({ enableSleeping: false });
      engineRef.current.world.gravity.y = 0; // Disable gravity for RPG movement
    }

    if (!playerBody) {
      const player = Matter.Bodies.rectangle(width / 2, height / 2, 64, 64, { frictionAir: 0.1, inertia: Infinity });
      Matter.World.add(engineRef.current.world, player);
      setPlayerBody(player);
    }

    return () => {
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  // Function to move player & animate sprite
  const movePlayer = (dx: number, dy: number, newDirection: number) => {
    if (playerBody) {
      Matter.Body.setVelocity(playerBody, { x: dx, y: dy });
      setDirection(newDirection);
      setFrameIndex((prev) => (prev + 1) % 4);
    }
  };

  // Extracted function to prevent re-creation
  const renderPlayer = useCallback(
    () => (playerBody ? <CharacterSprite body={playerBody} frameIndex={frameIndex} direction={direction} /> : null),
    [playerBody, frameIndex, direction]
  );

  return (
    <View style={styles.container}>
      {/* Tilemap Background */}
      <Image source={tilemap} style={[styles.tilemap, { zIndex: -1 }]} resizeMode="cover" />

      <GameEngine
        systems={[Physics]}
        entities={{
          physics: { engine: engineRef.current as Engine, world: engineRef.current?.world as World },
          player: {
            body: playerBody || Matter.Bodies.rectangle(width / 2, height / 2, 64, 64),
            position: playerBody?.position || { x: width / 2, y: height / 2 },
            renderer: renderPlayer, // Stable function reference
          },
        }}
      />

      {/* Buttons for Movement */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => movePlayer(0, -5, 3)}>
          <Image source={require("../../assets/images/up.png")} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => movePlayer(0, 5, 0)}>
          <Image source={require("../../assets/images/down.png")} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => movePlayer(-5, 0, 1)}>
          <Image source={require("../../assets/images/left.png")} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => movePlayer(5, 0, 2)}>
          <Image source={require("../../assets/images/right.png")} style={styles.arrow} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  tilemap: { position: "absolute", width: width, height: height, resizeMode: "cover" },
  controls: { position: "absolute", bottom: 20, flexDirection: "row", justifyContent: "center", width: "100%" },
  button: { margin: 10, padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 5 },
  arrow: { width: 30, height: 30 },
});

export default GameScreen;
