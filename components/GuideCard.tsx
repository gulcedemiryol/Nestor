import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { colors, radius } from "../theme";

type GuideCardProps = {
  message: string;
  steps: string[];
  onClose?: () => void; // 🟢 onClose opsiyonel olarak eklendi
};

export default function GuideCard({ message, steps, onClose }: GuideCardProps) {
  return (
    <View style={styles.card} accessibilityLabel="Rehber kartı">
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Rehber</Text>
        </View>
        
        {/* 🟢 Kapat butonu eklendi */}
        {onClose && (
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Kapat ✕</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.steps}>
        {steps.map((s, idx) => (
          <Text key={`${idx}-${s}`} style={styles.stepLine}>
            • {s}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 25, // App.tsx'teki FAB yüksekliğine göre ayarlı
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10 
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { color: "#FFF", fontWeight: "900", fontSize: 13 },
  closeBtn: { padding: 5 },
  closeBtnText: { color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' },
  message: { color: "#FFF", fontSize: 18, fontWeight: "800", lineHeight: 24 },
  steps: { marginTop: 12 },
  stepLine: { color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: "600", marginTop: 6 },
});