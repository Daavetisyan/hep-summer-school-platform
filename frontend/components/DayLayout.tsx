import PrivacyNotice from "./PrivacyNotice";

type Props = {
  day: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function DayLayout({ day, title, subtitle, children }: Props) {
  return (
    <main className="day-page">
      <header className="day-nav shell">
        <a href="/">← Course map</a>
        <span>HEP Summer School · Student Lab</span>
      </header>
      <section className="day-hero shell">
        <p className="eyebrow">Interactive laboratory · Day {String(day).padStart(2, "0")}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>
      <div className="shell"><PrivacyNotice /></div>
      <div className="day-content shell">{children}</div>
      <footer className="footer shell"><span>Day {day} · Private student workspace</span><a href="/">Return to course map</a></footer>
    </main>
  );
}
