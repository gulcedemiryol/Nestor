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
  ActivityIndicator,
} from "react-native";
import * as Speech from "expo-speech"; // Sesli yanıt için
import { colors } from "../theme";
import { analyzeScreen } from "../services/geminiService"; // API servisini kullanacağız

type Message = {
  id: string;
  text: string;
  sender: "user" | "nestor";
};

export default function AssistantScreen({ onBack }: { onBack: () => void }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      text: "Merhaba! Ben Nestor. Size nasıl yardımcı olabilirim? İsterseniz yazabilir, isterseniz bana seslenebilirsiniz.", 
      sender: "nestor" 
    }
  ]);

  const flatListRef = useRef<FlatList>(null);

  // Nestor'un sesli konuşması için yardımcı fonksiyon
  const speak = (text: string) => {
    Speech.speak(text, { language: "tr-TR", rate: 0.9, pitch: 1.0 });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const userMsg: Message = { id: Date.now().toString(), text: userText, sender: "user" };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // 🟢 Gemini API Çağrısı
      // Burada analyzeScreen'i sadece metin tabanlı asistan olarak kullanıyoruz.
      // screenshotBase64 boş gidebilir veya genel bir sistem promptu ekleyebilirsin.
      const response = await analyzeScreen({
        prompt: userText,
        targetHint: "Sen Nestor adında yaşlılara yardımcı olan bilge, sakin ve şefkatli bir asistansın. Kısa ve net cevaplar ver.",
        mimeType: "image/png",
        screenshotBase64: "", // Sadece metin gönderiyoruz
      });

      const nestorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.message, 
        sender: "nestor" 
      };

      setMessages(prev => [...prev, nestorMsg]);
      speak(response.message); // Cevabı sesli oku

    } catch (error) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "Üzgünüm, şu an bağlantı kuramadım. Tekrar dener misiniz?", 
        sender: "nestor" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Mesaj geldiğinde en alta kaydır
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      {/* Üst Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => { Speech.stop(); onBack(); }} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </Pressable>
        <View style={styles.titleContainer}>
           <Text style={styles.headerTitle}>Nestor Destek</Text>
           <View style={styles.onlineStatus} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Mesaj Listesi */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble, 
            item.sender === "user" ? styles.userBubble : styles.nestorBubble
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === "user" ? styles.userText : styles.nestorText
            ]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Giriş Alanı */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Buraya yazın..."
          placeholderTextColor="#999"
          multiline
        />
        <Pressable 
          onPress={sendMessage} 
          style={[styles.sendBtn, (!inputText.trim() || isLoading) && styles.disabledBtn]}
          disabled={!inputText.trim() || isLoading}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 50, 
    paddingBottom: 15,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  titleContainer: { alignItems: 'center', flexDirection: 'row' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: "#FFF" },
  onlineStatus: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ADE80', marginLeft: 8 },
  backBtn: { padding: 8 },
  backBtnText: { color: colors.accent, fontWeight: 'bold', fontSize: 18 },
  listContent: { padding: 20, paddingBottom: 30 },
  bubble: { 
    maxWidth: '85%', 
    padding: 16, 
    borderRadius: 24, 
    marginBottom: 12,
    elevation: 2 
  },
  nestorBubble: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#333', 
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  userBubble: { 
    alignSelf: 'flex-end', 
    backgroundColor: colors.accent, 
    borderBottomRightRadius: 4 
  },
  messageText: { fontSize: 18, lineHeight: 24, fontWeight: '500' },
  nestorText: { color: '#FFF' },
  userText: { color: '#FFF' },
  inputRow: { 
    flexDirection: 'row', 
    padding: 16, 
    paddingBottom: Platform.OS === 'ios' ? 35 : 16,
    backgroundColor: colors.card, 
    alignItems: 'flex-end' 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 18, 
    maxHeight: 100,
    color: '#000'
  },
  sendBtn: { 
    marginLeft: 12, 
    backgroundColor: colors.accent, 
    paddingHorizontal: 20, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  disabledBtn: { opacity: 0.5 }
});