const appJson = require("./app.json");
const dotenv = require("dotenv");
const path = require("path");

// Proje kök dizinindeki `.env` dosyasını okuyalım.
// __dirname: .../apps/mobile
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const geminiApiKey = process.env.GEMINI_API_KEY || "";

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra ?? {}),
      geminiApiKey,
    },
  },
};

