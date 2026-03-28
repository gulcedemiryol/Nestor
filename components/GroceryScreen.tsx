import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { colors } from "../theme";

type GroceryItem = {
  id: string;
  name: string;
  bought: boolean;
};

export default function GroceryScreen({ onBack, onProceedToPayment }: { onBack: () => void; onProceedToPayment: () => void; }) {
  const [items, setItems] = useState<GroceryItem[]>([
    { id: "1", name: "Yarım Yağlı Süt", bought: false },
    { id: "2", name: "Tam Buğday Ekmeği", bought: true },
    { id: "3", name: "Yumurta (10'lu)", bought: false },
  ]);
  const [newItem, setNewItem] = useState("");
  const [totalAmount, setTotalAmount] = useState("285.50");

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([{ id: Date.now().toString(), name: newItem, bought: false }, ...items]);
    setNewItem("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, bought: !item.bought } : item));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Market Listem</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Ürün Ekleme Alanı */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Listeye ekle..."
          placeholderTextColor="#999"
          value={newItem}
          onChangeText={setNewItem}
        />
        <Pressable onPress={addItem} style={styles.addBtn}>
          <Text style={styles.addBtnText}>Ekle</Text>
        </Pressable>
      </View>

      {/* Alışveriş Listesi */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => toggleItem(item.id)} 
            style={[styles.itemCard, item.bought && styles.itemBought]}
          >
            <Text style={[styles.itemText, item.bought && styles.itemTextBought]}>
              {item.bought ? "✅ " : "⚪ "} {item.name}
            </Text>
          </Pressable>
        )}
      />

      {/* Alt Ödeme Paneli */}
      <View style={styles.paymentPanel}>
        <Text style={styles.paymentLabel}>Tahmini Toplam Tutar (TL)</Text>
        <TextInput
          style={styles.amountInput}
          keyboardType="numeric"
          value={totalAmount}
          onChangeText={setTotalAmount}
        />
        <Pressable 
          style={styles.checkoutBtn} 
          onPress={() => {
            if(parseFloat(totalAmount) > 0) {
              onProceedToPayment(); 
            } else {
              alert("Lütfen bir tutar giriniz.");
            }
          }}
        >
          <Text style={styles.checkoutBtnText}>Siparişi Tamamla</Text>
          <Text style={styles.checkoutSubText}>Vasi Onayına Gönderilir</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: 20, backgroundColor: colors.card, borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.1)', paddingTop: 50 
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: "#FFFFFF" },
  backBtn: { padding: 8 },
  backBtnText: { color: colors.accent, fontWeight: 'bold', fontSize: 18 },
  inputSection: { flexDirection: 'row', padding: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  input: { flex: 1, backgroundColor: "#FFF", borderRadius: 15, paddingHorizontal: 15, fontSize: 18, color: "#333" },
  addBtn: { marginLeft: 10, backgroundColor: colors.accent, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 15 },
  addBtnText: { color: "#FFF", fontWeight: 'bold', fontSize: 16 },
  itemCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, 
    marginHorizontal: 20, marginTop: 15, padding: 22, borderRadius: 20, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  itemBought: { opacity: 0.6, backgroundColor: 'rgba(255,255,255,0.05)' },
  itemText: { fontSize: 20, fontWeight: '700', color: "#FFFFFF" },
  itemTextBought: { textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.4)' },
  paymentPanel: { 
    padding: 25, backgroundColor: colors.card, borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, borderTopWidth: 2, borderColor: colors.accent 
  },
  paymentLabel: { color: colors.accent, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  amountInput: { 
    backgroundColor: '#FFF', borderRadius: 15, padding: 15, fontSize: 28, 
    fontWeight: '900', color: '#000', textAlign: 'center', marginVertical: 15 
  },
  checkoutBtn: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  checkoutSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }
});