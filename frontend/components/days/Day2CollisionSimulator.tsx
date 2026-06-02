"use client";

import { useState } from "react";
import { downloadCsv } from "../../lib/csv";

type Trial = Record<string, string | number | boolean>;
export default function Day2CollisionSimulator() {
  const [m1, setM1] = useState(2); const [m2, setM2] = useState(3); const [u1, setU1] = useState(4); const [u2, setU2] = useState(-2);
  const [kind, setKind] = useState("elastic"); const [running, setRunning] = useState(false); const [trials, setTrials] = useState<Trial[]>([]);
  const pBefore = m1 * u1 + m2 * u2;
  const elastic = kind === "elastic";
  const v1 = elastic ? ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2) : pBefore / (m1 + m2);
  const v2 = elastic ? ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2) : v1;
  const pAfter = m1 * v1 + m2 * v2, keBefore = .5 * m1 * u1 ** 2 + .5 * m2 * u2 ** 2, keAfter = .5 * m1 * v1 ** 2 + .5 * m2 * v2 ** 2;
  const controls = [{label:"Mass 1",value:m1,setter:setM1,min:1,max:8},{label:"Velocity 1",value:u1,setter:setU1,min:-6,max:6},{label:"Mass 2",value:m2,setter:setM2,min:1,max:8},{label:"Velocity 2",value:u2,setter:setU2,min:-6,max:6}];
  function collide() { setRunning(false); requestAnimationFrame(() => setRunning(true)); }
  function addTrial() { setTrials([...trials, { type: kind, m1, m2, u1, u2, v1: v1.toFixed(2), v2: v2.toFixed(2), momentum_error: (pAfter - pBefore).toFixed(4), kinetic_energy_before: keBefore.toFixed(2), kinetic_energy_after: keAfter.toFixed(2) }]); }
  return <section className="lesson-card"><p className="eyebrow">Momentum laboratory</p><h2>One-dimensional collision simulator</h2>
    <div className="collision-track"><div className={`collision-ball ball-one ${running ? "run-one" : ""}`}>1</div><div className={`collision-ball ball-two ${running ? "run-two" : ""}`}>2</div><i /></div>
    <div className="control-grid">{controls.map(control => <label key={control.label}><span>{control.label}: {control.value}</span><input type="range" min={control.min} max={control.max} value={control.value} onChange={e => control.setter(Number(e.target.value))}/></label>)}</div>
    <div className="inline-controls"><select value={kind} onChange={e=>setKind(e.target.value)}><option value="elastic">Elastic collision</option><option value="inelastic">Inelastic collision</option></select><button className="button primary" onClick={collide}>Animate collision</button><button className="button ghost" onClick={addTrial}>Add trial</button></div>
    <div className="metric-grid"><div><small>Momentum before</small><strong>{pBefore.toFixed(2)}</strong></div><div><small>Momentum after</small><strong>{pAfter.toFixed(2)}</strong></div><div><small>Energy before</small><strong>{keBefore.toFixed(2)}</strong></div><div><small>Energy after</small><strong>{keAfter.toFixed(2)}</strong></div><div><small>Momentum error</small><strong>{Math.abs(pAfter-pBefore).toFixed(4)}</strong></div></div>
    {trials.length > 0 && <><div className="trial-list">{trials.map((trial,i)=><span key={i}>Trial {i+1}: {trial.type}, Δp {trial.momentum_error}</span>)}</div><button className="button ghost" onClick={()=>downloadCsv("collision_trials.csv",trials)}>Export CSV</button></>}
  </section>;
}
