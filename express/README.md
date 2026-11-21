# Express example

```bash
npm install
export SCREENLYYID_API_KEY=test_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   # a test key
node server.js
```

```bash
curl -s -X POST localhost:3000/api/verifications
# {"verificationId":"...","webEnrolmentUrl":"https://app.screenlyyid.com/idv/..."}
curl -s localhost:3000/api/verifications/VERIFICATION_ID
# {"status":"pending"}   until the person has finished the capture
```

Open `webEnrolmentUrl` in a browser. When the page reports `IDV_SESSION_COMPLETE`, the same `GET` returns the result. Docs: https://www.screenlyyid.com/docs/recipes/express/
