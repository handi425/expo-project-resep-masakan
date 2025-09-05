import { useMemo } from "react";
import { recipes as allRecipes } from "../data/recipes";
import type { Category, Recipe } from "../lib/types";

export function useRecipes(query: string, category: Category | "Semua"): Recipe[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allRecipes;
    if (category !== "Semua") list = list.filter((r) => r.category === category);
    if (!q) return list;
    return list.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
      (r.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [query, category]);
}

export function getRecipeById(id: string) {
  return allRecipes.find((r) => r.id === id);
}

export function getRelatedRecipes(id: string, limit = 6): Recipe[] {
  const base = getRecipeById(id);
  if (!base) return allRecipes.slice(0, limit);
  const tags = new Set((base.tags || []).map((t) => t.toLowerCase()));
  const list = allRecipes.filter((r) => r.id !== id);
  const scored = list
    .map((r) => {
      let score = 0;
      if (r.category === base.category) score += 2;
      const rTags = (r.tags || []).map((t) => t.toLowerCase());
      const tagMatches = rTags.reduce((acc, t) => acc + (tags.has(t) ? 1 : 0), 0);
      score += tagMatches;
      return { r, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.r.title.localeCompare(b.r.title);
    })
    .slice(0, limit)
    .map((x) => x.r);
  return scored;
}
