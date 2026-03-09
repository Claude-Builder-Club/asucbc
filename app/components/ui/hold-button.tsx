"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";

interface HoldButtonProps {
  onConfirm?: () => void;
  holdDuration?: number;
  idleLabel?: React.ReactNode;
  holdingLabel?: React.ReactNode;
  confirmingLabel?: React.ReactNode;
  confirmedLabel?: React.ReactNode;
  className?: string;
}

export function HoldButton({
  onConfirm,
  holdDuration = 1800,
  idleLabel = (
    <>
      <RotateCcw className="w-4 h-4" />
      Submit Another Application
    </>
  ),
  holdingLabel = "Keep holding…",
  confirmingLabel = "Resetting…",
  confirmedLabel = "Ready!",
  className = "",
}: HoldButtonProps) {
  const [state, setState] = React.useState<
    "idle" | "holding" | "confirming" | "confirmed"
  >("idle");
  const [progress, setProgress] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);

  const holdTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = React.useRef<number>(0);

  const startHolding = () => {
    if (state !== "idle") return;
    setState("holding");
    setProgress(0);
    setAnimKey((k) => k + 1);
    startTimeRef.current = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(progressIntervalRef.current!);
    }, 20);

    holdTimerRef.current = setTimeout(() => {
      confirm();
    }, holdDuration);
  };

  const cancelHolding = () => {
    if (state !== "holding") return;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);
    setState("idle");
    setAnimKey((k) => k + 1);
  };

  const confirm = () => {
    setState("confirming");
    setAnimKey((k) => k + 1);
    setProgress(100);
    onConfirm?.();

    setTimeout(() => {
      setState("confirmed");
      setAnimKey((k) => k + 1);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(60);
      }
      setTimeout(() => {
        setState("idle");
        setProgress(0);
        setAnimKey((k) => k + 1);
      }, 1500);
    }, 500);
  };

  React.useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const getLabel = () => {
    switch (state) {
      case "holding":
        return holdingLabel;
      case "confirming":
        return confirmingLabel;
      case "confirmed":
        return confirmedLabel;
      default:
        return idleLabel;
    }
  };

  return (
    <button
      onMouseDown={startHolding}
      onMouseUp={cancelHolding}
      onMouseLeave={cancelHolding}
      onTouchStart={(e) => { e.preventDefault(); startHolding(); }}
      onTouchEnd={cancelHolding}
      disabled={state === "confirming"}
      className={[
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl",
        "px-6 py-2.5 text-sm font-semibold select-none",
        "transition-all duration-300",
        "disabled:pointer-events-none disabled:opacity-60",
        state === "confirmed"
          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
          : state === "holding"
          ? "scale-[0.98] cursor-grabbing border border-(--theme-text-accent)"
          : "border border-(--theme-card-border) text-(--theme-text-primary) hover:border-(--theme-text-accent) hover:text-(--theme-text-accent)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Progress fill */}
      {state === "holding" && (
        <motion.span
          key={`fill-${animKey}`}
          className="absolute inset-0 origin-left rounded-xl"
          style={{ background: "var(--theme-gradient-accent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.02, ease: "linear" }}
        />
      )}

      {/* Circular progress indicator */}
      {state === "holding" && (
        <svg
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="var(--theme-card-border)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="var(--theme-text-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress}, 100`}
            transform="rotate(-90 18 18)"
            style={{ transition: "stroke-dasharray 0.02s linear" }}
          />
        </svg>
      )}

      {/* Check icon on confirmed */}
      <AnimatePresence mode="wait">
        {state === "confirmed" && (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center"
          >
            <Check className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`label-${animKey}`}
          className="relative z-10 inline-flex items-center gap-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {getLabel()}
        </motion.span>
      </AnimatePresence>

      {/* Hint text below on idle */}
      {state === "idle" && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap pointer-events-none"
          style={{ color: "var(--theme-text-primary)" }}
        >
          hold to confirm
        </motion.span>
      )}
    </button>
  );
}
