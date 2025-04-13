const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(express.json());
app.use(express.static("public"));

// API Route
app.post("/api/grammar", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No input provided" });

  try {
    const prompt = `
Check the following sentence for grammatical errors. Explain each error in detail and provide the corrected sentence.

Text: """${text}"""
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ result: reply });

  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "OpenAI request failed." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
