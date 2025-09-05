import React, { useMemo } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import Screen from "../../components/Screen";
import { useThemeColors } from "../../lib/theme";
import { useFavorites } from "../../context/FavoritesContext";
import { recipes } from "../../data/recipes";
import { Link } from "expo-router";
import RecipeCard from "../../components/RecipeCard";
import EmptyState from "../../components/EmptyState";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const c = useThemeColors();
  const { favorites } = useFavorites();
  const data = useMemo(() => recipes.filter((r) => favorites.has(r.id)), [favorites]);
  const insets = useSafeAreaInsets();

  return (
    <Screen padded={false}>
      <Text style={[styles.title, { color: c.text }]}>Favorit Saya</Text>
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ gap: 12, paddingTop: 12, paddingHorizontal: 16, paddingBottom: Math.max(0, insets.bottom) }}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/recipe/[id]", params: { id: item.id } }} asChild>
            <RecipeCard item={item} />
          </Link>
        )}
        ListEmptyComponent={<EmptyState icon="heart-dislike-outline" title="Belum ada favorit" subtitle="Tap ikon hati pada resep" />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "800", marginTop: 6 },
});
