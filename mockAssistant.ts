import { detectIntent, AssistIntent } from "./intent";

export type AssistAction =
  | { type: "SHOW_GUIDANCE"; payload?: Record<string, unknown> }
  | { type: "CALL_FAMILY"; payload?: Record<string, unknown> }
  | { type: "OPEN_DRUGS"; payload?: Record<string, unknown> }
  | { type: "FIND_BILLS"; payload?: Record<string, unknown> };

export type AssistResponse = {
  message: string;
  intent: AssistIntent;
  actions: AssistAction[];
  authorizationRequired: boolean;
};

export function runAssistantMock(utterance: string): AssistResponse {
  const intent = detectIntent(utterance);

  switch (intent) {
    case "call_family":
      return {
        message: "Tamam! Aileyi aramak için hazırlıyorum. Kiminle konuşalım?",
        intent,
        actions: [{ type: "CALL_FAMILY" }],
        authorizationRequired: false,
      };
    case "open_drugs":
      return {
        message: "İlaç hatırlatmasını başlatıyorum. Hangi ilaç saatini istersin?",
        intent,
        actions: [{ type: "OPEN_DRUGS" }],
        authorizationRequired: false,
      };
    case "find_bills":
      return {
        message:
          "Fatura bulma kısmı MVP’de simülasyon. İstersen tutarı söyle, sonra onay sürecine geçeriz.",
        intent,
        actions: [{ type: "FIND_BILLS" }],
        authorizationRequired: false,
      };
    case "chat_help":
      return {
        message: "Elbette. Ne yapmamı istersin? (ör. 'elektrik faturamı öde', 'ilaçlarım', 'beni ara')",
        intent,
        actions: [{ type: "SHOW_GUIDANCE" }],
        authorizationRequired: false,
      };
    case "unknown":
    default:
      return {
        message:
          "Bu mesajı tam anlayamadım. İstersen daha net söyle: 'beni ara' veya 'ilaçlarım'.",
        intent: "unknown",
        actions: [{ type: "SHOW_GUIDANCE" }],
        authorizationRequired: false,
      };
  }
}

