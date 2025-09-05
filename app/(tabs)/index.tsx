import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from "react-native";
import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";
import CategoryChips from "../../components/CategoryChips";
import RecipeGridCard from "../../components/RecipeGridCard";
import EmptyState from "../../components/EmptyState";
import { useThemeColors } from "../../lib/theme";
import type { Category } from "../../lib/types";
import { useRecipes } from "../../hooks/useRecipes";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const c = useThemeColors();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "Semua">("Semua");
  const data = useRecipes(query, cat);
  const { width } = useWindowDimensions();

  // Responsive grid: phones=2, fold/tablet portrait=3, wide/tablet landscape=4
  const sidePad = 16;
  const gap = 12;
  const numColumns = width >= 1024 ? 4 : width >= 700 ? 3 : 2;
  const cardWidth = Math.floor((width - sidePad * 2 - gap * (numColumns - 1)) / numColumns);

  const header = useMemo(() => (
    <View style={{ gap: 14 }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.hi, { color: c.subtext }]}>Selamat datang</Text>
          <Text style={[styles.title, { color: c.text }]}>Eksplor Resep Lezat</Text>
        </View>
        <Link href="/favorites" asChild>
          <TouchableOpacity style={[styles.roundBtn, { backgroundColor: c.card, borderColor: c.border }]}> 
            <Ionicons name="heart-outline" size={18} color={c.subtext} />
          </TouchableOpacity>
        </Link>
      </View>
      <SearchBar value={query} onChange={setQuery} />
      <CategoryChips active={cat} onChange={setCat} />
      <Text style={[styles.sectionTitle, { color: c.subtext }]}>Rekomendasi</Text>
    </View>
  ), [query, cat, c]);

  return (
    <Screen padded={false}>
      <FlatList
        key={numColumns} // force remount when column count changes (fold/unfold)
        data={data}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ rowGap: gap, paddingTop: 12, paddingHorizontal: sidePad, paddingBottom: 0 }}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={{ paddingHorizontal: 0 }}
        numColumns={numColumns}
        columnWrapperStyle={{ columnGap: gap }}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/recipe/[id]", params: { id: item.id } }} asChild>
            <RecipeGridCard item={item} width={cardWidth} />
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

