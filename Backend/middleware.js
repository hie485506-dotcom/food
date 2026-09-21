import cors from 'cors';
import helmet from 'helmet';

export function createSecurityMiddleware(allowedOrigins) {
  return [
    helmet(),
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Origin is not allowed'));
      },
    }),
  ];
}

export function trafficRequestContext(request, _response, next) {
  request.traffic = {
    clientIp: request.body?.clientIp || '',
    userAgent: request.body?.userAgent || request.get('user-agent') || '',
    referrer: request.body?.referrer || request.get('referer') || '',
    url: request.body?.url || '',
  };

  next();
}

export function handleMiddlewareError(error, _request, response, _next) {
  if (error.message === 'Origin is not allowed') {
    response.status(403).json({ success: false, error: 'Origin is not allowed' });
    return;
  }

  response.status(500).json({ success: false, error: 'Internal server error' });
}
