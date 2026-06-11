import { useState } from "react";
import { callGemini, FeatureHeader, Select, Input, Textarea, RunButton, OutputBox } from "../src/gemini";

export default function EmailGenerator() {
  const [form, setForm] = useState({ audience: "client", tone: "formal", subject: "", points: "", length: "medium" });
  const [output, setOutput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const run = async () => {
    if (!form.subject.trim() || !form.points.trim()) return setError("Please fill in the subject and key points.");
    setLoading(true); setError(""); setOutput("");
    try {
      const prompt = `You are an expert business communication specialist.
Write a complete professional ${form.tone} email to a ${form.audience}. Length: ${form.length}.
Subject: ${form.subject}
Key points: ${form.points}
Requirements: appropriate greeting, well-structured body, ${form.tone} tone, professional closing with "Best regards, [Your Name]". Write ONLY the email.`;
      setOutput(await callGemini(prompt));
    } catch { setError("API call failed. Check your Gemini API key in the .env file."); }
    setLoading(false);
  };

  return (
    <div className="feature">
      <FeatureHeader icon="✉️" title="Smart Email Generator" description="Generate professional emails tailored to your audience and tone." />
      <div className="form-grid">
        <Select label="Audience" name="audience" value={form.audience} onChange={set} options={[
          { value: "client", label: "Client" }, { value: "manager", label: "Manager" },
          { value: "team", label: "Team" }, { value: "colleague", label: "Colleague" },
          { value: "stakeholder", label: "Stakeholder" }, { value: "vendor", label: "Vendor" }]} />
        <Select label="Tone" name="tone" value={form.tone} onChange={set} options={[
          { value: "formal", label: "Formal" }, { value: "informal", label: "Informal" },
          { value: "persuasive", label: "Persuasive" }, { value: "friendly", label: "Friendly" },
          { value: "assertive", label: "Assertive" }, { value: "apologetic", label: "Apologetic" }]} />
        <Select label="Length" name="length" value={form.length} onChange={set} options={[
          { value: "brief (3-4 sentences)", label: "Brief" },
          { value: "medium (2-3 paragraphs)", label: "Medium" },
          { value: "detailed (4+ paragraphs)", label: "Detailed" }]} />
      </div>
      <Input label="Email Subject" name="subject" value={form.subject} onChange={set} placeholder="e.g. Q3 Project Status Update" />
      <Textarea label="Key Points to Cover" name="points" value={form.points} onChange={set} placeholder="e.g. Project on track, budget approved, review meeting Friday 2pm" />
      <RunButton onClick={run} loading={loading} label="Generate Email ✉️" />
      <OutputBox output={output} loading={loading} error={error} />
    </div>
  );
}