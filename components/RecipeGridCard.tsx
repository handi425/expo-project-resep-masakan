import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";
import type { Recipe } from "../lib/types";

type Props = {
  item: Recipe;
  width: number;
  onPress?: () => void;
};

export default function RecipeGridCard({ item, width, onPress }: Props) {
  const c = useThemeColors();
  const src = typeof item.image === "string" ? { uri: item.image } : item.image;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.wrap, { width, borderColor: c.border }]}> 
      <View style={styles.imgWrap}>
        <Image source={src} style={styles.img} contentFit="cover" transition={200} />
        <View style={styles.overlay} />

        <View style={styles.badge}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.badgeText}>{item.duration} mnt</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.by} numberOfLines={1}>{item.category} • {item.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 14, overflow: "hidden", borderWidth: 1 },
  imgWrap: { height: 170, position: "relative" },
  img: { width: "100%", height: "100%" },
  overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.18)" },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  bottom: { position: "absolute", left: 10, right: 10, bottom: 10 },
  title: { color: "#fff", fontWeight: "900", fontSize: 14, lineHeight: 18 },
  by: { color: "#E6E6E6", marginTop: 6, fontSize: 12 },
});

