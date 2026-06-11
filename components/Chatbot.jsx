import { useState, useRef, useEffect } from "react";
import { callGemini, FeatureHeader } from "../src/gemini";

const SUGGESTIONS = [
  "How do I write a professional out-of-office email?",
  "Give me tips to run more effective meetings",
  "How can I prioritize tasks when everything feels urgent?",
  "What's the best way to give feedback to a colleague?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "👋 Hi! I'm your AI workplace assistant.\n\nI can help with professional communication, productivity, business advice, and workplace challenges.\n\nWhat can I help you with today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.slice(-8).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`).join("\n\n");
      const prompt = `You are WorkAI, a professional workplace productivity assistant. Help with business communication, productivity, workplace relationships, and career advice. Be concise (under 200 words unless needed). Use bullet points for lists.

Conversation:
${history}

User: ${userMsg}
WorkAI:`;
      const reply = await callGemini(prompt);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Error connecting to AI. Please check your API key." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const clearChat = () => setMessages([{ role: "assistant", text: "Chat cleared! How can I help you?" }]);

  return (
    <div className="feature chatbot-feature">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <FeatureHeader icon="💬" title="AI Chatbot Assistant" description="Ask anything about work, productivity, communication, or business topics." />
        <button className="clear-btn" onClick={clearChat}>Clear Chat</button>
      </div>
      {messages.length <= 1 && (
        <div className="suggestions">
          <p className="suggestions-label">Try asking:</p>
          <div className="suggestions-grid">
            {SUGGESTIONS.map((s) => (<button key={s} className="suggestion-chip" onClick={() => send(s)}>{s}</button>))}
          </div>
        </div>
      )}
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="chat-avatar">{m.role === "assistant" ? "🤖" : "👤"}</div>
            <div className="chat-bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg assistant">
            <div className="chat-avatar">🤖</div>
            <div className="chat-bubble typing"><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <p className="disclaimer" style={{ marginBottom: 10 }}>⚠️ AI-generated content may require human review before use.</p>
      <div className="chat-input-row">
        <textarea className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type your message… (Enter to send)" rows={2} />
        <button className="chat-send-btn" onClick={() => send()} disabled={loading || !input.trim()}>Send ➤</button>
      </div>
    </div>
  );
}