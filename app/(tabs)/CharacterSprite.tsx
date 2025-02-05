import React, { memo } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Body } from "matter-js";
import spriteSheet from "../../assets/images/Rizals-removebg-preview.png";

// Define the prop types explicitly
interface CharacterSpriteProps {
  body: Body;
  frameIndex: number;
  direction: number;
}

const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;
const SPRITE_ROWS = 4;
const SPRITE_COLUMNS = 4;

const CharacterSprite: React.FC<CharacterSpriteProps> = ({ body, frameIndex, direction }) => {
  if (!body) return null;

  // Debugging logs
  console.log("Rendering Character at:", body.position.x, body.position.y);
  console.log("Sprite Frame Index:", frameIndex, "Direction:", direction);

  return (
    <View
      style={{
        position: "absolute",
        left: body.position.x - FRAME_WIDTH / 2,
        top: body.position.y - FRAME_HEIGHT / 2,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
      }}
    >
      <Image
        source={spriteSheet}
        style={{
          width: FRAME_WIDTH * SPRITE_COLUMNS,
          height: FRAME_HEIGHT * SPRITE_ROWS,
          position: "absolute",
          left: -frameIndex * FRAME_WIDTH,
          top: -direction * FRAME_HEIGHT,
          
        }}
      />
    </View>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CharacterSprite);
