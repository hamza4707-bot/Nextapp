import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.reply, isCode: data.reply.startsWith("```") && data.reply.endsWith("```") }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", content: "Error: Failed to get AI response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white text-center">AI Chatbot</h2>
        <div className="h-96 overflow-y-auto bg-gray-700 p-4 mt-4 rounded-md">
          {messages.map((msg, index) => (
            <div key={index} className={`p-3 my-2 rounded-lg max-w-xs ${msg.role === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-600 text-white"}`}>
              {msg.isCode ? (
                <div className="relative bg-gray-900 text-green-300 p-4 rounded-lg font-mono">
                  <button
                    className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white text-xs px-2 py-1 rounded"
                    onClick={() => navigator.clipboard.writeText(msg.content.replace(/```/g, ''))}
                  >
                    Copy
                  </button>
                  <pre>{msg.content.replace(/```/g, '')}</pre>
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}
          {loading && <div className="text-gray-400 text-center mt-2">AI is typing...</div>}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            className="w-full p-3 rounded-l-lg bg-gray-700 text-white outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-3 rounded-r-lg" disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}