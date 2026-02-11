"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Heading, Text } from "../components/ui";

function RedirectContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the target URL from query parameters
    // Supports both ?url= and ?to= parameters
    const targetUrl = searchParams.get("url") || searchParams.get("to");

    if (!targetUrl) {
      setError("No redirect URL provided. Please include a ?url= or ?to= parameter.");
      return;
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch {
      setError("Invalid URL format provided.");
      return;
    }

    // Small delay to ensure Umami tracking fires
    const timer = setTimeout(() => {
      window.location.href = targetUrl;
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Heading level="h2" className="text-red-500">
            Redirect Error
          </Heading>
          <Text>{error}</Text>
          <Text className="text-sm opacity-70">
            Example: /redirect?url=https://example.com
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <Heading level="h2">Redirecting...</Heading>
        <Text>Please wait while we redirect you.</Text>
      </div>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <Heading level="h2">Loading...</Heading>
          </div>
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
