// Express back end for ScreenlyyID identity verification. Node 18 or later.
// The API key and the CorrelationId stay on this server: the browser only gets a verificationId and the hosted page URL.
import express from "express";
import { randomUUID } from "node:crypto";

const API = "https://api.screenlyyid.com";
const apiKey = process.env.SCREENLYYID_API_KEY; // a test_ key while you build
if (!apiKey) throw new Error("SCREENLYYID_API_KEY is not set");

// verificationId -> { userId, correlationId }. In memory for the example; use your database.
const sessions = new Map();

const app = express();
app.use(express.json());

// Step 1: create a verification session (server side).
app.post("/api/verifications", async (req, res) => {
  const userId = req.user?.id ?? "demo-user"; // replace with your own authentication
  const r = await fetch(`${API}/api/v1/instance/create`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ GlobalScreening: ["idv"], CustomerIntelligence: [] }),
  });
  if (!r.ok) return res.status(502).json({ error: `ScreenlyyID instance/create failed (HTTP ${r.status})` });
  const { CorrelationId, webEnrolmentUrl } = await r.json(); // the property names are exactly these
  const verificationId = randomUUID();
  sessions.set(verificationId, { userId, correlationId: CorrelationId });
  res.status(201).json({ verificationId, webEnrolmentUrl }); // the CorrelationId is not sent to the browser
});

// Step 4: after the browser reports IDV_SESSION_COMPLETE, read the result once.
app.get("/api/verifications/:id", async (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session || session.userId !== (req.user?.id ?? "demo-user")) return res.status(404).json({ error: "Unknown verification" });
  const r = await fetch(`${API}/api/v1/document/result`, {
    headers: { "x-api-key": apiKey, "x-correlation-id": session.correlationId },
  });
  if (r.status === 200) return res.json({ status: "ready", result: await r.json() });
  if (r.status === 500) return res.json({ status: "pending" }); // asked before the capture finished
  res.status(502).json({ error: `ScreenlyyID document/result failed (HTTP ${r.status})` });
});

app.listen(process.env.PORT || 3000, () => console.log("listening"));
