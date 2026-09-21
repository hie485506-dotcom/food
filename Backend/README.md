# Traffic Director API

Express service used by the Vercel/Next.js edge middleware.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `TRAFFIC_DIRECTOR_TARGET_URL` to the offer URL. The service intentionally keeps no visitor data. Requests containing a bot-like or missing user-agent receive `route: "safe"`; other requests receive `route: "target"` only when a valid HTTP(S) target is configured.

## Endpoint

`POST /api/v1/traffic-director/evaluate/:slug`

```json
{
  "clientIp": "203.0.113.10",
  "userAgent": "Mozilla/5.0",
  "referrer": "https://example.com",
  "url": "https://food-us.vercel.app/"
}
```

The response is compatible with `Frontend/middleware.js`:

```json
{
  "success": true,
  "route": "target",
  "destinationUrl": "https://heybubbleclasses395.vercel.app/"
}
```
