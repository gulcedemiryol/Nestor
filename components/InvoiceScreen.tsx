import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../theme";

type Invoice = {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
  date: string;
  image?: string;
};

// Sadece BİR tane export default olmalı
export default function InvoiceScreen({ onBack, onProceedToPayment }: { 
    onBack: () => void; 
    onProceedToPayment: (amount: number) => void;
  }) {
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "1", name: "Elektrik Faturası", amount: 450, isPaid: false, date: "15 Mart" },
    { id: "2", name: "Su Faturası", amount: 120, isPaid: true, date: "10 Mart" },
  ]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Hata", "Kameraya izin vermeniz gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) {
      const newInv: Invoice = {
        id: Date.now().toString(),
        name: "Yeni Fatura (Tespit Edilen)",
        amount: 320, 
        isPaid: false,
        date: "Bugün",
        image: result.assets[0].uri
      };
      setInvoices([newInv, ...invoices]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Faturalarım</Text>
        <Pressable onPress={takePhoto} style={styles.cameraBtn}>
          <Text style={{ fontSize: 24 }}>📸</Text>
        </Pressable>
      </View>

      {/* Fatura Listesi */}
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.card, item.isPaid && styles.cardPaid]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.invoiceName}>{item.name}</Text>
              <Text style={styles.invoiceDetail}>{item.date} • {item.amount} TL</Text>
              {item.image && <Image source={{ uri: item.image }} style={styles.miniPhoto} />}
            </View>

            {item.isPaid ? (
              <Text style={styles.paidText}>ÖDENDİ ✅</Text>
            ) : (
              <Pressable 
                style={styles.payBtn} 
                onPress={() => onProceedToPayment(item.amount)} // Tutarı gönderir
              >
                <Text style={styles.payBtnText}>ÖDE</Text>
              </Pressable>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: colors.card, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: "#FFFFFF" },
  backBtn: { padding: 8 },
  backBtnText: { color: colors.accent, fontWeight: 'bold', fontSize: 18 },
  cameraBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 15 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, marginBottom: 15, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardPaid: { opacity: 0.5, borderColor: '#2E7D32' },
  invoiceName: { fontSize: 18, fontWeight: '800', color: "#FFF" },
  invoiceDetail: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  miniPhoto: { width: 50, height: 50, borderRadius: 8, marginTop: 10 },
  payBtn: { backgroundColor: colors.accent, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  payBtnText: { color: "#FFF", fontWeight: '900' },
  paidText: { color: '#4CAF50', fontWeight: 'bold' }
});