import { useState } from "react";
import { callGemini, FeatureHeader, Select, Textarea, RunButton, OutputBox } from "../src/gemini";

export default function TaskPlanner() {
  const [form, setForm] = useState({ tasks: "", timeframe: "daily", priority: "balanced", hours: "8", startTime: "09:00" });
  const [output, setOutput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const run = async () => {
    if (!form.tasks.trim()) return setError("Please enter your tasks.");
    setLoading(true); setError(""); setOutput("");
    try {
      const prompt = `You are a productivity coach. Create a ${form.timeframe} plan starting at ${form.startTime} with ${form.hours} hours. Priority: ${form.priority}.

TASKS:
${form.tasks}

Use EXACTLY these sections:
🎯 PRIORITY RANKING (use Eisenhower Matrix)
🗓️ SCHEDULED TIME BLOCKS (format: HH:MM – HH:MM | Task | Duration | Notes)
☕ BREAK SCHEDULE
📊 TIME ESTIMATES (Task | Duration | Difficulty | Energy)
⚡ TIME OPTIMIZATION TIPS (5 specific tips)
🏆 SUCCESS METRICS`;
      setOutput(await callGemini(prompt));
    } catch { setError("API call failed. Check your Gemini API key in the .env file."); }
    setLoading(false);
  };

  return (
    <div className="feature">
      <FeatureHeader icon="📋" title="AI Task Planner" description="Prioritize and schedule your tasks with AI-powered time blocking." />
      <div className="form-grid">
        <Select label="Timeframe" name="timeframe" value={form.timeframe} onChange={set} options={[
          { value: "daily", label: "Daily Plan" }, { value: "weekly", label: "Weekly Plan" }]} />
        <Select label="Priority Style" name="priority" value={form.priority} onChange={set} options={[
          { value: "balanced", label: "Balanced" }, { value: "urgency-first", label: "Urgency First" },
          { value: "deep-work-first", label: "Deep Work First" }, { value: "easy-wins-first", label: "Easy Wins First" }]} />
        <Select label="Available Hours" name="hours" value={form.hours} onChange={set} options={[
          { value: "4", label: "4 hours" }, { value: "6", label: "6 hours" },
          { value: "8", label: "8 hours" }, { value: "10", label: "10 hours" }]} />
        <Select label="Start Time" name="startTime" value={form.startTime} onChange={set} options={[
          { value: "07:00", label: "7:00 AM" }, { value: "08:00", label: "8:00 AM" },
          { value: "09:00", label: "9:00 AM" }, { value: "10:00", label: "10:00 AM" }]} />
      </div>
      <Textarea label="Your Tasks (one per line)" name="tasks" value={form.tasks} onChange={set}
        placeholder={"Finish project proposal\nReply to client emails\nTeam standup (30 min)\nReview pull requests\nPrepare Friday presentation"} rows={7} />
      <RunButton onClick={run} loading={loading} label="Generate My Plan 📋" />
      <OutputBox output={output} loading={loading} error={error} />
    </div>
  );
}