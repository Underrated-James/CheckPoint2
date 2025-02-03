import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";

import Matter, { Engine, World, Bodies, Body } from "matter-js";
import playerSprite from "../../assets/images/download.png"; // Your character sprite

// Define screen dimensions
const { width, height } = Dimensions.get("window");

// Define the type for the entities object
interface Entities {
  player: { body: Body; renderer: React.FC<{ body: Body }> };
}

// Define the physics function with explicit typing
const physics = (entities: any, { touches }: { touches: any[] }) => { 

  let move = { x: 0, y: 0 };

  touches
    .filter((t) => t.type === "move")
    .forEach((t) => {
      move = { x: t.delta?.pageX || 0, y: t.delta?.pageY || 0 };
    });

  const player = entities.player.body;
  Matter.Body.setVelocity(player, {
    x: move.x * 0.1,
    y: move.y * 0.1,
  });

  return entities;
};

// Player component
const Player: React.FC<{ body: Body }> = ({ body }) => {
  const x = body.position.x - 25;
  const y = body.position.y - 25;

  return <Image source={playerSprite} style={[styles.sprite, { left: x, top: y }]} />;
};

const GameScreen: React.FC = () => {
  const engineRef = useRef<Engine | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    engineRef.current = engine;

    const player = Matter.Bodies.rectangle(width / 2, height / 2, 50, 50, { frictionAir: 0.1 });
    Matter.World.add(world, player);

    engine.world.gravity.y = 0; // Disable gravity for a top-down RPG

    return () => {
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <View style={styles.container}>
      <GameEngine
        systems={[physics]}
        entities={{
          player: { body: Matter.Bodies.rectangle(width / 2, height / 2, 50, 50), renderer: Player },
        }}
        running={running}
      />
      {/* Buttons for Movement */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => engineRef.current && Matter.Body.setVelocity(engineRef.current.world.bodies[0], { x: 0, y: -5 })}
        >
          <Image source={require("../../assets/images/up.png")} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => engineRef.current && Matter.Body.setVelocity(engineRef.current.world.bodies[0], { x: 0, y: 5 })}
        >
          <Image source={require("../../assets/images/down.png")} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => engineRef.current && Matter.Body.setVelocity(engineRef.current.world.bodies[0], { x: -5, y: 0 })}
        >
          <Image source={require("../../assets/images/left.png")} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => engineRef.current && Matter.Body.setVelocity(engineRef.current.world.bodies[0], { x: 5, y: 0 })}
        >
          <Image source={require("../../assets/images/right.png")} style={styles.arrow} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  sprite: { position: "absolute", width: 50, height: 50 },
  controls: { position: "absolute", bottom: 20, flexDirection: "row", justifyContent: "center", width: "100%" },
  button: { margin: 10, padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 5 },
  arrow: { width: 30, height: 30 },
});

export default GameScreen;
