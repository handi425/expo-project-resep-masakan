import React, { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { getOnboardingDone } from "../lib/storage";
import { useThemeColors } from "../lib/theme";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState<boolean | null>(null);
  const router = useRouter();
  const c = useThemeColors();

  useEffect(() => {
    (async () => {
      const flag = await getOnboardingDone();
      setDone(flag);
      setReady(true);
      router.replace(flag ? "/(tabs)" : "/onboarding");
    })();
  }, [router]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: c.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }

  return <Redirect href={done ? "/(tabs)" : "/onboarding"} />;
}
