import { useColorModeValue } from "@chakra-ui/react";

export const useThemeColors = () => {
  return {
    cardBg: useColorModeValue("white", "gray.700"),
    headerBg: useColorModeValue("gray.50", "gray.800"),
    borderColor: useColorModeValue("gray.200", "gray.600"),
    hoverBg: useColorModeValue("gray.50", "gray.700"),
    textColor: useColorModeValue("type.title", "white"),
  };
};