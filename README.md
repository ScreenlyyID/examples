# ScreenlyyID examples

Runnable back ends and a web page that add [ScreenlyyID](https://www.screenlyyid.com) identity verification to an app. ScreenlyyID (screenlyyid.com) is an identity verification, KYC and AML API. It is not related to Screenly (screenly.io).

Every example has the same two routes, taken from the [AI quickstart](https://www.screenlyyid.com/docs/ai-quickstart/):

| Route | What it does |
|---|---|
| `POST /api/verifications` | Your server calls `instance/create` with your API key, keeps the `CorrelationId`, and returns only `{ verificationId, webEnrolmentUrl }`. |
| `GET /api/verifications/:id` | After the hosted capture page reports `IDV_SESSION_COMPLETE`, your server reads the result once with `document/result`. |

The API key and the `CorrelationId` never leave the server.

| Example | Stack | Docs page |
|---|---|---|
| [`express/`](express) | Node.js 18+ and Express | https://www.screenlyyid.com/docs/recipes/express/ |
| [`fastapi/`](fastapi) | Python 3.9+ and FastAPI | https://www.screenlyyid.com/docs/recipes/fastapi/ |
| [`nextjs/`](nextjs) | Next.js 14 (App Router): route handlers and a page that embeds the hosted page in an iframe | https://www.screenlyyid.com/docs/recipes/nextjs/ |
| iOS | Swift app and its own back end | https://github.com/ScreenlyyID/ios-sdk-example |

## Run one

1. Create a **test** API key: register at https://admin.screenlyyid.com/register, open **Integrations** in the dashboard and create a key in the test environment. Test keys start with `test_`. Never use a production key here.
2. Put it in your environment (each example has a `.env.example`):
   ```bash
   export SCREENLYYID_API_KEY=test_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
3. Follow the README in the example's folder.

## What these examples leave out

They are samples, not production code. Replace the fixed `demo-user` with your own sign-in and keep the check that a verification belongs to the person asking, store the `CorrelationId` in a database (the examples keep it in memory), and add HTTPS and rate limits.

## Keeping the docs and the examples the same

The code in these folders is the code printed on the docs pages. `scripts/check_docs_in_sync.py` compares them, and CI runs it on every push and weekly. If it fails, the docs or an example changed: update the other one (the docs source is `docs/content/recipes/` in the website repo).

Using a coding agent? Install the [`integrate-screenlyyid` skill](https://github.com/ScreenlyyID/agent-skills) or give it https://www.screenlyyid.com/docs/llms-full.txt .
