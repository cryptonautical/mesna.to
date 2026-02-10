import { Handler } from '@netlify/functions';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? (process.env.VITE_APP_URL
      ? `${process.env.VITE_APP_URL.replace(/\/$/, '')}/api/auth/google/callback`
      : 'https://mesna.to/api/auth/google/callback')
  : 'http://localhost:8888/api/auth/google/callback';

const handler: Handler = async (event, context) => {
  if (!GOOGLE_CLIENT_ID) {
    return {
      statusCode: 500,
      body: 'Missing GOOGLE_CLIENT_ID',
    };
  }
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return {
    statusCode: 302,
    headers: {
      Location: googleAuthUrl,
    },
    body: '',
  };
};

export { handler };
