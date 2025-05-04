import React, { useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const ColorPicker = ({ onColorChange }: { onColorChange: (color: string) => void }) => {
  const [color, setColor] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const [hexColor, setHexColor] = useState("#ffffff");

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) =>
    `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
      a: 1,
    };
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor);
    const hex = rgbToHex(newColor.r, newColor.g, newColor.b);
    setHexColor(hex);
    onColorChange(hex); // Notify parent component
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexColor(value);

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const rgb = hexToRgb(value);
      setColor(rgb);
      onColorChange(value); // Notify parent component
    }
  };

  // Chakra UI colors for theming
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <VStack spacing={4} align="stretch">
      {/* RGB Color Picker */}
      <Box border="1px" borderColor={borderColor} borderRadius="md" p={4}>
        <FormLabel>Selecciona un color (RGB)</FormLabel>
        <RgbaColorPicker color={color} onChange={handleColorChange} />
      </Box>

      {/* Hexadecimal Input */}
      <Box>
        <FormControl>
          <FormLabel>Color en formato HEX</FormLabel>
          <Input
            value={hexColor}
            onChange={handleHexChange}
            placeholder="#ffffff"
            maxLength={7}
          />
        </FormControl>
      </Box>

      {/* Color Preview */}
      <Box
        mt={4}
        w="100%"
        h="50px"
        borderRadius="md"
        border="1px"
        borderColor={borderColor}
        bg={hexColor}
      >
        <Text textAlign="center" color="white" fontWeight="bold" mt={2}>
          {hexColor.toUpperCase()}
        </Text>
      </Box>
    </VStack>
  );
};

export default ColorPicker;