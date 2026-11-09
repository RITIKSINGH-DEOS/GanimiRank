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
  color: string;
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

    // Mouse coordinates & lerped coordinates for smooth motion
    let mouse = {
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
      // Parallax rotation tilt angles (-0.35 to +0.35 radians)
      mouse.targetRotY = ((e.clientX - width / 2) / (width / 2)) * 0.35;
      mouse.targetRotX = -((e.clientY - height / 2) / (height / 2)) * 0.35;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize 3D nodes (Spherical / Toroidal cloud)
    const NUM_POINTS = 85;
    const RADIUS = Math.min(width, height) * 0.42;
    const points: Point3D[] = [];

    const colors = [
      "rgba(16, 185, 129, ", // Emerald
      "rgba(6, 182, 212, ",  // Cyan
      "rgba(147, 197, 253, ", // Soft Ice Blue
      "rgba(245, 158, 11, ", // Amber subtle
    ];

    for (let i = 0; i < NUM_POINTS; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = RADIUS * (0.4 + 0.6 * Math.cbrt(Math.random()));

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      });
    }

    const FOV = 450;
    let time = 0;

    const render = () => {
      time += 0.007;

      // Smooth damping (lerp) towards cursor position
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      mouse.rotX += (mouse.targetRotX - mouse.rotX) * 0.04;
      mouse.rotY += (mouse.targetRotY - mouse.rotY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Moving Cursor Spotlight (Low Opacity Radial Glow)
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        480
      );
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.07)");
      gradient.addColorStop(0.35, "rgba(6, 182, 212, 0.03)");
      gradient.addColorStop(0.7, "rgba(99, 102, 241, 0.015)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. 3D Rotation Matrix Calculation
      const cosY = Math.cos(mouse.rotY + time * 0.2);
      const sinY = Math.sin(mouse.rotY + time * 0.2);
      const cosX = Math.cos(mouse.rotX + Math.sin(time * 0.3) * 0.1);
      const sinX = Math.sin(mouse.rotX + Math.sin(time * 0.3) * 0.1);

      const projected: { px: number; py: number; scale: number; p: Point3D }[] = [];

      // Transform and Project each 3D point
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Subtle organic breathing animation
        const wave = Math.sin(time + p.phase) * 15;
        const curX = p.baseX + (p.baseX / RADIUS) * wave;
        const curY = p.baseY + (p.baseY / RADIUS) * wave;
        const curZ = p.baseZ + (p.baseZ / RADIUS) * wave;

        // Rotate Y (yaw)
        const x1 = curX * cosY - curZ * sinY;
        const z1 = curZ * cosY + curX * sinY;

        // Rotate X (pitch)
        const y2 = curY * cosX - z1 * sinX;
        const z2 = z1 * cosX + curY * sinX;

        // Perspective Projection
        const scale = FOV / (FOV + z2 + RADIUS * 1.3);
        const px = width / 2 + x1 * scale;
        const py = height / 2 + y2 * scale;

        projected.push({ px, py, scale, p });
      }

      // 3. Draw 3D Connection Lines (Lattice mesh)
      const MAX_DIST = 90;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.08 * ((p1.scale + p2.scale) / 2);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 4. Draw 3D Floating Nodes (Particles)
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const radius = Math.max(0.8, item.scale * 2.6);
        const alpha = Math.min(0.28, Math.max(0.04, (item.scale - 0.3) * 0.4));

        ctx.beginPath();
        ctx.arc(item.px, item.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${item.p.color}${alpha})`;
        ctx.fill();

        // Very subtle halo on larger foreground nodes
        if (item.scale > 0.85) {
          ctx.beginPath();
          ctx.arc(item.px, item.py, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${item.p.color}${alpha * 0.25})`;
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
      className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
      aria-hidden="true"
    />
  );
}
