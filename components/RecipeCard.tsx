import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";
import type { Recipe } from "../lib/types";
import * as Haptics from "expo-haptics";
import { useFavorites } from "../context/FavoritesContext";

type Props = {
  item: Recipe;
  onPress?: () => void;
};

function Card({ item, onPress }: Props) {
  const c = useThemeColors();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(item.id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.wrap, { backgroundColor: c.card, borderColor: c.border }]}> 
      <View style={styles.imgWrap}>
        <Image source={{ uri: item.image }} style={styles.img} contentFit="cover" transition={200} />
        <View style={styles.overlay} />
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: "rgba(0,0,0,0.45)", borderColor: "rgba(255,255,255,0.08)" }]}>
            <Ionicons name="time-outline" size={14} color="#fff" />
            <Text style={styles.badgeText}>{item.duration} mnt</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggle(item.id);
            }}
            style={[styles.heartBtn, { backgroundColor: fav ? c.primary : "rgba(0,0,0,0.45)", borderColor: "rgba(255,255,255,0.08)" }]}
          >
            <Ionicons name={fav ? "heart" : "heart-outline"} size={16} color={fav ? "#0B0F14" : "#fff"} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomArea}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.meta} numberOfLines={1}>{item.category} • {item.difficulty} • {item.servings} porsi</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(Card);

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  imgWrap: { height: 180, position: "relative" },
  img: { width: "100%", height: "100%" },
  overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.15)" },
  topRow: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  heartBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  bottomArea: { position: "absolute", left: 12, right: 12, bottom: 12 },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  meta: { color: "#E6E6E6", marginTop: 2, fontSize: 12 },
});

