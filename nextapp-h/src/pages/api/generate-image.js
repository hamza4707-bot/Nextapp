// pages/api/generate-image.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, steps, guidanceScale, width, height } = req.body;
  const apiKey = sk-ALSuXDNUbhmcWTjnKFf4BuOgPRmkKWCrfYOK7uqS62CXclRl; // Store in .env.local

  try {
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        steps: steps || 30,
        width: width || 512,
        height: height || 512,
        guidance_scale: guidanceScale || 7.5,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    res.status(200).json({ imageUrl: data.image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}