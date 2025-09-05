import { useColorScheme } from "react-native";

export const lightColors = {
  background: "#0F141A",
  card: "#151C24",
  surface: "#0F141A",
  text: "#F3F6F9",
  subtext: "#AAB4BE",
  primary: "#FF6B00",
  primarySoft: "#FFEDD9",
  accent: "#10B981",
  border: "#1F2A36",
  chip: "#1A232D",
};

export const darkColors = lightColors; // using same deep palette (modern compact look)

export type Colors = typeof lightColors;

export function useThemeColors(): Colors {
  // unified deep theme for modern compact look
  useColorScheme();
  return darkColors;
}

