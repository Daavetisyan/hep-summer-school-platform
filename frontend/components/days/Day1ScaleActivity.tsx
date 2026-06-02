"use client";

import { useState } from "react";

const levels = [
  ["Human", "10⁰ m", "Your body is made of trillions of cells."],
  ["Cell", "10⁻⁵ m", "Cells are the small living units that build tissues."],
  ["DNA / Molecule", "10⁻⁹ m", "Molecules are groups of atoms. DNA stores biological information."],
  ["Atom", "10⁻¹⁰ m", "Atoms contain a tiny nucleus surrounded by electrons."],
  ["Nucleus", "10⁻¹⁵ m", "The nucleus contains protons and neutrons."],
  ["Proton / Neutron", "10⁻¹⁵ m", "Protons and neutrons are composite particles called hadrons."],
  ["Quark", "< 10⁻¹⁸ m", "Quarks are fundamental particles inside protons and neutrons."]
];

export default function Day1ScaleActivity() {
  const [active, setActive] = useState(0);
  const [order, setOrder] = useState(["Atom", "Human", "Quark", "Cell"]);
  const [message, setMessage] = useState("");
  function move(index: number, amount: number) {
    const target = index + amount;
    if (target < 0 || target >= order.length) return;
    const next = [...order]; [next[index], next[target]] = [next[target], next[index]]; setOrder(next); setMessage("");
  }
  return (
    <section className="lesson-card">
      <p className="eyebrow">Zoom laboratory</p><h2>Scale ladder: from you to quarks</h2>
      <p className="lesson-copy">Select each level to descend through more than eighteen orders of magnitude.</p>
      <div className="scale-ladder">{levels.map(([name, size], index) => <button className={active === index ? "active" : ""} key={name} onClick={() => setActive(index)}><i /><strong>{name}</strong><small>{size}</small></button>)}</div>
      <div className="observation-box"><strong>{levels[active][0]} · {levels[active][1]}</strong><p>{levels[active][2]}</p></div>
      <div className="mini-activity"><h3>Arrange largest → smallest</h3><p>Move each object into the correct order.</p>
        <div className="order-list">{order.map((item, index) => <div key={item}><strong>{index + 1}. {item}</strong><span><button onClick={() => move(index, -1)}>↑</button><button onClick={() => move(index, 1)}>↓</button></span></div>)}</div>
        <button className="button primary" onClick={() => setMessage(order.join() === ["Human", "Cell", "Atom", "Quark"].join() ? "Correct. You crossed eighteen orders of magnitude." : "Not yet. Start with the object visible without a microscope.")}>Check order</button>
        {message && <p className="private-result">{message}</p>}
      </div>
    </section>
  );
}
