import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

console.log("GROQ_API_KEY in chatRoutes =", process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Bạn là chatbot tư vấn món ăn KFC" },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("❌ Groq error:", err);
    res.status(500).json({ error: "Groq error" });
  }
});

export default router;
