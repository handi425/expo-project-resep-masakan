import React from "react";
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";
import type { Category } from "../lib/types";

export const CATEGORIES: { key: Category; label: string; icon: string; lib?: "ion" | "mci" }[] = [
  { key: "Ayam", label: "Ayam", icon: "restaurant-outline" },
  { key: "Daging", label: "Daging", icon: "beer-outline" },
  { key: "Sayuran", label: "Sayur", icon: "leaf-outline" },
  { key: "Seafood", label: "Seafood", icon: "fish", lib: "mci" },
  { key: "Sup", label: "Sup", icon: "pot-steam", lib: "mci" },
  { key: "Mie", label: "Mie", icon: "bowl", lib: "mci" },
  { key: "Nasi", label: "Nasi", icon: "bowl", lib: "mci" },
  { key: "Dessert", label: "Dessert", icon: "ice-cream-outline" },
  { key: "Sarapan", label: "Sarapan", icon: "sunny-outline" },
  { key: "Minuman", label: "Minuman", icon: "cup", lib: "mci" },
];

type Props = {
  active?: Category | "Semua";
  onChange?: (c: Category | "Semua") => void;
};

export default function CategoryChips({ active = "Semua", onChange }: Props) {
  const c = useThemeColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      <Chip label="Semua" active={active === "Semua"} onPress={() => onChange?.("Semua")} />
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat.key}
          label={cat.label}
          icon={cat.icon}
          lib={cat.lib}
          active={active === cat.key}
          onPress={() => onChange?.(cat.key)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({ label, icon, active, onPress, lib = "ion" as const }: { label: string; icon?: string; lib?: "ion" | "mci"; active?: boolean; onPress?: () => void }) {
  const c = useThemeColors();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, { backgroundColor: active ? c.primary : c.chip, borderColor: active ? c.primary : c.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon ? (
          lib === "ion" ? (
            <Ionicons name={icon as any} size={14} color={active ? "#0B0F14" : c.subtext} />
          ) : (
            <MaterialCommunityIcons name={icon as any} size={14} color={active ? "#0B0F14" : c.subtext} />
          )
        ) : null}
        <Text style={{ color: active ? "#0B0F14" : c.subtext, fontWeight: active ? "700" : "500" }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, paddingHorizontal: 4 },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
