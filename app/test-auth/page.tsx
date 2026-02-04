"use client";

import { signInWithGoogle, signOut, useSession } from "@/lib/auth-client";

export default function TestAuthPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Auth Test Page</h1>

      {session ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-600">Signed in as: {session.user.email}</p>
          <p>Name: {session.user.name}</p>
          <button
            onClick={() => signOut()}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">Not signed in</p>
          <button
            onClick={() => signInWithGoogle()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Sign in with Google
          </button>
          <p className="text-sm text-gray-500">
            Only @asu.edu emails are allowed
          </p>
        </div>
      )}
    </div>
  );
}
