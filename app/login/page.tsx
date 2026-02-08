"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { signInWithGoogle } from "@/lib/auth-client";
import { Badge, Button, Card, Heading } from "@/app/components/ui";

const DOMAIN_ERROR = "INVALID_DOMAIN";
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export default function LoginPage() {
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [domainErrorActive, setDomainErrorActive] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error");
    if (code) {
      setErrorCode(code);
      window.history.replaceState({}, "", window.location.pathname);
      if (code === DOMAIN_ERROR) {
        setDomainErrorActive(true);
        setTimeout(() => setDomainErrorActive(false), 4000);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.15}
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1.02}
        transitionSpeed={500}
        className="w-full max-w-md"
      >
        <Card gradient className="w-full">
          <div className="flex flex-col items-center gap-6">
            <Heading level="h4" animate={false}>
              ASU Claude Builder Club
            </Heading>

            <div className="flex w-full flex-col items-center gap-4">
              {errorCode && errorCode !== DOMAIN_ERROR && (
                <Badge variant="error" size="lg" className="text-center">
                  {DEFAULT_ERROR_MESSAGE}
                </Badge>
              )}

              <Button variant="primary" onClick={() => signInWithGoogle()}>
                Sign in with Google
              </Button>

              <motion.p
                animate={{
                  scale: domainErrorActive ? 1.3 : 1,
                  color: domainErrorActive
                    ? "var(--theme-text-accent)"
                    : "var(--theme-text-primary)",
                  opacity: domainErrorActive ? 1 : 0.7,
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="text-xs font-medium"
              >
                Only @asu.edu emails are allowed
              </motion.p>
            </div>
          </div>
        </Card>
      </Tilt>
    </div>
  );
}
