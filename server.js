const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: "API anahtarı eksik." });

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Google Search Grounding destekli çağrı
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Sen profesyonel bir bahis ve spor yapay zeka mentorüsün (BetAI Mentor). Kullanıcının sorularını yanıtlerken güncel maç sonuçlarını, fikstürleri ve spor dünyasındaki gelişmeleri Google Search kullanarak doğrula ve net, güncel bilgiler ver."
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda ayakta.`));