import { useState } from "react";
import EmailGenerator from "../components/EmailGenerator";
import MeetingSummarizer from "../components/MeetingSummarizer";
import TaskPlanner from "../components/TaskPlanner";
import ResearchAssistant from "../components/ResearchAssistant";
import Chatbot from "../components/Chatbot";
import "./index.css";

const NAV = [
  { id: "email",    icon: "✉️",  label: "Email Generator" },
  { id: "meeting",  icon: "📝",  label: "Meeting Summarizer" },
  { id: "task",     icon: "📋",  label: "Task Planner" },
  { id: "research", icon: "🔍",  label: "Research Assistant" },
  { id: "chat",     icon: "💬",  label: "AI Chatbot" },
];

export default function App() {
  const [active, setActive] = useState("email");
  const components = {
    email: <EmailGenerator />,
    meeting: <MeetingSummarizer />,
    task: <TaskPlanner />,
    research: <ResearchAssistant />,
    chat: <Chatbot />,
  };
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">🤖</div>
          <div>
            <div className="brand-name">WorkAI</div>
            <div className="brand-sub">Productivity Assistant</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <button key={n.id} className={`nav-item ${active === n.id ? "active" : ""}`} onClick={() => setActive(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-footer-text">CAPACITI AI Skills Project</div>
        </div>
      </aside>
      <main className="content">
        <div className="content-inner">{components[active]}</div>
      </main>
    </div>
  );
}