"use client";
import { useState } from "react";
export default function Day5RelativityActivity(){
 const [beta,setBeta]=useState(.55);const gamma=1/Math.sqrt(1-beta**2);
 return <section className="lesson-card"><p className="eyebrow">Relativity beam line</p><h2>Approaching the cosmic speed limit</h2><p className="lesson-copy">Move the speed control toward light speed and watch the energy cost rise sharply.</p>
 <div className="speed-stage"><div className="beam-line"/><div className="speed-particle" style={{left:`${5+beta*84}%`}}>●</div><div className="speed-limit">c</div></div>
 <label className="range-control">Particle speed: {(beta*100).toFixed(0)}% of light speed<input type="range" min="0" max=".99" step=".01" value={beta} onChange={e=>setBeta(+e.target.value)}/></label>
 <div className="metric-grid"><div><small>β = v / c</small><strong>{beta.toFixed(2)}</strong></div><div><small>Gamma factor</small><strong>{gamma.toFixed(2)}</strong></div><div><small>Moving clock</small><strong>{(1/gamma).toFixed(2)}× rate</strong></div><div><small>Relative total energy</small><strong>{gamma.toFixed(2)} mc²</strong></div></div>
 <div className="observation-box"><strong>E = mc²</strong><p>Mass is stored energy. Accelerators add kinetic energy; near light speed, adding more energy changes a particle’s speed only slightly. Collision energy can transform into new particles.</p></div></section>
}
