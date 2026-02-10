import serverless from "serverless-http";
import { createApp } from "../../server/_core/index";

let handler: any;

(async () => {
  // Build the Express app. Do not call listen(); serverless-http wraps it.
  const { app } = await createApp();
  handler = serverless(app as any);
})();

export { handler };
