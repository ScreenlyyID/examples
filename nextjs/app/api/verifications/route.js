import { randomUUID } from "node:crypto";
import { createInstance, sessions } from "@/lib/screenlyyid";

export const dynamic = "force-dynamic";

// Step 1: create a verification session (server side).
export async function POST() {
  const userId = "demo-user"; // replace with your own authentication
  try {
    const { CorrelationId, webEnrolmentUrl } = await createInstance();
    const verificationId = randomUUID();
    sessions.set(verificationId, { userId, correlationId: CorrelationId });
    return Response.json({ verificationId, webEnrolmentUrl }, { status: 201 }); // no CorrelationId
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
