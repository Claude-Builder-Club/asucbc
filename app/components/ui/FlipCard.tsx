"use client";

import { useEffect, useState, ReactNode } from "react";
import Tilt from "react-parallax-tilt";

export interface FlipCardProps {
  /** Unique identifier for this card */
  id: string;
  /** The currently active card id (null if none) */
  activeId: string | null;
  /** Callback when the active card changes */
  setActiveId: (id: string | null) => void;
  /** Content shown on the front of the card */
  front: ReactNode;
  /** Content shown on the back of the card (when flipped) */
  back: ReactNode;
  /** Callback fired when this card is opened */
  onOpen?: () => void;
  /** Max glare opacity */
  glareMaxOpacity?: number;
  /** Scale on hover */
  scale?: number;
  /** Transition speed in ms */
  transitionSpeed?: number;
  /** Tilt angle when inactive */
  tiltMaxAngle?: number;
  /** Tilt angle when active (reduced for readability) */
  activeTiltMaxAngle?: number;
  /** Additional className for the outer Tilt wrapper */
  className?: string;
  /** className for the front container */
  frontClassName?: string;
  /** className for the back container */
  backClassName?: string;
  /** Size of the back side as a percentage string (recommended: "150%" for expanded, "100%" for same size as front) */
  backScale?: string;
}

export default function FlipCard({
  id,
  activeId,
  setActiveId,
  front,
  back,
  onOpen,
  glareMaxOpacity = 0.2,
  scale = 1.05,
  transitionSpeed = 500,
  tiltMaxAngle = 10,
  activeTiltMaxAngle = 2,
  className = "",
  frontClassName = "",
  backClassName = "",
  backScale = "100%",
}: FlipCardProps) {
  const isActive = activeId === id;
  const [flip, setFlip] = useState(false);

  // backScale is a percentage like "150%". The back container is sized to that,
  // then scaled down by 100/backScale so it visually matches the front.
  // "100%" → same size as front. "150%" (recommended) → 50% larger.
  const inverseScale = 100 / parseFloat(backScale);

  useEffect(() => {
    if (!isActive) {
      setFlip(false);
    }
  }, [isActive]);

  const handleFrontClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      setActiveId(null);
    } else {
      setActiveId(id);
      onOpen?.();
    }
    setFlip(true);
  };

  const handleBackClick = () => {
    setActiveId(null);
    setFlip(false);
  };

  return (
    <Tilt
      flipHorizontally={flip}
      glareEnable={true}
      glareMaxOpacity={glareMaxOpacity}
      scale={scale}
      transitionSpeed={transitionSpeed}
      tiltMaxAngleX={isActive ? activeTiltMaxAngle : tiltMaxAngle}
      tiltMaxAngleY={isActive ? activeTiltMaxAngle : tiltMaxAngle}
      className={`${flip ? "z-100" : activeId ? "z-0" : "z-10"} ${
        !isActive && activeId ? "grayscale blur-[2px]" : "opacity-100"
      } w-full h-full transition-all rounded-lg ${className}`}
    >
      {/* Front side */}
      <div
        className={`rounded-lg bg-(--theme-card-bg) relative shadow overflow-hidden ${
          flip
            ? "opacity-0 scale-100 md:scale-150 z-20 blur-sm pointer-events-none"
            : "opacity-100 z-0 pointer-events-auto"
        } transition-all duration-300 ${frontClassName}`}
        onClick={handleFrontClick}
      >
        {front}
      </div>

      {/* Back side */}
      <div
        style={{
          width: backScale,
          height: backScale,
          transform: `translate(-50%, -50%) ${
            flip ? `scaleX(-1) scaleY(1)` : `scale(${inverseScale})`
          }`,
        }}
        className={`absolute top-1/2 left-1/2 rounded-lg ${
          flip ? "pointer-events-auto" : "pointer-events-none"
        } ${
          flip ? "opacity-100" : "opacity-0 -z-10"
        } z-100 border border-(--theme-card-border) bg-(--theme-card-bg)/95 backdrop-blur-sm shadow-lg transition-all duration-150 ${backClassName}`}
        onClick={handleBackClick}
      >
        {back}
      </div>
    </Tilt>
  );
}
