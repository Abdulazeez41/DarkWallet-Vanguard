'use client';

/**
 * components/scene/SceneLabels.tsx
 *
 * High-performance WebGL Canvas-backed 3D Sprites for in-scene labels.
 * Replaces @react-three/drei <Html> to completely eliminate:
 *  - "Attempted to synchronously unmount a root while React was already rendering" (React 19)
 *  - Layout thrashing & DOM node sync overhead
 *  - External font network fetch errors
 */

import { useMemo } from 'react';
import * as THREE from 'three';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function createBadgeTexture(
  title: string,
  subtitle: string,
  accentColor: string,
  bgColor = '#121A2D',
  scaleGlow = false
): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture(new ImageData(1, 1) as unknown as HTMLCanvasElement);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, 512, 140);

  // Outer glow
  if (scaleGlow) {
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 24;
  }

  // Background rounded pill
  ctx.fillStyle = bgColor;
  drawRoundedRect(ctx, 16, 16, 480, 108, 20);
  ctx.fill();

  // Border outline
  ctx.shadowBlur = 0;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 16, 16, 480, 108, 20);
  ctx.stroke();

  // Primary Title
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 52);

  // Subtitle
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(subtitle, 256, 88);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function createChainBadgeTexture(
  symbol: string,
  statusText: string,
  accentColor: string,
  isSettled = false
): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture(new ImageData(1, 1) as unknown as HTMLCanvasElement);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, 360, 100);

  if (isSettled) {
    ctx.shadowColor = '#00F5A0';
    ctx.shadowBlur = 20;
  }

  // Background
  ctx.fillStyle = '#121A2D';
  drawRoundedRect(ctx, 10, 10, 340, 80, 40);
  ctx.fill();

  // Outline
  ctx.shadowBlur = 0;
  ctx.strokeStyle = isSettled ? '#00F5A0' : accentColor;
  ctx.lineWidth = isSettled ? 5 : 3;
  drawRoundedRect(ctx, 10, 10, 340, 80, 40);
  ctx.stroke();

  // Symbol
  ctx.fillStyle = isSettled ? '#00F5A0' : accentColor;
  ctx.font = '900 32px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 110, 50);

  // Status
  ctx.fillStyle = isSettled ? '#FFFFFF' : '#94A3B8';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(statusText, 220, 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

interface InSceneBadgeProps {
  position: [number, number, number];
  title: string;
  subtitle: string;
  color: string;
  isPulsing?: boolean;
  scale?: [number, number, number];
}

export function InSceneBadge({
  position,
  title,
  subtitle,
  color,
  isPulsing = false,
  scale = [1.6, 0.44, 1],
}: InSceneBadgeProps) {
  const texture = useMemo(() => {
    return createBadgeTexture(title, subtitle, color, '#121A2D', isPulsing);
  }, [title, subtitle, color, isPulsing]);

  return (
    <sprite position={position} scale={scale}>
      <spriteMaterial map={texture} transparent opacity={0.96} />
    </sprite>
  );
}

interface InSceneChainBadgeProps {
  position: [number, number, number];
  symbol: string;
  statusText: string;
  color: string;
  isSettled?: boolean;
}

export function InSceneChainBadge({
  position,
  symbol,
  statusText,
  color,
  isSettled = false,
}: InSceneChainBadgeProps) {
  const texture = useMemo(() => {
    return createChainBadgeTexture(symbol, statusText, color, isSettled);
  }, [symbol, statusText, color, isSettled]);

  return (
    <sprite position={position} scale={[1.2, 0.34, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.96} />
    </sprite>
  );
}
