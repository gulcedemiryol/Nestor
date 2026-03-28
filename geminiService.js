import Constants from "expo-constants";

// .env dosyana EXPO_PUBLIC_GROQ_API_KEY olarak eklemeyi unutma!
const GROQ_API_KEY = 
  process.env.EXPO_PUBLIC_GROQ_API_KEY || 
  Constants.expoConfig?.extra?.groqApiKey;

export const analyzeScreen = async (params) => {
  const { prompt, targetHint } = params || {};

  // Anahtar kontrolü
  if (!GROQ_API_KEY) {
    console.error("❌ HATA: GROQ_API_KEY TANIMLI DEĞİL!");
    throw new Error("API Anahtarı bulunamadı. Lütfen .env dosyasını kontrol edin.");
  }

  // Groq API URL (OpenAI uyumlu olduğu için çok daha stabildir)
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const systemPrompt = `Sen Nestor'sun. Yaşlılara yardım eden bilge bir asistansın. 
    Lütfen bir torun şefkatiyle Türkçe cevap ver.
    MUTLAKA şu formatı kullan:
    Mesaj: <cevabın>
    Adımlar:
    - <adım 1>`;

  const userText = `İstek: ${prompt || "Ekranda ne yapmalıyım?"}\nBağlam: ${targetHint || "Genel"}`;

  const body = {
    model: "llama-3.3-70b-versatile", // Groq'un en güçlü ve hızlı modellerinden biri
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userText }
    ],
    temperature: 0.7
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(body),
      mode: 'cors' 
    });

    const json = await response.json();

    if (!response.ok) {
      console.log("Groq API Detaylı Hata:", json); 
      throw new Error(json.error?.message || "Groq API Hatası");
    }

    const resultText = json.choices?.[0]?.message?.content || "";
    
    // Yanıtı parçalama (Mesaj ve Adımlar)
    const messagePart = resultText.match(/Mesaj:\s*(.*)/i)?.[1] || resultText.split('\n')[0];
    const stepsPart = resultText.split('\n').filter(line => line.trim().startsWith('-'));

    return {
      message: messagePart.replace(/Mesaj:/i, "").trim() || "Efendim, size nasıl yardımcı olabilirim?",
      guidanceSteps: stepsPart.length > 0 ? stepsPart : ["Sizi dinliyorum."]
    };
  } catch (error) {
    console.error("Nestor Servis Hatası:", error.message);
    throw error;
  }
};