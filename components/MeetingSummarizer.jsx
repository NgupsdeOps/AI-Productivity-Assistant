import { useState } from "react";
import { callGemini, FeatureHeader, Select, Textarea, RunButton, OutputBox } from "../src/gemini";

export default function MeetingSummarizer() {
  const [form, setForm] = useState({ notes: "", format: "structured", meetingType: "team" });
  const [output, setOutput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const run = async () => {
    if (!form.notes.trim()) return setError("Please paste your meeting notes.");
    setLoading(true); setError(""); setOutput("");
    try {
      const prompt = `You are an expert meeting facilitator. Summarize these ${form.meetingType} meeting notes in ${form.format} format.

MEETING NOTES:
${form.notes}

Use EXACTLY these sections:
📌 MEETING OVERVIEW
✅ KEY DECISIONS MADE
📋 ACTION ITEMS (format: • [Owner] — [Task] — Due: [date or TBD])
⏰ IMPORTANT DEADLINES
🔄 FOLLOW-UP REQUIRED
💡 KEY TAKEAWAYS`;
      setOutput(await callGemini(prompt));
    } catch { setError("API call failed. Check your Gemini API key in the .env file."); }
    setLoading(false);
  };

  return (
    <div className="feature">
      <FeatureHeader icon="📝" title="Meeting Notes Summarizer" description="Turn raw meeting notes into structured summaries with action items and deadlines." />
      <div className="form-grid">
        <Select label="Meeting Type" name="meetingType" value={form.meetingType} onChange={set} options={[
          { value: "team", label: "Team Meeting" }, { value: "client", label: "Client Meeting" },
          { value: "project kickoff", label: "Project Kickoff" }, { value: "board", label: "Board / Executive" },
          { value: "one-on-one", label: "One-on-One" }, { value: "sprint planning", label: "Sprint Planning" }]} />
        <Select label="Summary Format" name="format" value={form.format} onChange={set} options={[
          { value: "structured", label: "Structured" },
          { value: "concise", label: "Concise" },
          { value: "detailed", label: "Detailed" }]} />
      </div>
      <Textarea label="Paste Your Meeting Notes" name="notes" value={form.notes} onChange={set}
        placeholder={"Paste raw meeting notes here…\n\ne.g.\nAttendees: John, Sarah, Mike\nDiscussed Q3 budget — approved R50k\nJohn to send proposal by Thursday\nSarah leads client demo Tuesday 10am\nNext meeting: Friday 2pm"} rows={10} />
      <RunButton onClick={run} loading={loading} label="Summarize Notes 📝" />
      <OutputBox output={output} loading={loading} error={error} />
    </div>
  );
}