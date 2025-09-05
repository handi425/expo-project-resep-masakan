import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";
import CategoryChips from "../../components/CategoryChips";
import RecipeCard from "../../components/RecipeCard";
import EmptyState from "../../components/EmptyState";
import { useThemeColors } from "../../lib/theme";
import type { Category } from "../../lib/types";
import { useRecipes, getOnePerCategory } from "../../hooks/useRecipes";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeroCarousel from "../../components/HeroCarousel";

export default function HomeScreen() {
  const c = useThemeColors();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "Semua">("Semua");
  const data = useRecipes(query, cat);
  const insets = useSafeAreaInsets();

  const featured = useMemo(() => getOnePerCategory(), []);

  const header = useMemo(() => (
    <View style={{ gap: 14 }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.hi, { color: c.subtext }]}>Selamat datang</Text>
          <Text style={[styles.title, { color: c.text }]}>Eksplor Resep Lezat 🍳</Text>
        </View>
        <Link href="/favorites" asChild>
          <TouchableOpacity style={[styles.roundBtn, { backgroundColor: c.card, borderColor: c.border }]}> 
            <Ionicons name="heart-outline" size={18} color={c.subtext} />
          </TouchableOpacity>
        </Link>
      </View>
      <SearchBar value={query} onChange={setQuery} />
      <CategoryChips active={cat} onChange={setCat} />
      <HeroCarousel items={featured} />
      <Text style={[styles.sectionTitle, { color: c.subtext }]}>Rekomendasi</Text>
    </View>
  ), [query, cat, c, featured]);

  return (
    <Screen padded={false}>
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ gap: 12, paddingTop: 12, paddingHorizontal: 16, paddingBottom: Math.max(0, insets.bottom) }}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={{ paddingHorizontal: 0 }}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/recipe/[id]", params: { id: item.id } }} asChild>
            <RecipeCard item={item} />
          </Link>
        )}
        ListEmptyComponent={<EmptyState title="Tidak ada resep" subtitle="Coba kategori atau kata kunci lain" />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  hi: { fontSize: 12 },
  title: { fontSize: 20, fontWeight: "800" },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginTop: 6 },
  roundBtn: { width: 40, height: 40, borderRadius: 999, alignItems: "center", justifyContent: "center", borderWidth: 1 },
});
