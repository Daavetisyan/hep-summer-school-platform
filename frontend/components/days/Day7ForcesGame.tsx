"use client";
import { useState } from "react";
const scenarios=[["Electron attracted to proton","electromagnetic"],["Quarks bound inside a proton","strong"],["Neutron beta decay","weak"],["Earth orbiting the Sun","gravity"],["Photon emitted by an atom","electromagnetic"],["Neutrino interaction","weak"]];
const forces=["gravity","electromagnetic","strong","weak"];
export default function Day7ForcesGame(){
 const [index,setIndex]=useState(0),[selected,setSelected]=useState(""),[score,setScore]=useState(0),[answered,setAnswered]=useState(false);
 function answer(force:string){if(answered)return;setSelected(force);setAnswered(true);if(force===scenarios[index][1])setScore(score+1)}
 function next(){setIndex((index+1)%scenarios.length);setSelected("");setAnswered(false)}
 return <section className="lesson-card"><p className="eyebrow">Interaction matching game</p><h2>Which force is responsible?</h2><div className="scenario-card"><small>Scenario {index+1} / {scenarios.length}</small><strong>{scenarios[index][0]}</strong></div><div className="force-grid">{forces.map(force=><button className={`${selected===force?"selected":""}`} onClick={()=>answer(force)} key={force}><i>{force[0].toUpperCase()}</i><strong>{force}</strong></button>)}</div>{answered&&<div className="observation-box"><strong>{selected===scenarios[index][1]?"Correct.":"Review this interaction."}</strong><p>The responsible force is <b>{scenarios[index][1]}</b>.</p><button className="button primary" onClick={next}>Next scenario</button></div>}<p className="private-result">Your private local score: {score} / {scenarios.length}. No other student can see it.</p></section>
}
