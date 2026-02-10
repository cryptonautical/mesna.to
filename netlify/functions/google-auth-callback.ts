import { Handler } from '@netlify/functions';

import jwt from 'jsonwebtoken';
import { ENV } from '../../server/_core/env';
import { upsertUser } from '../../server/db';

const handler: Handler = async (event, context) => {
  const url = new URL(event.rawUrl || `http://localhost:8888${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
  const code = url.searchParams.get('code');
  if (!code) {
    return {
      statusCode: 400,
      body: 'Missing code parameter',
    };
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: ENV.googleClientId,
      client_secret: ENV.googleClientSecret,
      redirect_uri: ENV.isProduction
        ? `${process.env.VITE_APP_URL || ''}/api/auth/google/callback`
        : 'http://localhost:8888/api/auth/google/callback',
      grant_type: 'authorization_code',
    }).toString(),
  });
  if (!tokenRes.ok) {
    return {
      statusCode: 500,
      body: 'Failed to exchange code for tokens',
    };
  }
  const tokenData = await tokenRes.json();
  const idToken = tokenData.id_token;
  if (!idToken) {
    return {
      statusCode: 500,
      body: 'No id_token returned',
    };
  }

  // Decode id_token to get user info
  const decoded: any = jwt.decode(idToken);
  if (!decoded || !decoded.sub) {
    return {
      statusCode: 500,
      body: 'Failed to decode id_token',
    };
  }

  // Upsert user in DB
  await upsertUser({
    openId: `google-${decoded.sub}`,
    email: decoded.email,
    name: decoded.name,
    loginMethod: 'google',
    lastSignedIn: new Date(),
  });

  // Create a session token (JWT)
  const sessionToken = jwt.sign(
    {
      openId: `google-${decoded.sub}`,
      email: decoded.email,
      name: decoded.name,
      loginMethod: 'google',
    },
    ENV.cookieSecret,
    { expiresIn: '7d' }
  );

  // Set cookie and redirect
  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': `session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      Location: '/',
    },
    body: '',
  };
};

export { handler };
