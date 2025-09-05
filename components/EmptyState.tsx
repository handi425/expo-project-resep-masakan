import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";

export default function EmptyState({ icon = "search-outline", title = "Tidak ada hasil", subtitle = "Coba kata kunci lain" }: { icon?: React.ComponentProps<typeof Ionicons>["name"]; title?: string; subtitle?: string; }) {
  const c = useThemeColors();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: c.card, borderColor: c.border }]}>
        <Ionicons name={icon} size={22} color={c.subtext} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      <Text style={[styles.sub, { color: c.subtext }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingVertical: 48, gap: 6 },
  iconWrap: { width: 44, height: 44, borderRadius: 999, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  title: { fontSize: 16, fontWeight: "700" },
  sub: { fontSize: 13 },
});

