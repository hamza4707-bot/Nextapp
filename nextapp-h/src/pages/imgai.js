import { useState } from "react";

export default function Imgsi() {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("steps", steps.toString());
      formData.append("guidance_scale", guidanceScale.toString());
      formData.append("width", width.toString());
      formData.append("height", height.toString());

      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: formData, // Send FormData directly
      });

      const data = await response.json();
      if (response.ok && data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || "Failed to generate image");
      }
    } catch (err) {
      setError("Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* ... (input fields remain the same) ... */}

        <button
          onClick={generateImage}
          disabled={loading}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Generated Image:</h2>
          <img src={imageUrl} alt="Generated AI" className="mt-4 rounded shadow-lg max-w-full" />
        </div>
      )}
    </div>
  );
}
