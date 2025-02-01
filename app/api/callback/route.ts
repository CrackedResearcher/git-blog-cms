"use server"
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (state !== "INIT_GIT_AUTH") {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://git-blogger.vercel.app' 
  : 'http://localhost:3000';

  try {
    const client_id = process.env.NEXT_PUBLIC_GIT_CLIENT_ID;
    const client_secret = process.env.GIT_CLIENT_SECRET; 
    const redirectUri = `${baseUrl}/auth/callback`;

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    const cookieStore = await cookies();
    cookieStore.set('github_access_token', data.access_token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}