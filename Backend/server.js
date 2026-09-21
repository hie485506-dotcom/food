import express from 'express';
import {
  createSecurityMiddleware,
  handleMiddlewareError,
  trafficRequestContext,
} from './middleware.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const targetUrl = process.env.TRAFFIC_DIRECTOR_TARGET_URL ||
  'https://heybubbleclasses395.vercel.app/';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const botPatterns = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /slurp/i,
  /headless/i,
  /preview/i,
  /facebookexternalhit/i,
  /adsbot/i,
  /google-inspectiontool/i,
  /lighthouse/i,
  /pingdom/i,
  /uptimerobot/i,
];

app.disable('x-powered-by');
app.use(createSecurityMiddleware(allowedOrigins));
app.use(express.json({ limit: '8kb' }));
app.use(trafficRequestContext);

app.get('/health', (_request, response) => {
  response.json({ ok: true, service: 'traffic-director' });
});

app.post('/api/v1/traffic-director/evaluate/:slug', (request, response) => {
  const { clientIp, userAgent, referrer, url } = request.traffic;
  const slug = String(request.params.slug || '').trim();

  if (!slug || typeof userAgent !== 'string' || typeof url !== 'string') {
    response.status(400).json({ success: false, route: 'safe', error: 'Invalid request' });
    return;
  }

  const isBot = botPatterns.some((pattern) => pattern.test(userAgent)) || !userAgent.trim();
  const destinationUrl = isValidHttpUrl(targetUrl) ? targetUrl : null;

  response.set('Cache-Control', 'no-store');
  response.json({
    success: true,
    route: !isBot && destinationUrl ? 'target' : 'safe',
    destinationUrl: !isBot ? destinationUrl : null,
    slug,
    reason: isBot ? 'automated-client' : destinationUrl ? 'eligible-client' : 'target-not-configured',
  });

  void clientIp;
  void referrer;
});

app.use(handleMiddlewareError);

app.listen(port, '0.0.0.0', () => {
  console.log(`Traffic Director listening on port ${port}`);
});

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
