import { getResult, sessions } from "@/lib/screenlyyid";

export const dynamic = "force-dynamic";

// Step 4: after the browser reports IDV_SESSION_COMPLETE, read the result once.
export async function GET(_request, { params }) {
  const userId = "demo-user"; // replace with your own authentication
  const session = sessions.get(params.id);
  if (!session || session.userId !== userId) return Response.json({ error: "Unknown verification" }, { status: 404 });
  const r = await getResult(session.correlationId);
  if (r.status === 200) return Response.json({ status: "ready", result: await r.json() });
  if (r.status === 500) return Response.json({ status: "pending" }); // asked before the capture finished
  return Response.json({ error: `ScreenlyyID document/result failed (HTTP ${r.status})` }, { status: 502 });
}
