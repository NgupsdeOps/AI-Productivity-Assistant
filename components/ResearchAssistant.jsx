import { useState } from "react";
import { callGemini, FeatureHeader, Select, Textarea, RunButton, OutputBox } from "../src/gemini";

export default function ResearchAssistant() {
  const [form, setForm] = useState({ topic: "", depth: "detailed overview", audience: "business professional", purpose: "general knowledge" });
  const [output, setOutput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const run = async () => {
    if (!form.topic.trim()) return setError("Please enter a topic or question.");
    setLoading(true); setError(""); setOutput("");
    try {
      const prompt = `You are a senior research analyst. Provide a ${form.depth} on the topic below for a ${form.audience}. Purpose: ${form.purpose}.

TOPIC: ${form.topic}

Use EXACTLY these sections:
📌 EXECUTIVE SUMMARY
🔍 KEY CONCEPTS & BACKGROUND
💡 MAIN INSIGHTS & FINDINGS (6-8 bullets)
📊 DATA & EVIDENCE
⚠️ CHALLENGES & CONSIDERATIONS
✅ PRACTICAL RECOMMENDATIONS (5 actionable steps)
🎯 KEY TAKEAWAYS (5 bullets)
📚 FURTHER READING`;
      setOutput(await callGemini(prompt));
    } catch { setError("API call failed. Check your Gemini API key in the .env file."); }
    setLoading(false);
  };

  return (
    <div className="feature">
      <FeatureHeader icon="🔍" title="AI Research Assistant" description="Get structured insights and recommendations on any topic instantly." />
      <div className="form-grid">
        <Select label="Depth" name="depth" value={form.depth} onChange={set} options={[
          { value: "brief summary", label: "Brief Summary" }, { value: "detailed overview", label: "Detailed Overview" },
          { value: "in-depth analysis", label: "In-Depth Analysis" }, { value: "comprehensive report", label: "Full Report" }]} />
        <Select label="Audience" name="audience" value={form.audience} onChange={set} options={[
          { value: "general", label: "General" }, { value: "business professional", label: "Business Professional" },
          { value: "executive", label: "Executive" }, { value: "technical team", label: "Technical Team" },
          { value: "student", label: "Student" }]} />
        <Select label="Purpose" name="purpose" value={form.purpose} onChange={set} options={[
          { value: "general knowledge", label: "General Knowledge" }, { value: "business decision", label: "Business Decision" },
          { value: "academic study", label: "Academic Study" }, { value: "presentation prep", label: "Presentation Prep" },
          { value: "strategic planning", label: "Strategic Planning" }]} />
      </div>
      <Textarea label="Topic or Question" name="topic" value={form.topic} onChange={set}
        placeholder="e.g. What are the key benefits and challenges of adopting AI tools in small businesses in South Africa?" rows={4} />
      <RunButton onClick={run} loading={loading} label="Research This 🔍" />
      <OutputBox output={output} loading={loading} error={error} />
    </div>
  );
}