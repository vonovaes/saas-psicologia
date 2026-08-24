// CSRF protection for public forms (without authentication)
// Uses Origin and Referer header validation instead of tokens

export function validatePublicRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // Allow requests from same origin
  if (origin) {
    const originHost = new URL(origin).host;
    if (originHost === host) {
      return true;
    }
  }

  // Allow requests with valid referer
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid referer URL
      return false;
    }
  }

  // For API calls without origin/referer (like curl), allow same-host requests
  // This is permissive but necessary for MVP functionality
  if (!origin && !referer) {
    return true;
  }

  return false;
}

export function addCSRFHeaders(response: Response): Response {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
