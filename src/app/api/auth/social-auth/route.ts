import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, token, email, name } = body;

    // Make a request to your backend
    const response = await fetch('http://localhost:8000/auth/social-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        token,
        email,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with provider');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in social auth:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
