// You're importing a component that needs useRef. It only works in a Client Component but none of its parents are marked with "use client"
"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import { drawParticleTime } from "./particle";

export default function ParticleTime() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initCanvas = (canvas: HTMLCanvasElement) => {
    // canvas.width = window.innerWidth * devicePixelRatio
    // canvas.height = window.innerHeight * devicePixelRatio
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  const start = (canvas: HTMLCanvasElement) => {
    drawParticleTime(canvas);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initCanvas(canvas);
      start(canvas);
    }
  }, []);

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef}></canvas>
    </main>
  );
}
