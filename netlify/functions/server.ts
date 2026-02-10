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
  console.log("Function invoked with path:", event.rawPath);
  
  const fn = await initApp();
  
  // The redirect rewrites /api/* to /.netlify/functions/server
  // But we need to restore the original path for Express routing
  const originalPath = event.headers["x-original-url"] || event.rawPath;
  
  if (originalPath && !originalPath.startsWith("/api")) {
    event.rawPath = `/api${originalPath}`;
  }
  if (event.requestContext?.http?.rawPath && !event.requestContext.http.rawPath.startsWith("/api")) {
    event.requestContext.http.rawPath = `/api${event.requestContext.http.rawPath}`;
  }
  
  console.log("Modified path for Express:", event.rawPath);
  
  return fn(event, context);
};
