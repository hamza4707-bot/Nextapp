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
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, steps, guidanceScale, width, height }),
      });

      const data = await response.json();
      if (response.ok && data.image_url) {
        setImageUrl(data.image_url);
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
        <label className="block mb-2 text-sm font-semibold">Prompt:</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          placeholder="Enter your image description..."
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold">Steps:</label>
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Guidance Scale:</label>
            <input
              type="number"
              step="0.1"
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-2 text-sm font-semibold">Width:</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Height:</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
          </div>
        </div>

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