import CourseDashboard from "../components/CourseDashboard";
import PrivacyNotice from "../components/PrivacyNotice";

export default function Home() {
  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">Armenian HEP Summer School · Student Portal</p>
          <h1>Explore the invisible<br /><span>universe of particles.</span></h1>
          <p className="hero-text">
            A ten-day journey from the scale of matter to real detector signals.
            Experiment, observe, and learn how physicists identify particles.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/day/9">Launch Day 9 simulator</a>
            <a className="button ghost" href="#course-map">Explore course map</a>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one"><i /></div>
          <div className="orbit orbit-two"><i /></div>
          <div className="orbit orbit-three"><i /></div>
          <div className="hero-core" />
        </div>
      </section>

      <div className="shell"><PrivacyNotice /></div>
      <CourseDashboard />

      <section className="simulator-section shell">
        <div className="section-heading">
          <p className="eyebrow">Available laboratory · Day 09</p>
          <h2>Detector Event Simulator</h2>
          <p>Read the traces. Compare detector layers. Identify the invisible particle.</p>
        </div>
        <a className="button primary" href="/day/9">Open the detector laboratory →</a>
      </section>

      <footer className="footer shell">
        <span>HEP Summer School · Student learning portal</span>
        <span>Built for curious minds in grades 9–12</span>
      </footer>
    </main>
  );
}
