const { Groq } = require('groq-sdk');

// Inisialisasi Groq menggunakan API Key dari Environment Variable Vercel
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    // Pengaturan CORS agar Frontend bisa mengakses API ini
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Menangani preflight request dari browser
    if (req.method === 'OPTIONS') return res.status(200).end();

    // Memastikan hanya metode POST yang diizinkan
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Hanya metode POST yang diizinkan." });
    }

    try {
        const { messages } = req.body;
        
        // Memanggil API Groq
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama3-8b-8192", // Model cepat dan efisien
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;
        
        // Mengirimkan jawaban balik ke Frontend dengan kunci 'reply'
        res.status(200).json({ reply: aiResponse });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Maaf, terjadi kesalahan di server: " + error.message });
    }
}
