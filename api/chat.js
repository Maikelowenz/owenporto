const { Groq } = require('groq-sdk');

// Inisialisasi Groq dengan API Key dari Environment Variable
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    // Header CORS agar bisa diakses browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Hanya metode POST yang diizinkan." });
    }

    try {
        const { messages } = req.body;
        
        // Memanggil API Groq dengan model llama-3.3-70b-versatile
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile", 
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = completion.choices[0].message.content;
        
        // Mengirimkan jawaban balik ke Frontend
        res.status(200).json({ reply: aiResponse });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ 
            reply: "Maaf, terjadi kesalahan di server: " + error.message 
        });
    }
}
