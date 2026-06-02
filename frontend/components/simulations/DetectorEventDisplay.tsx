export type DetectorEvent = {
  event_id: number;
  tracker_hit: boolean;
  ecal_energy: number;
  hcal_energy: number;
  muon_hit: boolean;
  missing_energy: number;
};

type Props = {
  event: DetectorEvent | null;
  loading: boolean;
};

const center = 250;

function clusterRadius(energy: number, min = 5, max = 22) {
  return Math.max(min, Math.min(max, min + energy / 5));
}

export default function DetectorEventDisplay({ event, loading }: Props) {
  const ecalRadius = clusterRadius(event?.ecal_energy || 0);
  const hcalRadius = clusterRadius(event?.hcal_energy || 0, 6, 27);

  return (
    <div className={`event-display ${event ? "has-event" : ""}`}>
      <div className="display-heading">
        <div>
          <p className="eyebrow">Live event display</p>
          <h3>{event ? `Collision event #${event.event_id}` : "Waiting for collision"}</h3>
        </div>
        <span className={`live-indicator ${event ? "active" : ""}`}><i /> {event ? "Event captured" : "Standby"}</span>
      </div>

      <div className="detector-stage">
        <svg viewBox="0 0 500 500" role="img" aria-label="Simplified particle detector cross-section">
          <defs>
            <filter id="softGlow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="largeGlow"><feGaussianBlur stdDeviation="12" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-head" />
            </marker>
          </defs>

          <circle className="detector-ring muon-ring" cx={center} cy={center} r="205" />
          <circle className="detector-ring hcal-ring" cx={center} cy={center} r="162" />
          <circle className="detector-ring ecal-ring" cx={center} cy={center} r="120" />
          <circle className="detector-ring tracker-ring" cx={center} cy={center} r="78" />
          <circle className="beam-pipe" cx={center} cy={center} r="15" />
          <circle className={`collision-core ${event ? "pulse" : ""}`} cx={center} cy={center} r="6" />

          {event?.tracker_hit && (
            <path className="particle-track signal-animate" d="M250 250 C 290 231, 329 205, 370 174" />
          )}
          {event?.ecal_energy > 8 && (
            <g className="signal-animate" filter="url(#largeGlow)">
              <circle className="ecal-cluster" cx="353" cy="185" r={ecalRadius} />
              <circle className="cluster-core" cx="353" cy="185" r={Math.max(3, ecalRadius / 3)} />
            </g>
          )}
          {event?.hcal_energy > 10 && (
            <g className="signal-animate" filter="url(#largeGlow)">
              <circle className="hcal-cluster" cx="388" cy="149" r={hcalRadius} />
              <circle className="cluster-core" cx="388" cy="149" r={Math.max(4, hcalRadius / 3)} />
            </g>
          )}
          {event?.muon_hit && (
            <g className="signal-animate" filter="url(#softGlow)">
              <path className="muon-track" d="M250 250 L 444 72" />
              <circle className="muon-hit" cx="410" cy="103" r="9" />
            </g>
          )}
          {event && event.missing_energy > 15 && (
            <path className="missing-arrow signal-animate" d="M250 250 L 454 325" markerEnd="url(#arrow)" />
          )}
        </svg>

        <span className="layer-label tracker-label">Inner Tracker</span>
        <span className="layer-label ecal-label">ECAL</span>
        <span className="layer-label hcal-label">HCAL</span>
        <span className="layer-label muon-label">Muon System</span>
        {!event && <p className="empty-display">{loading ? "Accelerating particles…" : "Generate an event to begin your analysis"}</p>}
      </div>

      <div className="detector-legend">
        <span><i className="legend-track" /> Charged track</span>
        <span><i className="legend-ecal" /> ECAL cluster</span>
        <span><i className="legend-hcal" /> HCAL cluster</span>
        <span><i className="legend-missing" /> Missing energy</span>
      </div>
    </div>
  );
}
