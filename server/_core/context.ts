import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

// For Netlify Functions, we work with raw headers instead of Express req
export interface ContextRequest {
  headers: Record<string, string | string[] | undefined>;
  cookies?: string;
}

export interface ContextResponse {
  headers: Map<string, string>;
}

export type TrpcContext = {
  req: ContextRequest;
  res: ContextResponse;
  user: User | null;
};

export async function createContext(req: ContextRequest): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Create an Express-like request object for sdk.authenticateRequest
    const mockReq = {
      headers: req.headers,
      cookies: parseCookies(req.headers["cookie"] as string),
    } as any;
    user = await sdk.authenticateRequest(mockReq);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req,
    res: { headers: new Map() },
    user,
  };
}

function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, val] = cookie.trim().split("=");
      acc[key] = decodeURIComponent(val || "");
      return acc;
    },
    {} as Record<string, string>
  );
}
