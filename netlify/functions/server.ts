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
  await init;
  return handlerInstance(event, context);
}
