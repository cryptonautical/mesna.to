import serverless from "serverless-http";
import { createApp } from "../../server/_core/index";

// Build the Express app. Do not call listen(); serverless-http wraps it.
const { app } = createApp();

export const handler = serverless(app as any);
