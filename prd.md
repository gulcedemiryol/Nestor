1. Ürün Vizyonu (Product Vision)
Nestor, yaşlı bireylerin teknoloji kullanımını "çile" olmaktan çıkarıp "keyif" haline getiren, multimodal (ses, görüntü, dokunuş) bir yapay zeka asistanıdır. Karmaşık arayüzleri analiz ederek kullanıcı adına işlem yapar, finansal güvenliği sağlar ve dolandırıcılık girişimlerini proaktif olarak engeller.

2. Kullanıcı Deneyimi ve Arayüz (UX/UI)
2.1 Bento Grid Arayüzü
Kullanıcıyı boğmayan, hiyerarşik ve dokunması kolay bir yapı:
Büyük Kartlar: "Beni Ara" (Hızlı rehber), "İlaçlarım", "Asistanla Konuş".
Dinamik Durum: "Bugün hava 22°C, yürüyüş için harika!" gibi kişiselleştirilmiş mesajlar.
Görsel Standartlar: Kontrast oranı min 7:1, font boyutu min 18px, buton alanı min 64dp.
### 2.1.1 Görsel Stil (Premium Look)
* **Ana Arka Plan:** Krem Beyazı (`#F5F5DC` veya `#FFFDD0`) - Göz yormayan soft zemin.
* **Kartlar (Bento):** Koyu Lacivert (`#001529`) veya Antrasit.
* **Metin Renkleri:** Kart içinde Beyaz (`#FFFFFF`), Zemin üzerinde Koyu Gri (`#333333`).
* **Vurgu Rengi:** Altın Sarısı (`#FFD700`) - Önemli butonlar ve uyarılar için.
* **Köşe Yumuşatma:** `28px` (Modern ve güven veren kavisler).
2.2 Kullanıcı Akışı (User Flow)
Aktivasyon: Kullanıcı "Nestor, elektrik faturamı öder misin?" der veya ilgili karta dokunur.
Multimodal Analiz: Gemini 1.5 Pro, mevcut ekran görüntüsünü (Screenshot) veya sesli komutu işler.
Yürütme: AI, faturayı bulur, tutarı okur ve kullanıcıdan onay ister.
Güvenlik Kontrolü: Tutar > 500 TL ise Vasi Onay Süreci tetiklenir.

3. Teknik Mimari (Technical Stack)
Katman
Teknoloji
Açıklama
Frontend
React Native
iOS/Android erişilebilirlik (A11y) servisleri ile tam entegrasyon.
LLM Engine
Gemini 1.5 Pro API
Gelişmiş Vision ve Function Calling yetenekleri.
Backend
NestJS (Node.js)
Mikroservis mimarisi, yüksek güvenilirlik.
Database
PostgreSQL
Kullanıcı profilleri, işlem geçmişi ve vasi eşleşmeleri.
Real-time
Socket.io / FCM
Vasiye anlık onay ve dolandırıcılık bildirimleri.


4. Temel Özellikler (Core Features)
4.1 Ekran Analizi (Screen Insight)
Gereksinim: Kullanıcı bir uygulamada takıldığında Nestor ekranı "okur".
İşlev: "Baba, sağ üstteki sarı butona basman yeterli" veya "Senin için ödemeyi başlattım" şeklinde rehberlik eder.
4.2 Akıllı Finansal Bariyer (500 TL Kuralı)
Mantık: İşlem bedeli $T$ olmak üzere; $T \ge 500 \text{ TL}$ ise işlem askıya alınır.
Vasi Onayı: Vasiye işlemin detayı ve ekran görüntüsü push bildirimle gider. Onay gelmeden API tetiklenmez.
4.3 Anti-Dolandırıcılık Kalkanı (Guardian Shield) 🛡️
Ses Analizi: Görüşme sırasında "savcı", "polis", "şifre", "hesap bloke" gibi kelimeler ve yüksek stresli tonlama algılanırsa müdahale edilir.
Görsel Analiz: Sahte banka veya phishing siteleri Gemini Vision ile "Güvenilir Değil" olarak işaretlenir.
Müdahale: Ekran kırmızıya döner, büyük bir uyarı çıkar ve vasi otomatik olarak aranır.

5. Güvenlik ve Gizlilik (Security & Privacy)
5.1 Veri Koruma
Hassas Veri Maskeleme: Kredi kartı ve şifre gibi alanlar AI'ya gönderilmeden önce yerel cihazda (On-device) maskelenir.
Biyometrik Kilitleme: Vasi onayı gerektiren işlemlerde ekstra güvenlik için kullanıcının yüzü veya parmak izi taranır.
5.2 Risk Skorlama Logiği
Nestor, her etkileşimi şu formüle göre puanlar:
$$R = (C \times 0.4) + (U \times 0.3) + (S \times 0.3)$$
$R$: Risk Skoru
$C$: Kritik Kelimeler (Context)
$U$: Aciliyet Hissi (Urgency)
$S$: Bilinmeyen Kaynak (Source)
Not: $R > 0.70$ ise iletişim derhal kesilir ve vasiye raporlanır.

6. Kabul Kriterleri (Acceptance Criteria)
Sistem, dolandırıcılık simülasyonlarının %95'ini başarıyla tespit etmeli.
Bento Grid arayüzünde navigasyon hızı ortalama bir kullanıcı için < 2 saniye olmalı.
Vasi onay isteği, vasi telefonuna maksimum 3 saniye içinde ulaşmalı.
