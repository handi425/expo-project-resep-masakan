import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../../lib/theme";

export default function TabsLayout() {
  const c = useThemeColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(8, insets.bottom);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.card,
          borderTopColor: c.border,
          paddingBottom: bottomPad,
          paddingTop: 6,
          height: 56 + bottomPad,
        },
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.subtext,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorit",
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
