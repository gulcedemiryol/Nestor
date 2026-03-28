# Nestor

Yaşlı bireyler için güvenli, multimodal bir asistan.

## Başlamadan Önce
- Node.js (LTS) ve `npm` kurulu olmalı.
- Gemini için proje kökünde `.env` içinde `GEMINI_API_KEY=...` tanımlayın.
- Mobil: `npm run dev` (Expo).

## Dokümantasyon
- Ürün PRD: `prd.md`
- Görevler: `tasks.md`
- API contract taslak: `api/contracts/nestor-api.yaml`
- LLM/Vision hedefleri (taslak): `docs/llm-vision-goals.md`
- Ortak domain modelleri: `shared/domain/*`

## Finansal bariyer (MVP)
Ana ekranda **Fatura / ödeme dene** ile açılır. **500 TL ve üzeri** tutarlarda ödeme askıya alınır; vasiyi simüle eden onay/ret düğmeleriyle akış tamamlanır (`apps/mobile/services/transactionGate.ts`).

