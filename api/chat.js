const { Groq } = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { messages } = req.body;
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama3-8b-8192",
        });

        res.status(200).json({ reply: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
