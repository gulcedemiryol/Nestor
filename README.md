# Nestor

Nestor: Yaşlılar İçin Bilge ve Güvenli Asistan
Nestor, teknolojiden çekinen veya dijital dünyada kendini güvensiz hisseden yaşlı bireyler ile teknoloji arasında güvenli, sade ve "bilge" bir köprü kurmak amacıyla geliştirilmiş multimodal bir asistandır.

 Projenin Vizyonu
Hazırlık sınıfı öğrencisi olarak geliştirdiğim bu projede temel odak noktam; sadece bir yapay zeka botu yapmak değil, yaşlı kullanıcıların "dijital dolandırıcılık" korkusunu yenmelerini sağlayacak, onlara bir "Aziz Dost" gibi hitap eden, bilişsel yükü azaltılmış bir deneyim sunmaktır.

 Teknik Özellikler & Güvenlik Bariyeri
Proje, sadece bir arayüzden ibaret olmayıp arka planda çalışan kritik kontrol mekanizmalarına sahiptir:

 Financial Barrier (MVP): Yaşlı bireyleri korumak adına 500 TL ve üzeri işlemlerde ödeme akışını otomatik olarak askıya alır. Bu süreçte vasi onayını simüle eden bir transactionGate.ts kontrolü çalışır.

 Multimodal Etkileşim: Sesli komut ve metin tabanlı hibrit bir yapı hedeflenmiştir.

 Risk Engine: Şüpheli işlemleri ve niyetleri analiz eden bir mantık katmanı (riskEngine.ts) içerir.

 Dosya Yapısı ve Dokümantasyon
Jüri değerlendirmesi için projenin tüm planlama aşamaları dökümante edilmiştir:

 idea.md: Projenin çıkış noktası ve çözüm sunduğu problemler.
 prd.md: Ürün gereksinimleri ve teknik detaylar.
 tasks.md: Geliştirme süreci ve tamamlanan görevler.
 user-flow.md: Kullanıcı deneyimi adımları.
 tech-stack.md: Kullanılan teknolojiler (React Native, Expo, Gemini/Groq).

 Kurulum ve Çalıştırma
Projeyi yerel ortamınızda test etmek için:

Bağımlılıklar: Node.js (LTS) kurulu olduğundan emin olun.

API Anahtarı: Kök dizinde bir .env dosyası oluşturun ve GROQ_API_KEY=... tanımını yapın.
 
 Neden Groq? (Teknik Altyapı)
Nestor'un cevap verme hızı, yaşlı kullanıcıların beklerken kopmamasını sağlamak için Groq'un düşük gecikmeli (low-latency) LPU™ teknolojisi üzerine kurulmuştur. Bu sayede etkileşim, gerçek bir insanla konuşuyormuşçasına akıcıdır.

Başlatma:
Bash
npm install
npm run dev
 
 Tasarım Notu (UX)
Uygulama tasarımı, hedef kitle olan 65+ bireylerin ihtiyaçları doğrultusunda bilinçli olarak "Minimalist ve Erişilebilir" tutulmuştur. Büyük butonlar, yüksek kontrastlı renkler ve net metinler önceliklendirilmiştir.

"Teknoloji herkes içindir, yeter ki onlara doğru dille anlatılsın."
