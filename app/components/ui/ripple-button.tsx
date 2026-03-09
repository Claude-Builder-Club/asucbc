"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RippleState {
  x: number;
  y: number;
  size: number;
  key: number;
  isLeaving?: boolean;
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}

export function RippleButton({
  children,
  className = "",
  variant = "primary",
  disabled,
  ...props
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isGhost = variant === "ghost";

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isHovered || !buttonRef.current) return;
      setIsHovered(true);

      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setRipple({ x, y, size, key: Date.now() });
    },
    [isHovered]
  );

  const removeRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.target !== event.currentTarget) return;
    setIsHovered(false);
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRipple({ x, y, size, key: Date.now(), isLeaving: true });
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || !isHovered || !ripple) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setRipple((prev) => (prev ? { ...prev, x, y } : null));
    },
    [isHovered, ripple]
  );

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      className={[
        "relative flex items-center justify-center gap-1.5 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors duration-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isGhost
          ? "border border-border text-foreground hover:text-white"
          : "text-foreground hover:text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        isGhost
          ? {}
          : { border: "1.5px solid var(--theme-text-accent)" }
      }
      onMouseEnter={(e) => {
        if (e.target === e.currentTarget) createRipple(e);
      }}
      onMouseLeave={(e) => {
        if (e.target === e.currentTarget) removeRipple(e);
      }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>

      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.key}
            className="absolute rounded-full pointer-events-none z-0"
            style={{
              width: ripple.size,
              height: ripple.size,
              left: ripple.x,
              top: ripple.y,
              x: "-50%",
              y: "-50%",
              background: isGhost
                ? "rgba(128,128,128,0.15)"
                : "var(--theme-text-accent)",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: ripple.isLeaving ? 0 : 1,
              x: "-50%",
              y: "-50%",
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (ripple?.isLeaving) setRipple(null);
            }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
