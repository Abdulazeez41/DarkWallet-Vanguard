'use client';

/**
 * components/scene/SceneLabels.tsx
 *
 * High-performance WebGL Canvas-backed 3D Sprites for in-scene labels.
 * Draws official vector logos for Bitcoin, Ethereum, Solana, and NEAR Protocol.
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

/**
 * Draws official vector Bitcoin logo on canvas
 */
function drawBitcoinSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  // Orange coin base
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#F7931A';
  ctx.fill();

  // White B symbol with double strokes
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 ${Math.round(r * 1.35)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₿', cx + 1, cy + 1);
  ctx.restore();
}

/**
 * Draws official vector Ethereum diamond on canvas
 */
function drawEthereumSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  // Blue circle base
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#627EEA';
  ctx.fill();

  const s = r * 0.75;
  // Top-left facet
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.lineTo(cx - s * 0.6, cy + s * 0.1);
  ctx.lineTo(cx, cy + s * 0.4);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();

  // Top-right facet
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.lineTo(cx + s * 0.6, cy + s * 0.1);
  ctx.lineTo(cx, cy + s * 0.4);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fill();

  // Bottom-left facet
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.5);
  ctx.lineTo(cx - s * 0.6, cy + s * 0.2);
  ctx.lineTo(cx, cy + s);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();

  // Bottom-right facet
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.5);
  ctx.lineTo(cx + s * 0.6, cy + s * 0.2);
  ctx.lineTo(cx, cy + s);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fill();

  ctx.restore();
}

/**
 * Draws official vector Solana stacked gradient bars on canvas
 */
function drawSolanaSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  // Dark circle base
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#0C0E14';
  ctx.fill();
  ctx.strokeStyle = '#253450';
  ctx.lineWidth = 2;
  ctx.stroke();

  const w = r * 1.1;
  const h = r * 0.22;
  const skew = r * 0.25;

  const grad = ctx.createLinearGradient(cx - w / 2, cy - r, cx + w / 2, cy + r);
  grad.addColorStop(0, '#00FFA3');
  grad.addColorStop(1, '#DC1FFF');
  ctx.fillStyle = grad;

  // 3 stacked angled bars
  const offsets = [-r * 0.48, 0, r * 0.48];
  offsets.forEach((dy, idx) => {
    ctx.beginPath();
    const dir = idx === 1 ? -1 : 1;
    const startX = cx - w / 2 + (dir === 1 ? 0 : skew);
    const y = cy + dy - h / 2;
    ctx.moveTo(startX, y);
    ctx.lineTo(startX + w - skew, y);
    ctx.lineTo(startX + w, y + h);
    ctx.lineTo(startX + skew, y + h);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Draws official vector NEAR geometric N logo on canvas
 */
function drawNearSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  // Black circle base with green border
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.strokeStyle = '#00EC97';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // NEAR geometric N
  ctx.fillStyle = '#00EC97';
  const s = r * 0.65;
  ctx.beginPath();
  ctx.moveTo(cx - s, cy + s);
  ctx.lineTo(cx - s, cy - s);
  ctx.lineTo(cx - s * 0.4, cy - s);
  ctx.lineTo(cx + s * 0.4, cy + s * 0.2);
  ctx.lineTo(cx + s * 0.4, cy - s);
  ctx.lineTo(cx + s, cy - s);
  ctx.lineTo(cx + s, cy + s);
  ctx.lineTo(cx + s * 0.4, cy + s);
  ctx.lineTo(cx - s * 0.4, cy - s * 0.2);
  ctx.lineTo(cx - s * 0.4, cy + s);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function createBadgeTexture(
  title: string,
  subtitle: string,
  accentColor: string,
  bgColor = '#0B1122',
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

  if (scaleGlow) {
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
  }

  // Rounded pill background
  ctx.fillStyle = bgColor;
  drawRoundedRect(ctx, 14, 14, 484, 112, 22);
  ctx.fill();

  // Border outline
  ctx.shadowBlur = 0;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 14, 14, 484, 112, 22);
  ctx.stroke();

  // Primary Title
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 50);

  // Subtitle
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px monospace';
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
  canvas.width = 420;
  canvas.height = 110;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, 420, 110);

  if (isSettled) {
    ctx.shadowColor = '#00EC97';
    ctx.shadowBlur = 24;
  }

  // Pill background
  ctx.fillStyle = '#0B1122';
  drawRoundedRect(ctx, 10, 10, 400, 90, 45);
  ctx.fill();

  // Outline
  ctx.shadowBlur = 0;
  ctx.strokeStyle = isSettled ? '#00EC97' : accentColor;
  ctx.lineWidth = isSettled ? 5 : 3;
  drawRoundedRect(ctx, 10, 10, 400, 90, 45);
  ctx.stroke();

  // Draw authentic vector logo on the left
  const logoRadius = 32;
  const logoCenterX = 56;
  const logoCenterY = 55;

  const s = symbol.toUpperCase();
  if (s.includes('BTC') || s.includes('BITCOIN')) {
    drawBitcoinSymbol(ctx, logoCenterX, logoCenterY, logoRadius);
  } else if (s.includes('ETH') || s.includes('ETHEREUM')) {
    drawEthereumSymbol(ctx, logoCenterX, logoCenterY, logoRadius);
  } else if (s.includes('SOL') || s.includes('SOLANA')) {
    drawSolanaSymbol(ctx, logoCenterX, logoCenterY, logoRadius);
  } else if (s.includes('NEAR')) {
    drawNearSymbol(ctx, logoCenterX, logoCenterY, logoRadius);
  }

  // Symbol text
  ctx.fillStyle = isSettled ? '#00EC97' : '#FFFFFF';
  ctx.font = '900 32px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 106, 55);

  // Status text on right
  ctx.fillStyle = isSettled ? '#AAFE97' : '#8F9CAE';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(statusText, 390, 55);

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
    return createBadgeTexture(title, subtitle, color, '#0B1122', isPulsing);
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
    <sprite position={position} scale={[1.4, 0.38, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.96} />
    </sprite>
  );
}
