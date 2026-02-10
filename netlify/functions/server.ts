import serverless from "serverless-http";
import { createApp } from "../../server/_core/index";

// Initialize the app and wrap it for serverless
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
  return fn(event, context);
};
