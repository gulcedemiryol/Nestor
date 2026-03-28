import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import BentoGrid from "./components/BentoGrid";
import ErrorBoundary from "./components/ErrorBoundary";
import GuideCard from "./components/GuideCard";
import GroceryScreen from "./components/GroceryScreen"; 
import InvoiceScreen from "./components/InvoiceScreen";
import AssistantScreen from "./components/AssistantScreen";
import PaymentFlowScreen from "./components/PaymentFlowScreen"; 
import { colors } from "./theme";
import { analyzeScreen } from "./services/geminiService";
import { clearPendingForDemo } from "./services/transactionGate";

function NestorApp() {
  type Screen = "home" | "callFamily" | "drugReminders" | "assistant" | "market" | "bills" | "payment_market" | "payment_bills";
  
  const [screen, setScreen] = useState<Screen>("home");
  const [pendingAmount, setPendingAmount] = useState<number>(0);

  const viewShotRef = useRef<any>(null);
  const insightRunIdRef = useRef(0);

  const [isScreenInsightLoading, setIsScreenInsightLoading] = useState(false);
  const [insightMessage, setInsightMessage] = useState<string>("");
  const [insightSteps, setInsightSteps] = useState<string[]>([]);
  const [showGuideCard, setShowGuideCard] = useState(false);

  // 🟢 Nestor'un asistan ekranına mesaj aktarması için bir state ekleyebiliriz (opsiyonel)
  
  useEffect(() => {
    // Ekran değişince sesi durdur ama asistan ekranına geçişte özel davranacağız
    if (screen !== "assistant") {
      Speech.stop();
      setShowGuideCard(false);
    }
    setIsScreenInsightLoading(false);
  }, [screen]);

  async function startScreenInsight() {
    if (isScreenInsightLoading) return;
    insightRunIdRef.current += 1;
    const runId = insightRunIdRef.current;
    
    setInsightMessage("");
    setInsightSteps([]);
    setShowGuideCard(false);
    setIsScreenInsightLoading(true);

    try {
      Speech.speak("Hemen bakıyorum...", { language: "tr-TR", rate: 0.95 });

      // 🟢 DÜZELTME: Tüm ekranı yakalamak için ViewShot artık dışarıda
      const screenshotBase64 = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.8,
        result: "base64",
        width: 720,
      });

      const result = await analyzeScreen({
        screenshotBase64,
        mimeType: "image/png",
        targetHint: `${screen} ekranı inceleniyor.`,
        prompt: "Kullanıcıya torununa anlatır gibi, çok kısa ve net bir rehber ver. Cevabın sonunda mutlaka kullanıcıyı asistan ekranına davet et.",
      });

      if (insightRunIdRef.current !== runId) return;

      setInsightMessage(result.message);
      setInsightSteps(result.guidanceSteps);
      setShowGuideCard(true);
      
      Speech.speak(result.message, { 
        language: "tr-TR", 
        rate: 0.9,
        onDone: () => {
          // Ses bitince asistan sayfasına yönlendirebiliriz
          // setScreen("assistant"); 
        }
      });

    } catch (e) {
      if (insightRunIdRef.current !== runId) return;
      setInsightMessage("Görüntüyü analiz ederken bir hata oluştu.");
      setShowGuideCard(true);
    } finally {
      if (insightRunIdRef.current === runId) setIsScreenInsightLoading(false);
    }
  }

  const renderContent = () => {
    switch (screen) {
      case "assistant":
        return <AssistantScreen onBack={() => setScreen("home")} />;
      
      case "market":
        return (
          <GroceryScreen 
            onBack={() => setScreen("home")} 
            onProceedToPayment={(amount: number) => {
              setPendingAmount(amount || 0);
              setScreen("payment_market");
            }} 
          />
        );

      case "bills":
        return (
          <InvoiceScreen 
            onBack={() => setScreen("home")} 
            onProceedToPayment={(amount: number) => {
               setPendingAmount(amount); 
               setScreen("payment_bills");
            }} 
           />
        );
  
      case "payment_market":
      case "payment_bills":
         return (
          <PaymentFlowScreen
            type={screen === "payment_market" ? "market" : "bills"}
            initialAmount={pendingAmount} 
            onBack={() => {
               clearPendingForDemo();
               setPendingAmount(0);
               setScreen("home");
             }}
           />
         );

      case "drugReminders":
        return (
          <View style={styles.screenBody}>
            <View style={styles.contentCard}>
              <Text style={styles.cardEmoji}>💊</Text>
              <Text style={styles.cardTitle}>İlaç Vakti</Text>
              <View style={styles.medDetail}>
                <Text style={styles.medNameText}>Coraspin 100mg</Text>
                <Text style={styles.medTimeText}>Sabah Tok Karnına - 09:00</Text>
              </View>
              <Pressable style={styles.actionBtn} onPress={() => alert("İçildi!")}>
                <Text style={styles.actionBtnText}>İçtim ✅</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => setScreen("home")} style={styles.backHomeBtn}>
              <Text style={styles.backHomeBtnText}>Ana Menüye Dön</Text>
            </Pressable>
          </View>
        );

      case "callFamily":
        return (
          <View style={styles.screenBody}>
            <View style={styles.contentCard}>
              <Text style={styles.cardEmoji}>📞</Text>
              <Text style={styles.cardTitle}>Aileyi Ara</Text>
              <View style={styles.contactCard}>
                <Text style={styles.contactName}>Kızım (Gülce)</Text>
                <Text style={styles.contactStatus}>Şu an müsait</Text>
                <Pressable style={[styles.actionBtn, {backgroundColor: '#d9534f'}]} onPress={() => alert("Aranıyor...")}>
                  <Text style={styles.actionBtnText}>Hemen Ara</Text>
                </Pressable>
              </View>
            </View>
            <Pressable onPress={() => setScreen("home")} style={styles.backHomeBtn}>
              <Text style={styles.backHomeBtnText}>Ana Menüye Dön</Text>
            </Pressable>
          </View>
        );

      default:
        return (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>Nestor</Text>
                <Text style={styles.subtitle}>Bugün hava 22°C, harika bir gün!</Text>
              </View>
            </View>
            <BentoGrid
              onCallFamily={() => setScreen("callFamily")}
              onDrugReminders={() => setScreen("drugReminders")}
              onAssistant={() => setScreen("assistant")}
              onMarket={() => setScreen("market")}
              onBills={() => setScreen("bills")}
            />
          </View>
        );
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {/* 🟢 KRİTİK DÜZELTME: ViewShot tüm ekranları sarmalıyor */}
        <ViewShot ref={viewShotRef} style={{ flex: 1 }} options={{ format: "png", quality: 0.8 }}>
          {renderContent()}
        </ViewShot>

        {/* 🟢 KRİTİK DÜZELTME: Nestor Butonu her ekranda (asistan hariç) aktif */}
        {screen !== "assistant" && (
          <Pressable
            onPress={startScreenInsight}
            disabled={isScreenInsightLoading}
            style={({ pressed }) => [
              styles.assistantFab,
              { 
                bottom: showGuideCard ? 240 : 30, 
                opacity: (pressed || isScreenInsightLoading) ? 0.7 : 1 
              }
            ]}
          >
            {isScreenInsightLoading ? (
               <ActivityIndicator color="#FFF" size="small" />
            ) : (
               <Text style={styles.assistantFabText}>Nestor'a Sor</Text>
            )}
          </Pressable>
        )}

        {showGuideCard && (
          <GuideCard 
            message={insightMessage} 
            steps={insightSteps} 
            onClose={() => setShowGuideCard(false)} 
          />
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 50 },
  header: { marginBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flex: 1, paddingRight: 10 },
  title: { fontSize: 28, fontWeight: "900", color: colors.textOnBackground },
  subtitle: { marginTop: 8, fontSize: 18, fontWeight: "600", color: "rgba(255,255,255,0.7)" },
  screenBody: { flex: 1, padding: 10, alignItems: 'center' },
  contentCard: { 
    backgroundColor: colors.card, 
    width: '100%', 
    padding: 24, 
    borderRadius: 30, 
    alignItems: 'center', 
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  cardEmoji: { fontSize: 60, marginBottom: 10 },
  cardTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: "#FFF" },
  medDetail: { alignItems: 'center', marginBottom: 20 },
  medNameText: { fontSize: 22, fontWeight: 'bold', color: "#FFF" },
  medTimeText: { fontSize: 18, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  contactCard: { alignItems: 'center', marginBottom: 20, width: '100%' },
  contactName: { fontSize: 26, fontWeight: '900', color: '#FFFFFF' },
  contactStatus: { fontSize: 18, color: '#4ADE80', fontWeight: '800', marginTop: 4, marginBottom: 15 },
  actionBtn: { backgroundColor: colors.accent, paddingHorizontal: 40, paddingVertical: 18, borderRadius: 20, elevation: 5 },
  actionBtnText: { color: '#FFF', fontWeight: '900', fontSize: 20 },
  backHomeBtn: { marginTop: 30, padding: 10 },
  backHomeBtnText: { color: colors.accent, fontWeight: 'bold', fontSize: 16 },
  assistantFab: { 
    position: "absolute", 
    right: 16, 
    backgroundColor: colors.accent, 
    borderRadius: 35, 
    paddingHorizontal: 25, 
    height: 70, 
    alignItems: "center", 
    justifyContent: "center", 
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  assistantFabText: { color: "#FFF", fontSize: 18, fontWeight: "900" },
});

export default NestorApp;