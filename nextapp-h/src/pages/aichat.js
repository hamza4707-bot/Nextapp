import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    if (data.reply) {
      setMessages([...messages, userMessage, { role: "bot", content: data.reply }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white text-center">DeepSeek AI Chatbot</h2>
        <div className="h-96 overflow-y-auto bg-gray-700 p-4 mt-4 rounded-md">
          {messages.map((msg, index) => (
            <div key={index} className={`p-3 my-2 rounded-lg max-w-xs ${msg.role === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-600 text-white"}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            className="w-full p-3 rounded-l-lg bg-gray-700 text-white outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-3 rounded-r-lg">Send</button>
        </div>
      </div>
    </div>
  );
}