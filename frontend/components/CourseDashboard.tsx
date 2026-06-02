const courseDays = [
  { day: 1, title: "Scale of Matter", description: "Travel from everyday objects down to quarks and leptons.", time: "35 min", tag: "Foundations" },
  { day: 2, title: "Collisions and Conservation Laws", description: "Track energy and momentum through particle collisions.", time: "45 min", tag: "Collisions" },
  { day: 3, title: "Charge, Fields, and Photons", description: "Explore electric charge, fields, and packets of light.", time: "40 min", tag: "Fields" },
  { day: 4, title: "Radioactive Decay", description: "Model half-life and discover the role of randomness.", time: "40 min", tag: "Decay" },
  { day: 5, title: "Relativity and E = mc²", description: "Connect mass, energy, and motion at high speeds.", time: "50 min", tag: "Relativity" },
  { day: 6, title: "Standard Model Explorer", description: "Meet the particles that make up our universe.", time: "45 min", tag: "Particles" },
  { day: 7, title: "Fundamental Forces", description: "Compare the interactions that shape the cosmos.", time: "40 min", tag: "Forces" },
  { day: 8, title: "Accelerator Simulator", description: "Steer charged particles with electric and magnetic fields.", time: "55 min", tag: "Accelerator" },
  { day: 9, title: "Detector Event Simulator", description: "Classify invisible particles from the signals they leave behind.", time: "50 min", tag: "Detector" },
  { day: 10, title: "Final AI Particle Classifier", description: "Train a classifier and test your full HEP toolkit.", time: "60 min", tag: "AI Lab" }
];

export default function CourseDashboard() {
  return (
    <section id="course-map" className="course-section shell">
      <div className="section-heading compact">
        <p className="eyebrow">Your summer school journey</p>
        <h2>Course map</h2>
        <p>Ten connected laboratories. Every day is available for exploration.</p>
      </div>
      <div className="course-grid">
        {courseDays.map((item) => (
          <article className="course-card available" key={item.day}>
            <div className="course-topline">
              <span className="day-number">{String(item.day).padStart(2, "0")}</span>
              <span className="status open">Available</span>
            </div>
            <div className="course-symbol">✦</div>
            <p className="tag">{item.tag}</p>
            <h3>Day {item.day} · {item.title}</h3>
            <p>{item.description}</p>
            <div className="course-footer">
              <span>{item.time} activity</span>
              <a href={`/day/${item.day}`}>Launch lab →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
