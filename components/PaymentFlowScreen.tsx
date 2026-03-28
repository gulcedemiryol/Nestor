import { analyzeRisk } from "../services/riskEngine";
import React, { useMemo, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, Platform, ActivityIndicator } from "react-native";
import { colors, radius } from "../theme";
import {
  clearPendingForDemo,
  executeAfterApprovalIfAllowed,
  getPendingAuthorization,
  requestPayment,
  simulateCaregiverApprove,
  simulateCaregiverDeny,
  VASI_APPROVAL_LIMIT_TRY,
} from "../services/transactionGate";

// 🟢 DÜZELTME: initialAmount buraya eklendi
type PaymentFlowScreenProps = {
  onBack: () => void;
  type: "market" | "bills"; 
  initialAmount?: number; 
};

const maskSecurityData = (text: string, type: "market" | "bills") => {
  let masked = text;
  masked = masked.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "****-****-****-****");
  if (type === "market") {
    masked = masked.replace(/TR\d{24}/g, "TR************************");
  } else {
    masked = masked.replace(/\b\d{10}\b/g, "**********"); 
  }
  return masked;
};

export default function PaymentFlowScreen({ onBack, type, initialAmount }: PaymentFlowScreenProps) {
  // 🟢 DÜZELTME: initialAmount varsa stringe çevirip başlangıç değeri yapıyoruz
  const [amountText, setAmountText] = useState(initialAmount ? initialAmount.toString() : "");
  const [statusLine, setStatusLine] = useState("");
  const [phase, setPhase] = useState<"idle" | "pending" | "approved" | "done" | "denied" | "risk_blocked">("idle");
  const [caregiverLog, setCaregiverLog] = useState<string | null>(null);

  // 🟢 DÜZELTME: Eğer dışarıdan gelen tutar değişirse (nadir bir durum ama güvenli) inputu güncelle
  useEffect(() => {
    if (initialAmount) {
      setAmountText(initialAmount.toString());
    }
  }, [initialAmount]);

  const parsedAmount = useMemo(() => {
    const t = amountText.trim().replace(",", ".");
    const n = parseFloat(t);
    return Number.isFinite(n) ? n : NaN;
  }, [amountText]);

  useEffect(() => {
    let approvalTimer: any;
    if (phase === "pending") {
      approvalTimer = setTimeout(() => {
        const updated = simulateCaregiverApprove();
        if (updated?.status === "APPROVED") {
          setPhase("approved");
          setStatusLine("Müjde! Yakınınız işlemi onayladı. ✅");
        }
      }, 4500); 
    }
    return () => { if (approvalTimer) clearTimeout(approvalTimer); };
  }, [phase]);

  function handleTryPay() {
    setStatusLine("");
    if (parsedAmount >= 1500) {
      setPhase("risk_blocked");
      setStatusLine("KRİTİK: Yüksek tutarlı işlem güvenlik nedeniyle durduruldu.");
      return;
    }

    try {
      const cleanSummary = maskSecurityData(`${amountText} TL tutarında ${type === "market" ? "market" : "fatura"} işlemi denemesi.`, type);
      setCaregiverLog(cleanSummary);

      const result = requestPayment(parsedAmount);
      if (result.executedImmediately) {
        setPhase("done");
        setStatusLine(result.userMessage);
        return;
      }
      setPhase("pending");
      setStatusLine(result.userMessage);
    } catch (e: unknown) {
      setStatusLine("Bir sorun oldu.");
    }
  }

  function onApprove() {
    const updated = simulateCaregiverApprove();
    if (updated?.status === "APPROVED") {
      setPhase("approved");
      setStatusLine("Yakınınız onayladı. Şimdi ödemeyi güvenle tamamlayabilirsin.");
    }
  }

  function onDeny() {
    simulateCaregiverDeny();
    setPhase("denied");
    setStatusLine("Yakınınız bu işlemi onaylamadı.");
  }

  function tryAgain() {
    clearPendingForDemo();
    setPhase("idle");
    setAmountText("");
    setStatusLine("");
    setCaregiverLog(null);
  }

  function onFinalizeAfterApproval() {
    const ok = executeAfterApprovalIfAllowed();
    if (ok) {
      setPhase("done");
      setStatusLine("Ödeme başarıyla tamamlandı.");
      setTimeout(onBack, 2000); 
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.lead}>
          {type === "market" ? "🛒 Market Alışverişi" : "🧾 Fatura Ödemesi"} yapıyorsunuz.
        </Text>

        <Text style={styles.label}>Tutar (TL)</Text>
        <TextInput
          accessibilityLabel="Ödeme tutarı"
          value={amountText}
          onChangeText={setAmountText}
          keyboardType="decimal-pad"
          placeholder="Örn: 650"
          placeholderTextColor="#888"
          style={styles.input}
          editable={phase === "idle"}
        />

        {phase === "idle" && (
          <Pressable
            onPress={handleTryPay}
            disabled={Number.isNaN(parsedAmount)}
            style={[styles.primary, { opacity: Number.isNaN(parsedAmount) ? 0.5 : 1 }]}
          >
            <Text style={styles.primaryText}>Ödemeyi Gönder</Text>
          </Pressable>
        )}

        {phase === "pending" && (
          <View style={styles.pendingCard}>
            <ActivityIndicator color={colors.accent} size="large" />
            <Text style={styles.pendingTitle}>Vasi Onayı Bekleniyor</Text>
            <Text style={styles.pendingBody}>Yakınınızın telefonuna bildirim gönderildi. (4.5s içinde otomatik onaylanacak)</Text>
            <View style={styles.simRow}>
              <Pressable onPress={onApprove} style={styles.simApprove}>
                <Text style={styles.simApproveText}>Manuel Onay</Text>
              </Pressable>
              <Pressable onPress={onDeny} style={styles.simDeny}>
                <Text style={styles.simDenyText}>Reddet</Text>
              </Pressable>
            </View>
          </View>
        )}

        {phase === "approved" && (
          <Pressable onPress={onFinalizeAfterApproval} style={[styles.primary, { backgroundColor: '#2E7D32' }]}>
            <Text style={styles.primaryText}>Ödemeyi Tamamla ✅</Text>
          </Pressable>
        )}

        {phase === "risk_blocked" && (
          <View style={[styles.pendingCard, { backgroundColor: '#D32F2F' }]}>
            <Text style={{ color: '#FFF', fontWeight: '900' }}>⚠️ GÜVENLİK BLOKAJI</Text>
            <Text style={{ color: '#FFF', marginTop: 8, fontSize: 13 }}>Nestor bu işlemi yüksek riskli olarak işaretledi.</Text>
            <Pressable onPress={tryAgain} style={styles.riskButton}>
              <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>Geri Dön</Text>
            </Pressable>
          </View>
        )}

        {statusLine ? <Text style={styles.status}>{statusLine}</Text> : null}

        {caregiverLog && (
          <View style={styles.debugPanel}>
            <Text style={styles.debugTitle}>📡 Vasi Telefonuna Giden Güvenli Veri:</Text>
            <View style={styles.debugCodeBox}>
              <Text style={styles.debugText}>
                {`{ \n  "user": "Gülce", \n  "action": "PAYMENT_REQUEST", \n  "secure_payload": "${caregiverLog}", \n  "status": "${phase === "pending" ? "WAITING" : (phase === "denied" ? "DENIED" : "APPROVED")}" \n}`}
              </Text>
            </View>
            <Text style={styles.debugHint}>* Kimlik ve kart bilgileri cihazda maskelenerek gönderildi.</Text>
          </View>
        )}

        <Pressable onPress={onBack} style={styles.secondary}>
          <Text style={styles.secondaryText}>Dashboard'a Dön</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 60 },
  wrap: { flex: 1 },
  lead: { color: colors.textOnBackground || "#FFF", fontSize: 18, fontWeight: "600", marginBottom: 14 },
  label: { color: colors.textOnBackground || "#FFF", fontWeight: "800", fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: "#FFFFFF", borderRadius: radius.xl, borderWidth: 2, borderColor: colors.accent, padding: 16, fontSize: 18, fontWeight: "700", color: "#000" },
  primary: { marginTop: 14, backgroundColor: colors.accent, borderRadius: radius.xl, padding: 16, alignItems: "center" },
  primaryText: { color: colors.card || "#FFF", fontSize: 18, fontWeight: "900" },
  pendingCard: { marginTop: 16, backgroundColor: colors.card || "#333", borderRadius: radius.xl, padding: 16, alignItems: 'center' },
  pendingTitle: { color: "#FFF", fontSize: 20, fontWeight: "900", marginTop: 10 },
  pendingBody: { marginTop: 8, color: "#FFF", fontSize: 14, opacity: 0.9, textAlign: 'center' },
  simRow: { flexDirection: "row", marginTop: 14 },
  simApprove: { flex: 1, backgroundColor: colors.accent, borderRadius: 12, padding: 12, alignItems: "center", marginRight: 8 },
  simApproveText: { color: colors.card || "#333", fontWeight: "900" },
  simDeny: { flex: 1, borderWidth: 2, borderColor: colors.accent, borderRadius: 12, padding: 12, alignItems: "center", marginLeft: 8 },
  simDenyText: { color: colors.accent, fontWeight: "900" },
  status: { marginTop: 14, color: colors.textOnBackground || "#FFF", fontSize: 16, fontWeight: "700", textAlign: 'center' },
  secondary: { marginTop: 20, borderRadius: radius.xl, borderWidth: 2, borderColor: colors.card || "#333", padding: 14, alignItems: "center" },
  secondaryText: { color: colors.textOnBackground || "#FFF", fontWeight: "900" },
  riskButton: { marginTop: 12, backgroundColor: '#FFF', padding: 10, borderRadius: 8, alignItems: 'center' },
  debugPanel: { marginTop: 25, padding: 12, backgroundColor: '#1E1E1E', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.accent },
  debugTitle: { color: colors.accent, fontWeight: '900', fontSize: 12, marginBottom: 8 },
  debugCodeBox: { backgroundColor: '#000', padding: 10, borderRadius: 8 },
  debugText: { color: '#00FF00', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 11 },
  debugHint: { color: '#888', fontSize: 10, marginTop: 6, fontStyle: 'italic' },
});