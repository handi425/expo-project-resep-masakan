import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions, ViewToken, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { Recipe } from "../lib/types";
import { useThemeColors } from "../lib/theme";
import { Link } from "expo-router";

type Props = { items: Recipe[] };

export default function HeroCarousel({ items }: Props) {
  const c = useThemeColors();
  const { width } = useWindowDimensions();
  const cardWidth = Math.floor(width - 32); // 16 padding kiri/kanan
  const [index, setIndex] = useState(0);
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems?.[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;
  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 60 }), []);

  if (!items.length) return null;

  return (
    <View style={{ gap: 10 }}>
      <FlatList
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/recipe/[id]", params: { id: item.id } }} asChild>
            <TouchableOpacity activeOpacity={0.9} style={[styles.card, { width: cardWidth }]}> 
              <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardTopRow}>
                <View style={[styles.pill, { backgroundColor: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.06)" }]}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{item.duration} mnt</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }} numberOfLines={2}>{item.title}</Text>
                <Text style={{ color: "#EAEAEA", marginTop: 4 }} numberOfLines={1}>{item.category} • {item.difficulty} • {item.servings} porsi</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
      <View style={{ alignSelf: "center", flexDirection: "row", gap: 6 }}>
        {items.map((_, i) => (
          <View key={i} style={{ width: i === index ? 18 : 8, height: 8, borderRadius: 999, backgroundColor: i === index ? c.primary : c.chip }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },
  cardTopRow: { position: "absolute", top: 10, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between" },
  pill: { flexDirection: "row", gap: 6, alignItems: "center", paddingHorizontal: 10, height: 28, borderRadius: 999, borderWidth: 1 },
  cardBottom: { position: "absolute", left: 12, right: 12, bottom: 12 },
});

