"use client";

import { FormEvent, useState } from "react";
import { login } from "../lib/api";

export default function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("demo.student");
  const [password, setPassword] = useState("learn-particles");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError("");
    try { await login(username, password); onLogin(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not sign in."); }
    finally { setLoading(false); }
  }
  return <section className="login-panel">
    <p className="eyebrow">Private detector workspace</p><h3>Sign in to run Day 9</h3>
    <p>The other lessons work without an account. Day 9 stores your detector progress privately.</p>
    <form onSubmit={submit}><label>Username<input value={username} onChange={event=>setUsername(event.target.value)} /></label><label>Password<input type="password" value={password} onChange={event=>setPassword(event.target.value)} /></label><button className="button primary" disabled={loading}>{loading?"Signing in…":"Sign in"}</button></form>
    {error&&<span className="login-error">{error}</span>}<small>Classroom demo account: <b>demo.student</b> / <b>learn-particles</b></small>
  </section>;
}
