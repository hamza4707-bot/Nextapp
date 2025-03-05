export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, steps, guidanceScale, width, height } = req.body;
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing. Set it in .env.local" });
  }

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("steps", steps.toString());
    formData.append("guidance_scale", guidanceScale.toString());
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    formData.append("accept", "application/json");

    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image");
    }

    const data = await response.json();
    if (data.artifacts && data.artifacts.length > 0) {
      const base64Image = data.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      res.status(200).json({ imageUrl });
    } else {
      res.status(500).json({ error: "No image artifacts received from API" });
    }
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
