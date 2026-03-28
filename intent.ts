export type AssistIntent = "chat_help" | "call_family" | "open_drugs" | "find_bills" | "unknown";

function stripTurkishChars(input: string) {
  // Turkish specific letters -> latin equivalents for easier matching.
  // Example: "ilaçlarım" => "ilaclarim"
  return input
    .toLowerCase()
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .replaceAll("İ", "i");
}

export function detectIntent(utterance: string): AssistIntent {
  const u = stripTurkishChars(utterance);

  // Phone / family calls
  if (/\b(ara|telefon|arayalim|beni ara|cagir|cagirayim)\b/.test(u) || u.includes("beni ara")) {
    return "call_family";
  }

  // Drug reminders
  if (u.includes("ilac") || u.includes("ilaclar") || u.includes("hap") || u.includes("ilaclarim")) {
    return "open_drugs";
  }

  // Bills
  if (u.includes("fatura") || u.includes("elektrik") || u.includes("su") || u.includes("dogalgaz") || u.includes("dogal gaz")) {
    return "find_bills";
  }

  // General help (fallback)
  if (u.trim().length > 0) return "chat_help";

  return "unknown";
}

