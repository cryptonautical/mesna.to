import serverless from "serverless-http";
import { createApp } from "../../server/_core/index";

let handler: any;

const initApp = async () => {
  if (!handler) {
    const { app } = await createApp();
    handler = serverless(app);
  }
  return handler;
};

// Netlify function handler
export default async (event: any, context: any) => {
  const fn = await initApp();
  
  // Netlify redirects /api/* to /.netlify/functions/server/:splat
  // So rawPath becomes just the :splat part without /api
  // We need to restore the /api prefix for Express routing
  if (event.rawPath && !event.rawPath.startsWith("/api")) {
    event.rawPath = `/api${event.rawPath}`;
  }
  if (event.requestContext?.http?.rawPath && !event.requestContext.http.rawPath.startsWith("/api")) {
    event.requestContext.http.rawPath = `/api${event.requestContext.http.rawPath}`;
  }
  
  return fn(event, context);
};
