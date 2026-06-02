export type ParticleId = "electron" | "photon" | "muon" | "charged_pion" | "neutral_hadron" | "neutrino";

type Props = {
  selected: ParticleId | null;
  disabled: boolean;
  submitting: boolean;
  onSelect: (particle: ParticleId) => void;
  onSubmit: () => void;
};

const particles: { id: ParticleId; name: string; symbol: string; clue: string }[] = [
  { id: "electron", name: "Electron", symbol: "e⁻", clue: "Charged lepton" },
  { id: "photon", name: "Photon", symbol: "γ", clue: "Light quantum" },
  { id: "muon", name: "Muon", symbol: "μ", clue: "Heavy lepton" },
  { id: "charged_pion", name: "Charged pion", symbol: "π±", clue: "Charged hadron" },
  { id: "neutral_hadron", name: "Neutral hadron", symbol: "n", clue: "Neutral hadron" },
  { id: "neutrino", name: "Neutrino", symbol: "ν", clue: "Invisible lepton" }
];

export default function ParticlePredictionPanel({ selected, disabled, submitting, onSelect, onSubmit }: Props) {
  return (
    <section className="prediction-panel panel">
      <div className="panel-kicker">Step 02 · Classify</div>
      <h3>What particle made this pattern?</h3>
      <p>Select one candidate after examining every detector layer.</p>
      <div className="particle-options">
        {particles.map((particle) => (
          <button
            className={`particle-option ${selected === particle.id ? "selected" : ""}`}
            disabled={disabled}
            key={particle.id}
            onClick={() => onSelect(particle.id)}
            type="button"
          >
            <span>{particle.symbol}</span>
            <strong>{particle.name}</strong>
            <small>{particle.clue}</small>
          </button>
        ))}
      </div>
      <button className="button primary full-width" disabled={!selected || disabled || submitting} onClick={onSubmit} type="button">
        {submitting ? "Analyzing pattern…" : "Submit prediction"}
      </button>
    </section>
  );
}
