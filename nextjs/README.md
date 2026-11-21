# Next.js example

```bash
npm install
cp .env.example .env.local      # then put your test key in .env.local
npm run dev
```

Open http://localhost:3000 and press **Verify my identity**: the hosted capture page appears in an iframe. The page checks that each message comes from that iframe and from the hosted page's origin, and when it receives `IDV_SESSION_COMPLETE` it asks `GET /api/verifications/:id` for the result.

Docs: https://www.screenlyyid.com/docs/recipes/nextjs/
