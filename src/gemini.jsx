const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "API error");
  return data.candidates[0].content.parts[0].text;
}

export function FeatureHeader({ icon, title, description }) {
  return (
    <div className="feature-header">
      <div className="feature-icon">{icon}</div>
      <div><h2>{title}</h2><p>{description}</p></div>
    </div>
  );
}

export function Select({ label, name, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Textarea({ label, name, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} />
    </div>
  );
}

export function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

export function RunButton({ onClick, loading, label }) {
  return (
    <button className="run-btn" onClick={onClick} disabled={loading}>
      {loading ? "Generating..." : label}
    </button>
  );
}

export function OutputBox({ output, loading, error }) {
  if (loading) return (
    <div className="output-state loading">
      <span className="spinner" />
      <span>AI is working on your request…</span>
    </div>
  );
  if (error) return <div className="output-state error">⚠️ {error}</div>;
  if (!output) return null;
  return (
    <div className="output-box">
      <div className="output-header">
        <span>AI Output</span>
        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(output)}>
          📋 Copy
        </button>
      </div>
      <pre className="output-content">{output}</pre>
      <p className="disclaimer">⚠️ AI-generated content may require human review before use.</p>
    </div>
  );
}