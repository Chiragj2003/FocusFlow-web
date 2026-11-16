import { NextRequest, NextResponse } from 'next/server';

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

// Global in-memory cache for rate limiting
// Note: In a serverless environment (like Vercel), this state is kept per-lambda instance.
// For true global rate limiting, Redis (Upstash) is recommended. This provides basic DoS protection.
const rateLimitMap = new Map<string, RateLimitTracker>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute per IP/User

/**
 * Basic in-memory rate limiter
 * @param request NextRequest to extract IP or headers
 * @param identifier Custom identifier (e.g., userId) to rate limit against.
 * @returns An error response if rate limited, or null if allowed.
 */
export function checkRateLimit(request: NextRequest, identifier?: string): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
  const key = identifier ? `user_${identifier}` : `ip_${ip}`;

  const now = Date.now();
  const tracker = rateLimitMap.get(key);

  if (!tracker) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return null; // Allowed
  }

  // If window has passed, reset
  if (now > tracker.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return null; // Allowed
  }

  // If within window, increment count
  tracker.count += 1;

  if (tracker.count > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: 'Too Many Requests', details: 'Rate limit exceeded. Please try again later.' },
      { 
        status: 429, 
        headers: { 
          'Retry-After': Math.ceil((tracker.resetTime - now) / 1000).toString() 
        } 
      }
    );
  }

  return null; // Allowed
}
