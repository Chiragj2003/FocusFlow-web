import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';

export async function POST(req: Request) {
  try {
    // Authenticate the incoming request from the mobile app
    // The mobile app must send its Clerk JWT token in the Authorization header
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    
    // Generate a secure one-time use sign-in token valid for 60 seconds
    const signInToken = await clerk.signInTokens.createSignInToken({ 
      userId, 
      expiresInSeconds: 60 
    });

    // Clerk's generate URL logic
    // The signInToken.url will be a Clerk-hosted URL that authenticates the browser session
    // and then redirects to the application's root dashboard.
    return NextResponse.json({ 
      success: true, 
      url: signInToken.url 
    });

  } catch (error) {
    console.error('Error generating mobile handoff token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
