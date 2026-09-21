/**
 * 180workspace Traffic Director - Server-Side Edge Middleware
 *
 * Runs before page responses on Vercel. Static assets are excluded by the
 * matcher so they are served directly.
 */

export const config = {
  matcher: ['/((?!assets|_next|favicon.ico|.*\\..*).*)'],
};

export default async function middleware(request) {
  const ip = request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || request.headers.get('referrer') || '';
  const url = request.url;
  const backendUrl = process.env.TRAFFIC_DIRECTOR_BACKEND_URL;
  const slug = process.env.TRAFFIC_DIRECTOR_SLUG;

  if (!backendUrl || !slug) {
    return;
  }

  try {
    const res = await fetch(
      `${backendUrl.replace(/\/$/, '')}/api/v1/traffic-director/evaluate/${encodeURIComponent(slug)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientIp: ip, userAgent, referrer, url }),
        signal: AbortSignal.timeout(1200),
      },
    );

    if (res.ok) {
      const data = await res.json();

      if (data?.success && data?.route === 'target' && data?.destinationUrl) {
        if (url !== data.destinationUrl && !url.startsWith(data.destinationUrl)) {
          return Response.redirect(data.destinationUrl, 302);
        }
      }
    }
  } catch {
    // Fail open: serve the normal page if the evaluation request fails.
  }
}
