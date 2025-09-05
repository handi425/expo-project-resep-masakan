import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Cari resep, bahan, dll" }: Props) {
  const c = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: c.card, borderColor: c.border }]}>
      <Ionicons name="search" size={18} color={c.subtext} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={c.subtext}
        style={[styles.input, { color: c.text }]}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

