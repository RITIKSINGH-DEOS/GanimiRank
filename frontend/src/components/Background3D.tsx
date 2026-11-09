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
  size: number;
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

    // Mouse coordinates with smooth damping (lerp)
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
      // Parallax 3D camera tilt angles (-0.26 to +0.26 radians)
      mouse.targetRotY = ((e.clientX - width / 2) / (width / 2)) * 0.26;
      mouse.targetRotX = -((e.clientY - height / 2) / (height / 2)) * 0.26;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // 3D Constellation Nodes (Visible, balanced, crisp white)
    const NUM_POINTS = 125;
    const points: Point3D[] = [];

    const SPAN_X = Math.max(width * 1.15, 1400);
    const SPAN_Y = Math.max(height * 1.15, 900);
    const SPAN_Z = 750;

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
        size: Math.random() * 0.6 + 1.0,
        speed: Math.random() * 0.35 + 0.45,
      });
    }

    const FOV = 550;
    let time = 0;

    const render = () => {
      time += 0.0055;

      // Smooth damping (lerp) towards cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
      mouse.rotX += (mouse.targetRotX - mouse.rotX) * 0.04;
      mouse.rotY += (mouse.targetRotY - mouse.rotY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient White Spotlight following Cursor
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        520
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.07)");
      gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.022)");
      gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.006)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. 3D Camera Rotation Matrix
      const cosY = Math.cos(mouse.rotY + time * 0.12);
      const sinY = Math.sin(mouse.rotY + time * 0.12);
      const cosX = Math.cos(mouse.rotX + Math.sin(time * 0.18) * 0.05);
      const sinX = Math.sin(mouse.rotX + Math.sin(time * 0.18) * 0.05);

      const projected: { px: number; py: number; scale: number; p: Point3D; alpha: number }[] = [];

      // Transform and Project each 3D point
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Organic floating wave motion
        const curX = p.baseX + Math.sin(time * p.speed + p.phase) * 14;
        const curY = p.baseY + Math.cos(time * p.speed + p.phase) * 14;
        const curZ = p.baseZ + Math.sin(time * 0.45 + p.phase) * 20;

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

        // Balanced depth alpha: clearly visible, but elegant (0.15 to 0.65)
        const depthAlpha = Math.min(0.65, Math.max(0.15, scale * 0.75));

        projected.push({ px, py, scale, p, alpha: depthAlpha });
      }

      // 3. Draw 3D Geometric Connecting Lines (Visible Silver-White Mesh)
      const MAX_DIST = 115;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const lineAlpha = (1 - dist / MAX_DIST) * 0.14 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 4. Draw 3D Star Nodes (Crisp, visible white starlight points)
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        // Radius between 1.0px and 2.0px (clean starlight points, never huge discs)
        const radius = Math.min(2.0, Math.max(1.0, item.p.size * item.scale * 1.3));

        ctx.beginPath();
        ctx.arc(item.px, item.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${item.alpha})`;
        ctx.fill();

        // Subtle gleam on foreground stars
        if (item.scale > 0.8) {
          ctx.beginPath();
          ctx.arc(item.px, item.py, radius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${item.alpha * 0.12})`;
          ctx.fill();
        }
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
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
