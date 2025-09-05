import React, { useMemo } from "react";
import { Stack, useLocalSearchParams, useRouter, Link } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import { getRecipeById, getRelatedRecipes } from "../../hooks/useRecipes";
import { useThemeColors } from "../../lib/theme";
import { useFavorites } from "../../context/FavoritesContext";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Recipe } from "../../lib/types";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useMemo(() => (id ? getRecipeById(id) : undefined), [id]);
  const c = useThemeColors();
  const { isFavorite, toggle } = useFavorites();
  const fav = item ? isFavorite(item.id) : false;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!item) return (
    <Screen>
      <Text style={{ color: c.text, marginTop: 24, fontWeight: "700" }}>Resep tidak ditemukan.</Text>
    </Screen>
  );

  const related = useMemo(() => (item ? getRelatedRecipes(item.id, 3) : []), [item?.id]);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}>
        <View style={{ height: 260, position: "relative" }}>
          <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
          <View style={styles.overlay} />
          <View style={[styles.topBar, { top: 8 + insets.top }]}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.circle, { backgroundColor: "rgba(0,0,0,0.45)", borderColor: "rgba(255,255,255,0.08)" }]}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggle(item.id); }}
              style={[styles.circle, { backgroundColor: fav ? c.primary : "rgba(0,0,0,0.45)", borderColor: "rgba(255,255,255,0.08)" }]}>
              <Ionicons name={fav ? "heart" : "heart-outline"} size={18} color={fav ? "#0B0F14" : "#fff"} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>{item.title}</Text>
            <Text style={styles.heroMeta}>{item.category} • {item.difficulty} • {item.duration} mnt</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}>
          <View style={styles.infoRow}>
            <Info icon="people-outline" label="Porsi" value={`${item.servings}`} />
            <Info icon="flame-outline" label="Kalori" value={item.calories ? `${item.calories}` : "~"} />
            <Info icon="pricetag-outline" label="Level" value={item.difficulty} />
          </View>

          <View>
            <Text style={[styles.section, { color: c.text }]}>Bahan-bahan</Text>
            {item.ingredients.map((ing, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: c.primary }]} />
                <Text style={[styles.li, { color: c.subtext }]}>{ing}</Text>
              </View>
            ))}
          </View>

          <View>
            <Text style={[styles.section, { color: c.text }]}>Langkah Memasak</Text>
            {item.steps.map((st, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNum, { borderColor: c.border, backgroundColor: c.card }]}>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>{i + 1}</Text>
                </View>
                <Text style={[styles.li, { color: c.subtext, flex: 1 }]}>{st}</Text>
              </View>
            ))}
          </View>

          {related.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.section, { color: c.text }]}>Resep lainnya</Text>
              <View style={{ gap: 12 }}>
                {related.map((rcp) => (
                  <Link key={rcp.id} href={{ pathname: "/recipe/[id]", params: { id: rcp.id } }} asChild>
                    <RecipeRow item={rcp} />
                  </Link>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function RecipeRow({ item, style, ...rest }: { item: Recipe } & React.ComponentProps<typeof TouchableOpacity>) {
  const c = useThemeColors();
  return (
    <TouchableOpacity activeOpacity={0.85} {...rest} style={[{ flexDirection: "row", gap: 12, alignItems: "center" }, style]}>
      <View style={{ width: 120, height: 80, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: c.border }}>
        <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.text, fontWeight: "800" }} numberOfLines={1}>{item.title}</Text>
        <Text style={{ color: c.subtext, marginTop: 4 }} numberOfLines={1}>{item.category} • {item.difficulty}</Text>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 6 }}>
          <Ionicons name="time-outline" size={14} color={c.subtext} />
          <Text style={{ color: c.subtext, fontSize: 12 }}>{item.duration} menit</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Info({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; value: string; }) {
  return (
    <View style={{ alignItems: "center", gap: 6, width: "33%" }}>
      <Ionicons name={icon} size={18} color="#AAB4BE" />
      <Text style={{ color: "#F3F6F9", fontWeight: "700" }}>{value}</Text>
      <Text style={{ color: "#AAB4BE", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.25)" },
  topBar: { position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between" },
  circle: { width: 40, height: 40, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  heroTextWrap: { position: "absolute", left: 16, right: 16, bottom: 16 },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "900" },
  heroMeta: { color: "#E6E6E6", marginTop: 4 },
  section: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 999, marginTop: 8 },
  li: { fontSize: 14 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 12 },
  stepNum: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1 },
});
