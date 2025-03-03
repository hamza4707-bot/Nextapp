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
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer tgp_v1_RsA3WkYGAIInYlTS_OmZorHPQ-HXNzu7j_PBeZTqLl0`, // Replace with your API key
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || "No response from AI.";

    // Detect if response contains code (by checking if it starts and ends with triple backticks)
    const isCode = reply.startsWith("```") && reply.endsWith("```");

    res.status(200).json({ reply, isCode });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
}