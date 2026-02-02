import passport from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { ENV } from "./env";
import { upsertUser } from "../db";

export function initializeGoogleOAuth() {
  if (!ENV.googleClientId || !ENV.googleClientSecret) {
    console.warn(
      "[Google OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables"
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.googleClientId,
        clientSecret: ENV.googleClientSecret,
        callbackURL: ENV.isProduction 
          ? `${process.env.VITE_APP_URL || ''}/api/auth/google/callback`
          : "/api/auth/google/callback",
      },
      async (accessToken: string, refreshToken: string | undefined, profile: any, done: any) => {
        try {
          const user = {
            openId: `google-${profile.id}`,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            loginMethod: "google",
            lastSignedIn: new Date(),
          };

          await upsertUser(user);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: any) => {
    done(null, user.openId);
  });

  passport.deserializeUser(async (openId: string, done: any) => {
    try {
      const { getUserByOpenId } = await import("../db");
      const user = await getUserByOpenId(openId);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
