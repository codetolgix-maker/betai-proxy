const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        if (!apiKey || !prompt) {
            return res.status(400).json({ error: 'API anahtarı ve mesaj gereklidir.' });
        }

        // Yeni SDK yapısına uygun istemci oluşturma
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }] // Google Arama entegrasyonu
            }
        });

        res.json({ text: response.text });
    } catch (err) {
        console.error("API Hatası:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy ${PORT} portunda çalışıyor.`));
