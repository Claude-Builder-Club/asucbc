import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { APIError } from "better-auth/api";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user: { email?: string; [key: string]: unknown }) => {
          if (!user.email?.endsWith("@asu.edu")) {
            throw new APIError("FORBIDDEN", {
              message: "Only @asu.edu email addresses are allowed to register",
            });
          }
          return { data: user };
        },
      },
    },
  },
});
