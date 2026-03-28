# Nestor Uygulama Görev Listesi (Adım Adım)

> Kaynak: `prd.md`

## 0) Proje Hazırlığı
- [ ] Hedef platform(lar)ı netleştir (iOS/Android) ve geliştirme ortamını kur.
- [ ] Repository/paketleme stratejisini belirle (monorepo vs ayrı frontend/backend).
- [ ] Ürün için temel veri modellerini tasarla:
  - [x] `User` (kullanıcı profili)
  - [x] `Caregiver/Vasi` (vasi profili)
  - [x] `AuthorizationRequest` (onay isteği)
  - [x] `Transaction` (finansal işlem)
  - [x] `RiskEvent` (guardian shield yakalamaları)
- [x] API contract taslağı çıkar (endpoint’ler, istek/yanıt şemaları).
- [x] LLM/vision maliyet ve hız hedeflerini belirle (en kritik akışlar için bütçe).

## 1) MVP: Uygulama iskeleti + Bento UI Prototipi
- [x] React Native projesi iskeletini kur (navigasyon, temel ekran yapısı).
- [x] Bento Grid arayüzünü uygula:
  - [x] Kartlar: `Beni Ara`, `İlaçlarım`, `Asistanla Konuş`
  - [x] Kontrast/typography kuralları (örn. min 18px, kart köşeleri 28px).
  - [x] Kart dokunma alanı min 64dp.
- [x] “Dinamik durum mesajı” için UI komponenti hazırla.
- [ ] Erişilebilirlik (A11y) temel testleri: ekran okuyucu etiketleri, odak sırası, renk kontrastı.
- [x] MVP kabul testi: kartlar arası navigasyon ve etkileşimler kullanıcı için akıcı (<2 sn algılanan gecikme).

## 2) MVP: Asistan Konuşma + Komut Akışı (Text->Intent)
- [x] Asistan konuşma ekranı ekle (mikrofon entegrasyonu için hazırlık).
- [x] LLM engine entegrasyonu için “intent” katmanı tasarla:
  - [x] Kullanıcı komutunu niyete çevir (ör. `call_family`, `find_bills`, `open_drugs`, `chat_help`).
  - [x] Niyet -> uygulama aksiyonu eşleme (routing).
- [x] En az 3 senaryoyu uçtan uca çalıştır:
  - [x] “Asistanla konuş” (genel yardım)
  - [x] “Beni Ara” (telefon araması başlatma simülasyonu)
  - [x] “İlaçlarım” (basit hatırlatma akışı mock)
- [ ] Sunucu tarafında temel endpoint’leri kur (ör. `POST /assist`).

## 3) Ekran Analizi (Screen Insight) – Görsel Yükleme + Rehberlik
- [x] Ekran görüntüsü alma akışını uygulama (kısıt varsa: kullanıcıdan görsel yükleme / screenshot önerisi).
- [x] Gemini Vision ile görseli analiz eden backend akışını yaz:
  - [x] Vision çıktısını “adım adım rehber” formatına çevir.
  - [x] Kullanıcıya Türkçe, net ve kısa talimat göster.
- [x] UI’da “rehber kartı” tasarla (örn. büyük metin + aksiyon butonu).
- [ ] MVP kabul testi: “sağ üstteki sarı butona basman yeterli” benzeri komutlar doğrulukla üretiliyor (iç test senaryoları).

## 4) Finansal Bariyer MVP: 500 TL Kuralı + Onay Akışı
- [x] İşlem türleri için “risk/limit kuralları” modülü oluştur:
  - [x] Tutar `>= 500 TL` ise işlemi askıya al.
  - [x] `AuthorizationRequest` oluştur ve onay gelmeden gerçek API çağrısını engelle.
- [x] Vasi onayını tetikleyen backend akışını uygula:
  - [x] İstek detayı: işlem türü, tutar, zaman, ilgili ekran görüntüsü (maskelenmiş).
  - [x] Onay gelmeden “execute” adımını kilitle.
- [x] UI’da kullanıcıya “Onay bekleniyor” durumu göster.
- [x] MVP kabul testi: onay süreci kullanıcı gözünde net, askıya alınan işlemler gerçekleşmiyor.

## 5) Guardian Shield (Anti-Dolandırıcılık) – Risk Tespiti + Müdahale
- [x] Risk kelime/tonlama tabanlı ses analiz akışı için ilk sürümü kur:
  - [x] “savcı, polis, şifre, hesap bloke” gibi kelimeleri yakala (threshold’lar dahil).
- [x] Görsel analiz akışını kur (phishing/banka sahteciliği tespiti için işaretleme):
  - [x] Vision çıktısını “Güvenilir Değil” kararına bağla.
- [x] Müdahale UI davranışlarını uygula:
  - [x] ekran kırmızıya döner
  - [x] büyük uyarı çıkar
  - [x] vasi otomatik olarak aranır (ya da onay/çağrı akışı tetiklenir; PRD’de “otomatik vasi aranır”)
- [x] Risk skorlama mantığını uygula:
  - [x] `R = (C * 0.4) + (U * 0.3) + (S * 0.3)`
  - [x] `R > 0.70` ise iletişimi kes ve vasiye raporla.
- [x] Kabul kriteri için ölçüm altyapısı:
  - [x] dolandırıcılık simülasyon seti oluştur
  - [x] tespit başarısını ölç.

## 6) Güvenlik & Gizlilik (Maskeleme + Ek Kilit)
- [x] Hassas veri maskeleme (on-device) uygula:
  - [x] kredi kartı / şifre gibi alanlar AI’ye gönderilmeden maskelenir.
  - [x] maskeleme doğruluğu için test senaryoları.
- [x] Vasi onayı gerektiren işlemlerde biyometrik kilitleme entegre et:
  - [x] yüz/parmak izi ile ek doğrulama.
- [x] Veri saklama politikası netleştir ve uygulaya koy:
  - [x] işlem geçmişi, onay logları, risk event’ler için süre/şifreleme.

## 7) Vasi Eşleşmesi + Realtime Bildirimler (Socket.io / FCM)
- [x] Vasi eşleşme sürecini tasarla ve uygula:
  - [x] kullanıcı -> vasi ilişkilendirme
  - [x] vasi uygulamasında onay ekranı
- [x] Real-time bildirimleri kur:
  - [x] onay isteği vasi telefonuna push edilir (FCM)
  - [x] vasi aksiyonları (approve/deny) backend’e iletilir
- [x] Kabul testi: vasiye maksimum 3 saniyede ulaşma.
- [x] Onay durumlarının tutarlılığı (race condition) için testler.

## 8) Model Entegrasyonu İyileştirmeleri (Kalite, Hız, Maliyet)
- [ ] Gemini 1.5 Pro için:
  - [ ] prompt/format şemalarını sabitle
  - [ ] function calling ile kontrollü aksiyon üret
  - [ ] gerekmediği yerde vision çağrılarını azalt
- [ ] Fallback stratejileri:
  - [ ] vision başarısızsa kullanıcıya “ekrar görüntüsü/alan seç” yönlendirmesi
  - [ ] LLM belirsizse güvenli davranış (askıya al / ek soru sor)

## 9) Test, Ölçüm ve Kabul Kriterleri
- [ ] Otomatik testler:
  - [ ] UI smoke testleri
  - [ ] backend contract testleri
  - [ ] risk skor/limit kuralı birim testleri
- [ ] Simülasyon tabanlı güvenlik testleri:
  - [ ] dolandırıcılık %95 tespit hedefi için dataset & değerlendirme
- [ ] Performans ölçümü:
  - [ ] Bento navigasyon “hissettirilen” hız < 2 sn
  - [ ] onay isteği latency ölçümü (<3 sn)

## 10) Yayın ve Operasyon
- [ ] Logging/monitoring ekle (risk event, onay latency, model çağrı süreleri).
- [ ] Feature flag ile risk/limit parametrelerini kontrollü ayarlama.
- [ ] Hata raporlama (crash + non-fatal) entegre et.
- [ ] Yayın öncesi checklist: erişilebilirlik, güvenlik regresyonu, limit kuralı.

