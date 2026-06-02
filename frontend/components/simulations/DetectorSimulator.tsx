"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import DetectorEventDisplay, { DetectorEvent } from "./DetectorEventDisplay";
import ParticlePredictionPanel, { ParticleId } from "./ParticlePredictionPanel";

type ClassificationResult = {
  correct: boolean;
  true_particle: ParticleId;
  student_prediction: ParticleId;
  feedback: string;
  explanation: string;
};

type ProgressData = {
  module_id: number;
  simulation_completed: boolean;
  score: number;
};

const guide = [
  ["electron", "track + ECAL"],
  ["photon", "no track + ECAL"],
  ["muon", "track + muon system"],
  ["charged hadron", "track + HCAL"],
  ["neutral hadron", "no track + HCAL"],
  ["neutrino", "missing energy"]
];

function signalLevel(value: number) {
  if (value > 15) return "High";
  if (value > 5) return "Medium";
  return "Low";
}

export default function DetectorSimulator() {
  const [event, setEvent] = useState<DetectorEvent | null>(null);
  const [selected, setSelected] = useState<ParticleId | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function refreshProgress() {
    try {
      const records = await apiFetch("/progress/student/1") as ProgressData[];
      setProgress(records.find((record) => record.module_id === 9) || null);
    } catch {
      // Progress is supplementary; a detector event can still be classified.
    }
  }

  async function generateEvent() {
    setLoading(true);
    setError("");
    setResult(null);
    setSelected(null);
    try {
      const data = await apiFetch("/simulations/day9/detector-event", {
        method: "POST",
        body: JSON.stringify({ random_particle: true })
      });
      setEvent(data as DetectorEvent);
      void refreshProgress();
    } catch (err) {
      setEvent(null);
      setError(err instanceof Error ? err.message : "The detector could not connect to the lab server.");
    } finally {
      setLoading(false);
    }
  }

  async function submitPrediction() {
    if (!event || !selected) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await apiFetch("/simulations/day9/check-classification", {
        method: "POST",
        body: JSON.stringify({ event_id: event.event_id, student_prediction: selected })
      }) as ClassificationResult;
      setResult(data);
      await apiFetch("/progress/submit-run", {
        method: "POST",
        body: JSON.stringify({
          module_id: 9,
          simulation_type: "detector_classification",
          parameters_json: { event_id: event.event_id },
          results_json: { prediction: selected, correct: data.correct, true_particle: data.true_particle }
        })
      });
      void refreshProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your prediction could not be checked.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="simulator">
      <div className="simulator-toolbar">
        <div>
          <span className="lab-badge">Interactive lab</span>
          {progress?.simulation_completed && <span className="complete-badge">✓ Progress saved privately</span>}
        </div>
        <button className="button primary" disabled={loading} onClick={generateEvent} type="button">
          {loading ? "Generating collision…" : event ? "Generate new event" : "Generate event"}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Lab connection unavailable.</strong>
          <span>{error} Start the FastAPI backend at <code>http://127.0.0.1:8000</code>, then try again.</span>
        </div>
      )}

      <div className="simulator-grid">
        <DetectorEventDisplay event={event} loading={loading} />
        <div className="analysis-column">
          <section className="panel signal-panel">
            <div className="panel-kicker">Step 01 · Observe</div>
            <h3>Detector signal summary</h3>
            {!event ? (
              <p className="muted">Generate an event to activate the detector readout.</p>
            ) : (
              <>
                <div className="signal-grid">
                  <div><span>Tracker hit</span><strong>{event.tracker_hit ? "Yes" : "No"}</strong></div>
                  <div><span>ECAL energy</span><strong>{event.ecal_energy.toFixed(1)} GeV</strong><small>{signalLevel(event.ecal_energy)}</small></div>
                  <div><span>HCAL energy</span><strong>{event.hcal_energy.toFixed(1)} GeV</strong><small>{signalLevel(event.hcal_energy)}</small></div>
                  <div><span>Muon hit</span><strong>{event.muon_hit ? "Yes" : "No"}</strong></div>
                  <div className="wide"><span>Missing transverse energy</span><strong>{event.missing_energy.toFixed(1)} GeV</strong><small>{signalLevel(event.missing_energy)}</small></div>
                </div>
                <div className="hint">
                  <strong>Analysis hint</strong>
                  <p>Start with the tracker. Then compare ECAL and HCAL energy. A muon-system hit or large missing energy can be decisive.</p>
                </div>
              </>
            )}
          </section>

          <ParticlePredictionPanel
            selected={selected}
            disabled={!event || Boolean(result)}
            submitting={submitting}
            onSelect={setSelected}
            onSubmit={submitPrediction}
          />
        </div>
      </div>

      {result && (
        <section className={`result-card ${result.correct ? "correct" : "incorrect"}`}>
          <div className="result-icon">{result.correct ? "✓" : "!"}</div>
          <div>
            <p className="eyebrow">{result.correct ? "Correct classification" : "Review the detector pattern"}</p>
            <h3>The particle was a {result.true_particle.replace("_", " ")}.</h3>
            <p>{result.feedback}</p>
            <details>
              <summary>Why does this pattern fit?</summary>
              <p>{result.explanation}</p>
            </details>
          </div>
          <button className="button ghost" onClick={generateEvent} type="button">Try another event</button>
        </section>
      )}

      <section className="classification-guide">
        <div>
          <p className="eyebrow">Field notes</p>
          <h3>How to classify a particle</h3>
        </div>
        <div className="guide-grid">
          {guide.map(([particle, pattern]) => <div key={particle}><strong>{particle}</strong><span>{pattern}</span></div>)}
        </div>
      </section>
    </div>
  );
}
