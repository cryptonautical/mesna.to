import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

export default async (request: Request) => {
  // Handle tRPC requests via fetch adapter
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => {
      return createContext({
        headers: Object.fromEntries(request.headers.entries()),
        cookies: request.headers.get("cookie") || undefined,
      });
    },
  });
};
