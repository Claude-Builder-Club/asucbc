"use client";

import Tilt from "react-parallax-tilt";
import Card, { CardProps } from "./Card";

export interface TiltCardProps extends CardProps {
  glareMaxOpacity?: number;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  scale?: number;
  transitionSpeed?: number;
  tiltClassName?: string;
}

export default function TiltCard({
  glareMaxOpacity = 0.15,
  tiltMaxAngleX = 10,
  tiltMaxAngleY = 10,
  scale = 1.02,
  transitionSpeed = 500,
  tiltClassName = "",
  children,
  ...cardProps
}: TiltCardProps) {
  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={glareMaxOpacity}
      tiltMaxAngleX={tiltMaxAngleX}
      tiltMaxAngleY={tiltMaxAngleY}
      scale={scale}
      transitionSpeed={transitionSpeed}
      className={tiltClassName}
    >
      <Card {...cardProps}>{children}</Card>
    </Tilt>
  );
}
