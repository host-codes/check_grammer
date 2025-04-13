const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/grammar", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Correct this grammar and explain every error in detail:\n\n"${text}"`,
          },
        ],
      }),
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "No response.";

    res.json({ result: message });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Grammar check failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
