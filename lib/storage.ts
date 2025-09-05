import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favorites.v1";
const ONBOARD_KEY = "onboarding.v1.done";

export async function getFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function setFavorites(ids: string[]) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(ids));
  } catch (e) {
    // ignore
  }
}

export async function getOnboardingDone(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(ONBOARD_KEY);
    return v === "1";
  } catch (e) {
    return false;
  }
}

export async function setOnboardingDone(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARD_KEY, "1");
  } catch {}
}
