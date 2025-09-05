import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ViewToken, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../lib/theme";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { setOnboardingDone } from "../../lib/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Slide = { key: string; title: string; subtitle: string; image: string };

const SLIDES: Slide[] = [
  {
    key: "discover",
    title: "Cari resep favoritmu",
    subtitle: "Search instan, filter kategori, dan lihat bahan lengkap.",
    image: "https://picsum.photos/seed/food-discover/1080/720",
  },
  {
    key: "cook",
    title: "Ikuti langkahnya",
    subtitle: "Langkah memasak jelas, ringkas, dan mudah diikuti.",
    image: "https://picsum.photos/seed/food-cook/1080/720",
  },
  {
    key: "favorite",
    title: "Simpan jadi favorit",
    subtitle: "Kumpulkan resep kesukaanmu untuk diakses cepat kapan pun.",
    image: "https://picsum.photos/seed/food-favorite/1080/720",
  },
];

export default function Onboarding() {
  const c = useThemeColors();
  const router = useRouter();
  const ref = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const width = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();

  const goNext = async () => {
    if (index < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setOnboardingDone();
      router.replace("/(tabs)");
    }
  };

  const skip = async () => {
    Haptics.selectionAsync();
    await setOnboardingDone();
    router.replace("/(tabs)");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 60 }), []);

  return (
    <View style={[styles.wrap, { backgroundColor: c.background, paddingTop: insets.top, paddingBottom: Math.max(12, insets.bottom) }]}> 
      <TouchableOpacity onPress={skip} style={[styles.skipBtn, { backgroundColor: c.card, borderColor: c.border, top: 10 + insets.top }]}> 
        <Text style={{ color: c.subtext, fontWeight: "700" }}>Lewati</Text>
      </TouchableOpacity>

      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => it.key}
        renderItem={({ item }) => <SlideView item={item} width={width} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={[styles.footer, { bottom: 16 + insets.bottom }]}>
        <Dots total={SLIDES.length} index={index} />
        <TouchableOpacity onPress={goNext} style={[styles.cta, { backgroundColor: c.primary }]}> 
          <Ionicons name={index === SLIDES.length - 1 ? "checkmark" : "arrow-forward"} color="#0B0F14" size={20} />
          <Text style={styles.ctaText}>{index === SLIDES.length - 1 ? "Mulai" : "Berikutnya"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SlideView({ item, width }: { item: Slide; width: number }) {
  const c = useThemeColors();
  return (
    <View style={{ width, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: "100%", height: 360, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: c.border }}>
        <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} />
      </View>
      <Text style={{ color: c.text, fontSize: 24, fontWeight: "900", marginTop: 20, textAlign: "center" }}>{item.title}</Text>
      <Text style={{ color: c.subtext, marginTop: 8, textAlign: "center", lineHeight: 20 }}>{item.subtitle}</Text>
    </View>
  );
}

function Dots({ total, index }: { total: number; index: number }) {
  const c = useThemeColors();
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ width: i === index ? 22 : 8, height: 8, borderRadius: 999, backgroundColor: i === index ? c.primary : c.chip }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center" },
  footer: { position: "absolute", left: 20, right: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cta: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 18, height: 48, borderRadius: 12 },
  ctaText: { color: "#0B0F14", fontWeight: "800", fontSize: 16 },
  skipBtn: { position: "absolute", right: 18, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 36, alignItems: "center", justifyContent: "center", zIndex: 2 },
});
