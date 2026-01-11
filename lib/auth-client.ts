import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// Standard Google sign-in (redirects to Google)
export const signInWithGoogle = async () => {
  return authClient.signIn.social({
    provider: "google",
  });
};

// Sign in with Google ID token (no redirect, direct sign-in)
export const signInWithGoogleIdToken = async (
  token: string,
  accessToken: string,
) => {
  return authClient.signIn.social({
    provider: "google",
    idToken: {
      token,
      accessToken,
    },
  });
};

// Re-export useful methods
export const { signOut, useSession } = authClient;
