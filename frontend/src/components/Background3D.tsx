"use client";

import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  speed: number;
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with silky smooth damping (lerp)
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      rotX: 0,
      rotY: 0,
      targetRotX: 0,
      targetRotY: 0,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      // Gentle parallax 3D camera tilt (-0.18 to +0.18 radians)
      mouse.targetRotY = ((e.clientX - width / 2) / (width / 2)) * 0.18;
      mouse.targetRotX = -((e.clientY - height / 2) / (height / 2)) * 0.18;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Balanced 3D Constellation (Subtle, fine, non-distracting)
    const NUM_POINTS = 110;
    const points: Point3D[] = [];

    const SPAN_X = Math.max(width * 1.1, 1400);
    const SPAN_Y = Math.max(height * 1.1, 900);
    const SPAN_Z = 700;

    for (let i = 0; i < NUM_POINTS; i++) {
      const x = (Math.random() - 0.5) * SPAN_X;
      const y = (Math.random() - 0.5) * SPAN_Y;
      const z = (Math.random() - 0.5) * SPAN_Z;

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.3 + 0.4,
      });
    }

    const FOV = 550;
    let time = 0;

    const render = () => {
      time += 0.005;

      // Smooth damping (lerp) towards cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      mouse.rotX += (mouse.targetRotX - mouse.rotX) * 0.035;
      mouse.rotY += (mouse.targetRotY - mouse.rotY) * 0.035;

      ctx.clearRect(0, 0, width, height);

      // 1. Ultra-Subtle Ambient Cursor Spotlight (Calm Monochrome Whisper)
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        500
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.035)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.01)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. 3D Camera Rotation Matrix
      const cosY = Math.cos(mouse.rotY + time * 0.1);
      const sinY = Math.sin(mouse.rotY + time * 0.1);
      const cosX = Math.cos(mouse.rotX + Math.sin(time * 0.15) * 0.04);
      const sinX = Math.sin(mouse.rotX + Math.sin(time * 0.15) * 0.04);

      const projected: { px: number; py: number; scale: number; alpha: number }[] = [];

      // Transform and Project each 3D point
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Soft, calming floating motion
        const curX = p.baseX + Math.sin(time * p.speed + p.phase) * 12;
        const curY = p.baseY + Math.cos(time * p.speed + p.phase) * 12;
        const curZ = p.baseZ + Math.sin(time * 0.4 + p.phase) * 16;

        // Rotate Y (yaw)
        const x1 = curX * cosY - curZ * sinY;
        const z1 = curZ * cosY + curX * sinY;

        // Rotate X (pitch)
        const y2 = curY * cosX - z1 * sinX;
        const z2 = z1 * cosX + curY * sinX;

        // Perspective Projection
        const zTotal = z2 + 800;
        if (zTotal <= 50) continue;

        const scale = FOV / zTotal;
        const px = width / 2 + x1 * scale;
        const py = height / 2 + y2 * scale;

        // Soft, balanced depth alpha (0.08 to 0.35 max)
        const depthAlpha = Math.min(0.35, Math.max(0.06, scale * 0.4));

        projected.push({ px, py, scale, alpha: depthAlpha });
      }

      // 3. Delicate, Hair-Thin Connecting Lines
      const MAX_DIST = 100;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const lineAlpha = (1 - dist / MAX_DIST) * 0.05 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // 4. Subtle, Tiny Starlight Nodes (No Giant Discs!)
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        // Capped at 1.4px maximum so no irritating big balls appear
        const radius = Math.min(1.4, Math.max(0.6, item.scale * 1.1));

        ctx.beginPath();
        ctx.arc(item.px, item.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${item.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      aria-hidden="true"
    />
  );
}
