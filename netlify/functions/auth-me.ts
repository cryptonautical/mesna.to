import { Handler } from '@netlify/functions';
import jwt from 'jsonwebtoken';
import { ENV } from '../../server/_core/env';

const handler: Handler = async (event) => {
  const cookie = event.headers.cookie || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) {
    return { statusCode: 401, body: 'Not authenticated' };
  }
  try {
    const user = jwt.verify(match[1], ENV.cookieSecret);
    return { statusCode: 200, body: JSON.stringify(user) };
  } catch {
    return { statusCode: 401, body: 'Invalid session' };
  }
};

export { handler };
