import { Handler } from '@netlify/functions';
import passport from 'passport';
import { initializeGoogleOAuth } from '../../server/_core/googleOAuth';

initializeGoogleOAuth();

const handler: Handler = async (event, context) => {
  // Start Google OAuth flow
  return {
    statusCode: 302,
    headers: {
      Location: '/.netlify/functions/google-auth-redirect',
    },
    body: '',
  };
};

export { handler };
