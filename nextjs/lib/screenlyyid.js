// Server-only helpers. The API key and the CorrelationId never reach the browser.
const API = "https://api.screenlyyid.com";

// verificationId -> { userId, correlationId }. In memory for the example; use your database.
// (A module-level Map is shared per server process; with several instances or serverless functions, use a database.)
const globalStore = globalThis;
export const sessions = (globalStore.__sessions ??= new Map());

export function apiKey() {
  const key = process.env.SCREENLYYID_API_KEY; // a test_ key while you build
  if (!key) throw new Error("SCREENLYYID_API_KEY is not set");
  return key;
}

export async function createInstance() {
  const r = await fetch(`${API}/api/v1/instance/create`, {
    method: "POST",
    headers: { "x-api-key": apiKey(), "Content-Type": "application/json" },
    body: JSON.stringify({ GlobalScreening: ["idv"], CustomerIntelligence: [] }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`ScreenlyyID instance/create failed (HTTP ${r.status})`);
  return r.json(); // { CorrelationId, webEnrolmentUrl }: the property names are exactly these
}

export function getResult(correlationId) {
  return fetch(`${API}/api/v1/document/result`, {
    headers: { "x-api-key": apiKey(), "x-correlation-id": correlationId },
    cache: "no-store",
  });
}
