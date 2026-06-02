const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
const TOKEN_KEY = "hep_summer_school_token";

export function hasSession() {
  return typeof window !== "undefined" && Boolean(localStorage.getItem(TOKEN_KEY));
}

export function clearSession() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

export async function login(username: string, password: string) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  }, false);
  localStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
}

async function request(path: string, options: RequestInit = {}, authenticated = true) {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  const headers = {
    "Content-Type": "application/json",
    ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
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
    if (res.status === 401) clearSession();
    throw new Error(message);
  }
  return res.json();
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  return request(path, options);
}
