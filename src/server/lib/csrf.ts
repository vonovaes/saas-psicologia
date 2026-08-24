// Simple in-memory CSRF token store for MVP
// For production, consider using Redis or database-backed storage
const csrfTokenStore = new Map<string, { token: string; expiresAt: number }>();

export class CSRFProtection {
  private readonly tokenLifetime = 3600 * 1000; // 1 hour

  generateToken(sessionId: string): string {
    // Generate a random token using Math.random for browser compatibility
    const token = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const expiresAt = Date.now() + this.tokenLifetime;
    
    csrfTokenStore.set(sessionId, { token, expiresAt });
    
    return token;
  }

  validateToken(sessionId: string, token: string): boolean {
    const stored = csrfTokenStore.get(sessionId);
    
    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expiresAt) {
      csrfTokenStore.delete(sessionId);
      return false;
    }

    const isValid = stored.token === token;
    
    // Remove token after validation (one-time use)
    if (isValid) {
      csrfTokenStore.delete(sessionId);
    }

    return isValid;
  }

  // Cleanup expired tokens periodically
  static cleanup(): void {
    const now = Date.now();
    for (const [sessionId, data] of csrfTokenStore.entries()) {
      if (now > data.expiresAt) {
        csrfTokenStore.delete(sessionId);
      }
    }
  }
}

// Cleanup expired tokens every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => CSRFProtection.cleanup(), 10 * 60 * 1000);
}

// Generate a CSRF token for a session
export function generateCSRFToken(sessionId: string): string {
  const csrf = new CSRFProtection();
  return csrf.generateToken(sessionId);
}

// Validate a CSRF token
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const csrf = new CSRFProtection();
  return csrf.validateToken(sessionId, token);
}

// Get CSRF token from request headers
export function getCSRFTokenFromRequest(request: Request): string | null {
  const csrfToken = request.headers.get('x-csrf-token');
  if (csrfToken) return csrfToken;

  // Also check for CSRF token in body for multipart forms
  return null;
}
