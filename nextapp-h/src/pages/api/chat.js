import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post("https://api.deepseek.com/chat", {
      model: "deepseek-chat",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.data?.choices?.[0]?.message?.content || "No response from AI.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
}