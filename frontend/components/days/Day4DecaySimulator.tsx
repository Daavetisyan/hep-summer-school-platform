"use client";
import { useState } from "react"; import { downloadCsv } from "../../lib/csv";
type Trial=Record<string,string|number|boolean>;
export default function Day4DecaySimulator(){
 const [n0,setN0]=useState(64),[halfLife,setHalfLife]=useState(2),[steps,setSteps]=useState(8),[run,setRun]=useState<number[]>([]),[trials,setTrials]=useState<Trial[]>([]);
 const controls=[{label:"Initial nuclei",value:n0,setter:setN0,min:16,max:144},{label:"Half-life",value:halfLife,setter:setHalfLife,min:1,max:6},{label:"Time steps",value:steps,setter:setSteps,min:4,max:14}];
 function simulate(){let remaining=n0;const next=[remaining];for(let t=1;t<=steps;t++){let survivors=0;const probability=2**(-1/halfLife);for(let i=0;i<remaining;i++)if(Math.random()<probability)survivors++;remaining=survivors;next.push(remaining)}setRun(next)}
 const points=run.map((n,i)=>`${20+i*(360/Math.max(1,run.length-1))},${190-(n/n0)*160}`).join(" ");
 function add(){if(!run.length)return;setTrials([...trials,{initial_nuclei:n0,half_life:halfLife,time_steps:steps,remaining:run[run.length-1]}])}
 return <section className="lesson-card"><p className="eyebrow">Random decay laboratory</p><h2>Watch unstable nuclei decay</h2><div className="control-grid">{controls.map(control=><label key={control.label}><span>{control.label}: {control.value}</span><input type="range" min={control.min} max={control.max} value={control.value} onChange={e=>control.setter(+e.target.value)}/></label>)}</div><div className="inline-controls"><button className="button primary" onClick={simulate}>Run random decay</button><button className="button ghost" onClick={add}>Add trial</button>{trials.length>0&&<button className="button ghost" onClick={()=>downloadCsv("decay_trials.csv",trials)}>Export CSV</button>}</div>
 {run.length>0&&<><div className="decay-grid">{Array.from({length:n0},(_,i)=><i className={i<run[run.length-1]?"alive":"decayed"} key={i}/>)}</div><svg className="decay-chart" viewBox="0 0 400 210"><path d="M20 15V190H390"/><polyline points={points}/></svg><p className="private-result">{run[run.length-1]} of {n0} nuclei remain. Every run differs because individual decay is random.</p></>}</section>
}
