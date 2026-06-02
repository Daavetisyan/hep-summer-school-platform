const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    // MVP demo identity. In production, replace with real auth.
    "X-User-Id": "1",
    "X-Role": "student",
    "X-Class-Id": "101",
    ...(options.headers || {})
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("The detector lab server is offline.");
  }

  if (!res.ok) {
    let message = "The lab server could not complete that request.";
    try {
      const payload = await res.json();
      message = payload.detail || message;
    } catch {
      // Keep the friendly fallback for non-JSON server responses.
    }
    throw new Error(message);
  }

  return res.json();
}
