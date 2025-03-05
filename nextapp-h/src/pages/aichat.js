import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
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
          { role: "bot", content: data.reply, isCode: data.isCode },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error: Failed to get AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const renderMessageContent = (content, isCode) => {
    if (isCode) {
      const codeContent = content.replace(/```/g, "");
      return (
        <div className="relative my-2">
          <SyntaxHighlighter language="javascript" style={dracula}>
            {codeContent.trim()}
          </SyntaxHighlighter>
          <button
            onClick={() => copyToClipboard(codeContent.trim())}
            className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded-md text-sm hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      );
    } else {
      const inlineCodeRegex = /`([^`]+)`/g;
      const parts = content.split(inlineCodeRegex);
      return parts.map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="bg-gray-700 text-white px-1 rounded-md">
            {part}
          </code>
        ) : (
          <span key={index}>{part}</span>
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white text-center">AI Chatbot</h2>
        <div className="h-96 overflow-y-auto bg-gray-700 p-4 mt-4 rounded-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-xs ${
                msg.role === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-600 text-white"
              }`}
            >
              {renderMessageContent(msg.content, msg.isCode)}
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
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-3 rounded-r-lg"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
