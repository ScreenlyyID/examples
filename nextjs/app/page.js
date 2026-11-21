"use client";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [session, setSession] = useState(null); // { verificationId, webEnrolmentUrl }
  const [message, setMessage] = useState("");
  const frame = useRef(null);

  async function start() {
    const r = await fetch("/api/verifications", { method: "POST" });
    const body = await r.json();
    if (!r.ok) return setMessage(body.error);
    setSession(body);
  }

  // Step 3: the hosted page tells its parent window when it is done.
  useEffect(() => {
    if (!session) return;
    async function onMessage(event) {
      const el = frame.current;
      if (!el || event.source !== el.contentWindow) return; // only the iframe we created
      if (event.origin !== new URL(el.src).origin) return;  // and only from the hosted page's origin
      const { eventName, isError, error } = event.data || {};
      if (eventName === "IDV_SESSION_COMPLETE" && !isError) {
        // Step 4: ask YOUR server for the result. It reads it from ScreenlyyID once.
        const r = await fetch(`/api/verifications/${session.verificationId}`);
        setMessage(JSON.stringify(await r.json()));
        setSession(null);
      } else if (eventName === "ERROR") {
        setMessage("Verification failed: " + error);
        setSession(null);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [session]);

  return (
    <main>
      <button onClick={start}>Verify my identity</button>
      {session && (
        <iframe ref={frame} src={session.webEnrolmentUrl} allow="camera; microphone"
                style={{ width: "100%", height: 700, border: 0 }} title="Identity verification" />
      )}
      <pre>{message}</pre>
    </main>
  );
}
