/**
 * Finansal bariyer (PRD: 500 TL ve üzeri vasi onayı).
 * Backend yok; MVP için cihaz içi bellek + simüle vasi kararı.
 */

export const VASI_APPROVAL_LIMIT_TRY = 500;

export type VasiApprovalStatus = "PENDING" | "APPROVED" | "DENIED";

export type LocalAuthorizationRequest = {
  id: string;
  transactionId: string;
  amountTry: number;
  status: VasiApprovalStatus;
  createdAt: string;
  /** Maskelemiş özet (hassas veri yok) */
  maskedSummary: string;
};

let pending: LocalAuthorizationRequest | null = null;

export function requiresVasiApproval(amountTry: number): boolean {
  if (Number.isNaN(amountTry) || amountTry < 0) return false;
  return amountTry >= VASI_APPROVAL_LIMIT_TRY;
}

/**
 * Ödeme isteğini değerlendirir.
 * - 500 TL altı: doğrudan tamamlanmış sayılır (execute simülasyonu).
 * - 500 TL ve üzeri: PENDING; gerçek API/ödeme tetiklenmez.
 */
export function requestPayment(amountTry: number): {
  executedImmediately: boolean;
  authorization?: LocalAuthorizationRequest;
  userMessage: string;
} {
  if (Number.isNaN(amountTry) || amountTry < 0) {
    throw new Error("Lütfen geçerli bir tutar gir.");
  }

  if (pending?.status === "PENDING") {
    throw new Error("Zaten bekleyen bir onay var. Önce sonucunu bekleyelim.");
  }
  // Önceki reddedilmiş / onaylanmış kayıt varsa yeni deneme için temizle.
  if (pending) {
    pending = null;
  }

  if (!requiresVasiApproval(amountTry)) {
    return {
      executedImmediately: true,
      userMessage: "İşlem tamam. Bu tutar için ek onay gerekmiyor.",
    };
  }

  const auth: LocalAuthorizationRequest = {
    id: `auth_${Date.now()}`,
    transactionId: `tx_${Date.now()}`,
    amountTry,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    maskedSummary: `Ödeme tutarı: ${Math.floor(amountTry)} TL üzeri — detay vasiye gönderildi (kart bilgisi burada tutulmaz).`,
  };
  pending = auth;

  return {
    executedImmediately: false,
    authorization: auth,
    userMessage:
      "Bu tutar için önce yakınınızın onayı gerekiyor. Onay gelene kadar ödeme başlamaz.",
  };
}

export function getPendingAuthorization(): LocalAuthorizationRequest | null {
  return pending;
}

/** Simüle: vasi uygulamasından onay */
export function simulateCaregiverApprove(): LocalAuthorizationRequest | null {
  if (!pending || pending.status !== "PENDING") return null;
  pending = { ...pending, status: "APPROVED" };
  return pending;
}

/** Simüle: vasi reddi */
export function simulateCaregiverDeny(): LocalAuthorizationRequest | null {
  if (!pending || pending.status !== "PENDING") return null;
  pending = { ...pending, status: "DENIED" };
  return pending;
}

/** Onaylandıktan sonra ödeme adımını simüle et (tek seferlik) */
export function executeAfterApprovalIfAllowed(): boolean {
  if (!pending || pending.status !== "APPROVED") return false;
  pending = null;
  return true;
}

export function clearPendingForDemo(): void {
  pending = null;
}
