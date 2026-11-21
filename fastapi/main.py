"""FastAPI back end for ScreenlyyID identity verification. Python 3.9 or later.

The API key and the CorrelationId stay on this server: the browser or app only gets a verification_id and the hosted page URL.
Run: SCREENLYYID_API_KEY=test_... uvicorn main:app
"""
import os
import uuid

import httpx
from fastapi import FastAPI, HTTPException

API = "https://api.screenlyyid.com"
API_KEY = os.environ["SCREENLYYID_API_KEY"]  # a test_ key while you build

app = FastAPI()
# verification_id -> {"user_id": ..., "correlation_id": ...}. In memory for the example; use your database.
sessions: dict = {}


def current_user_id() -> str:
    return "demo-user"  # replace with your own authentication


@app.post("/api/verifications", status_code=201)
async def create_verification():
    """Step 1: create a verification session (server side)."""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            f"{API}/api/v1/instance/create",
            headers={"x-api-key": API_KEY},
            json={"GlobalScreening": ["idv"], "CustomerIntelligence": []},
        )
    if r.status_code != 200:
        raise HTTPException(502, f"ScreenlyyID instance/create failed (HTTP {r.status_code})")
    body = r.json()  # the property names are exactly CorrelationId and webEnrolmentUrl
    verification_id = str(uuid.uuid4())
    sessions[verification_id] = {"user_id": current_user_id(), "correlation_id": body["CorrelationId"]}
    return {"verificationId": verification_id, "webEnrolmentUrl": body["webEnrolmentUrl"]}  # no CorrelationId


@app.get("/api/verifications/{verification_id}")
async def get_verification(verification_id: str):
    """Step 4: after the browser or app reports IDV_SESSION_COMPLETE, read the result once."""
    session = sessions.get(verification_id)
    if not session or session["user_id"] != current_user_id():
        raise HTTPException(404, "Unknown verification")
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(
            f"{API}/api/v1/document/result",
            headers={"x-api-key": API_KEY, "x-correlation-id": session["correlation_id"]},
        )
    if r.status_code == 200:
        return {"status": "ready", "result": r.json()}
    if r.status_code == 500:  # asked before the capture finished
        return {"status": "pending"}
    raise HTTPException(502, f"ScreenlyyID document/result failed (HTTP {r.status_code})")
