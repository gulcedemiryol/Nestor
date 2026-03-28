import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { colors, radius } from "../theme";

type BentoCardProps = {
  title: string;
  description: string;
  onPress: () => void;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

export default function BentoCard({
  title,
  description,
  onPress,
  accessibilityLabel,
  style,
}: BentoCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        {
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          paddingHorizontal: 18,
          paddingVertical: 16,
          minHeight: 80, // PRD: dokunma alanı min 64dp; kart içi min içerir
          transform: [{ scale: pressed ? 0.985 : 1 }],
          opacity: pressed ? 0.97 : 1,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: colors.accent,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: colors.card, fontWeight: "700", fontSize: 14 }}>
            Nestor
          </Text>
        </View>

        <Text
          style={{
            color: colors.textOnCard,
            fontSize: 22, // PRD: min 18px
            fontWeight: "800",
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: colors.textOnCard,
            fontSize: 16,
            fontWeight: "600",
            opacity: 0.92,
            marginTop: 10,
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

