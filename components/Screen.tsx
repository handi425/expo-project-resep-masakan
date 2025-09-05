import React from "react";
import { StatusBar, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../lib/theme";

export default function Screen({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  const c = useThemeColors();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["top"]}> 
      <StatusBar barStyle="light-content" />
      <View style={[styles.body, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { flex: 1 },
  padded: { paddingHorizontal: 16, paddingTop: 12 },
});
