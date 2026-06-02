"use client";
import { useState } from "react";
const photons = { red: 4.6, green: 5.7, blue: 6.6, ultraviolet: 8.5 };
export default function Day3FieldsActivity() {
  const [left,setLeft]=useState("+"); const [right,setRight]=useState("-"); const [distance,setDistance]=useState(3); const [color,setColor]=useState<keyof typeof photons>("green");
  const attraction=left!==right, force=1/distance**2;
  return <section className="lesson-grid"><div className="lesson-card"><p className="eyebrow">Electric field bench</p><h2>Charges and fields</h2><div className="field-stage"><div className={`charge ${left==="+"?"positive":"negative"}`}>{left}</div><div className={`force-arrow ${attraction?"attract":"repel"}`}>{attraction?"→   ←":"←   →"}</div><div className={`charge ${right==="+"?"positive":"negative"}`}>{right}</div></div>
    <div className="inline-controls"><select value={left} onChange={e=>setLeft(e.target.value)}><option>+</option><option>-</option></select><select value={right} onChange={e=>setRight(e.target.value)}><option>+</option><option>-</option></select></div>
    <label className="range-control">Distance: {distance} units<input type="range" min="1" max="8" value={distance} onChange={e=>setDistance(+e.target.value)}/></label><p className="private-result">{attraction?"Opposite charges attract.":"Like charges repel."} Relative force: {force.toFixed(3)}</p></div>
    <div className="lesson-card"><p className="eyebrow">Photon calculator</p><h2>Energy comes in packets</h2><div className={`photon-beam ${color}`}><i/><i/><i/><i/></div><label className="range-control">Photon color<select value={color} onChange={e=>setColor(e.target.value as keyof typeof photons)}>{Object.keys(photons).map(item=><option key={item}>{item}</option>)}</select></label><div className="observation-box"><strong>{color} photon</strong><p>Frequency: {photons[color]} × 10¹⁴ Hz. Since E = hf, higher frequency means higher photon energy.</p></div></div></section>;
}
