import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator, // Yükleme ikonu için ekledik
} from "react-native";
import * as Speech from "expo-speech"; // Sesli yanıt için
import { colors, radius } from "../theme";
import { analyzeScreen } from "../services/geminiService"; // 🟢 Import edildiğinden emin ol

type Message = {
  id: string;
  text: string;
  sender: "user" | "nestor";
  timestamp: Date;
};

type Medication = {
  id: string;
  name: string;
  time: string;
  active: boolean;
};

const REGISTERED_USER = "Kullanıcı";

export default function AssistantScreen({ onBack }: { onBack: () => void }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 🟢 Yükleme durumu eklendi
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Merhaba ${REGISTERED_USER}! Ben Nestor. Sana bugün nasıl yardımcı olabilirim?`,
      sender: "nestor",
      timestamp: new Date(),
    },
  ]);

  const [meds] = useState<Medication[]>([
    { id: "1", name: "Coraspin", time: "09:00", active: true },
  ]);

  const flatListRef = useRef<FlatList>(null);

  // 🟢 DÜZELTİLMİŞ SEND MESSAGE FONKSİYONU
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true); // Nestor düşünmeye başladı

    try {
      // Gemini'ye gönderiyoruz
      const response = await analyzeScreen({
        prompt: userText,
        targetHint: "Sohbet ekranında kullanıcıyla mesajlaşma.",
        screenshotBase64: null,
      });

      const nestorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "nestor",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, nestorMsg]);
      
      // Nestor sesli cevap versin
      Speech.speak(response.message, { language: "tr-TR", rate: 0.9 });

    } catch (error) {
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        text: "Bağlantı kuramadım, lütfen internetini kontrol eder misin evladım?",
        sender: "nestor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false); // İşlem bitti
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Nestor AI</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === "user" ? styles.userBubble : styles.nestorBubble,
            ]}
          >
            <Text
              style={[
                styles.msgText,
                item.sender === "user" ? styles.userText : styles.nestorText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* İlaç Önizleme */}
      <View style={styles.medPreview}>
        <Text style={styles.medTitle}>Güncel İlaçlarım ({meds.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {meds.map((m) => (
            <View key={m.id} style={styles.medBadge}>
              <Text style={styles.medBadgeText}>💊 {m.name} - {m.time}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nestor'a bir şey sor..."
          placeholderTextColor="#999"
          editable={!isLoading} // Yüklenirken yazmayı engelle
        />
        <Pressable 
          onPress={sendMessage} 
          style={[styles.sendBtn, isLoading && { opacity: 0.5 }]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.sendBtnText}>Gönder</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles aynı kalabilir...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: "#FFFFFF" },
  backBtn: { padding: 8 },
  backBtnText: { color: colors.accent, fontWeight: 'bold', fontSize: 16 },
  chatList: { padding: 16, paddingBottom: 20 },
  bubble: { 
    maxWidth: '85%', 
    padding: 14, 
    borderRadius: 22, 
    marginBottom: 12,
  },
  nestorBubble: { alignSelf: 'flex-start', backgroundColor: "#FFFFFF", borderBottomLeftRadius: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.accent, borderBottomRightRadius: 4 },
  msgText: { fontSize: 17, fontWeight: '600', lineHeight: 24 },
  nestorText: { color: "#1A1A1A" }, 
  userText: { color: "#FFFFFF" },
  medPreview: { padding: 14, backgroundColor: 'rgba(255,255,255,0.05)' },
  medTitle: { fontSize: 13, fontWeight: '800', color: colors.accent, marginBottom: 8 },
  medBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, marginRight: 10 },
  medBadgeText: { fontSize: 14, fontWeight: 'bold', color: "#FFFFFF" },
  inputRow: { flexDirection: 'row', padding: 16, backgroundColor: colors.card, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 25, paddingHorizontal: 18, paddingVertical: 12, color: '#333' },
  sendBtn: { marginLeft: 12, backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  sendBtnText: { color: "#FFFFFF", fontWeight: '900' }
});