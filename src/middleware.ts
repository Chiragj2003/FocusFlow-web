import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy',
  '/terms',
  '/api/webhooks(.*)',
])

const isApiRoute = createRouteMatcher(['/api/(.*)'])

// Add CORS headers to response
function addCorsHeaders(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export default clerkMiddleware(async (auth, request) => {
  // For API routes, handle CORS preflight - return immediately without auth check
  if (isApiRoute(request) && request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  // Only protect non-public, non-API routes in middleware
  // API routes handle their own auth via auth() call in route handlers
  if (!isPublicRoute(request) && !isApiRoute(request)) {
    await auth.protect()
  }

  // Add CORS headers to all API responses
  const response = NextResponse.next()
  if (isApiRoute(request)) {
    return addCorsHeaders(response)
  }
  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
