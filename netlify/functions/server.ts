import serverless from "serverless-http";
import { createApp } from "../../server/_core/index";

let handlerInstance: any;

const init = (async () => {
  // Build the Express app. Do not call listen(); serverless-http wraps it.
  const { app } = await createApp();
  handlerInstance = serverless(app as any);
  return handlerInstance;
})();

export async function handler(event: any, context: any) {
  // Wait for app initialization
  const fn = await init;
  
  // Ensure the path is correct for the Express app (should be /api/...)
  if (!event.rawPath.startsWith("/api")) {
    event.rawPath = `/api${event.rawPath}`;
    event.requestContext.http.rawPath = `/api${event.requestContext.http.rawPath}`;
  }
  
  return fn(event, context);
}
