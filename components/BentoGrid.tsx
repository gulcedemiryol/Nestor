import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import BentoCard from "./BentoCard";
import { colors } from "../theme";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// KRİTİK: App.tsx'teki 5 fonksiyonla tam uyumlu olmalı
type BentoGridProps = {
  onCallFamily: () => void;
  onDrugReminders: () => void;
  onAssistant: () => void;
  onMarket: () => void;
  onBills: () => void;
};

export default function BentoGrid({
  onCallFamily,
  onDrugReminders,
  onAssistant,
  onMarket,
  onBills,
}: BentoGridProps) {
  const { height } = useWindowDimensions();

  const topHeight = clamp(Math.round(height * 0.28), 150, 220);
  const bottomHeight = clamp(Math.round(height * 0.18), 110, 160);

  return (
    <View style={styles.container}>
      {/* 1. SATIR: SOS */}
      <View style={{ height: topHeight, width: '100%' }}>
        <BentoCard
          title="📞 Beni Ara"
          description="Ailenize ulaşın ve konum gönderin."
          onPress={onCallFamily}
        />
      </View>

      {/* 2. SATIR: İLAÇLAR VE ASİSTAN */}
      <View style={[styles.row, { marginTop: 12 }]}>
        <View style={{ height: bottomHeight, flex: 1 }}>
          <BentoCard
            title="💊 İlaçlarım"
            description="Hatırlatıcılar."
            onPress={onDrugReminders}
          />
        </View>
        <View style={{ height: bottomHeight, flex: 1, marginLeft: 12 }}>
          <BentoCard
            title="🤖 Asistan"
            description="Nestor'a sor."
            onPress={onAssistant}
          />
        </View>
      </View>

      {/* 3. SATIR: MARKET VE FATURALAR */}
      <View style={[styles.row, { marginTop: 12 }]}>
        <View style={{ height: bottomHeight, flex: 1 }}>
          <BentoCard
            title="🛒 Market"
            description="Alışveriş yap."
            onPress={onMarket}
          />
        </View>
        <View style={{ height: bottomHeight, flex: 1, marginLeft: 12 }}>
          <BentoCard
            title="🧾 Faturalar"
            description="Ödemeleri yönet."
            onPress={onBills}
          />
        </View>
      </View>

      <View style={styles.footerHint}>
        <Text style={styles.footerText}>🛡️ Nestor Güvenlik Devrede</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: "row", width: '100%' },
  footerHint: { marginTop: 16, alignItems: "center" },
  footerText: { color: colors.textOnBackground, fontSize: 14, fontWeight: "700", opacity: 0.6 },
});