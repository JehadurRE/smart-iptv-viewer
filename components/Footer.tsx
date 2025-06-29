import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@/context/theme-context";
import { isTVDevice, isLargeScreen, getFontSize } from "@/utils/tv-utils";

export function Footer() {
  const { colors } = useTheme();
  const isTV = isTVDevice();
  const isLarge = isLargeScreen();

  return (
    <View style={[
      styles.container,
      (isTV || isLarge) && { paddingVertical: 24 }
    ]}>
      <Text style={[
        styles.copyright, 
        { 
          color: colors.textSecondary,
          fontSize: (isTV || isLarge) ? getFontSize(14) : 12
        }
      ]}>
        © 2025 JehadurRE@CyArm 🇧🇩 🇵🇸
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  copyright: {
    fontSize: 12,
    textAlign: "center",
  },
});