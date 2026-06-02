"use client";

import { useState } from "react";

export default function ReflectionBox({ prompt = "What did you learn from this activity?" }: { prompt?: string }) {
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <section className="lesson-card reflection-card">
      <p className="eyebrow">Reflection</p>
      <h2>What did you learn?</h2>
      <p>{prompt}</p>
      <textarea value={reflection} onChange={(event) => { setReflection(event.target.value); setSaved(false); }} placeholder="Write a few sentences about your observation…" />
      <button className="button ghost" disabled={!reflection.trim()} onClick={() => setSaved(true)} type="button">Save reflection locally</button>
      {saved && <span className="saved-note">✓ Saved privately in this browser session</span>}
    </section>
  );
}
