export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, steps, guidanceScale, width, height } = req.body;
  
  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing. Set it in .env.local" });
  }

  try {
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer sk-ALSuXDNUbhmcWTjnKFf4BuOgPRmkKWCrfYOK7uqS62CXclRl`,
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image");
    }

    const data = await response.json();
    res.status(200).json({ imageUrl: data.image_url }); // Ensure correct API response field
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}