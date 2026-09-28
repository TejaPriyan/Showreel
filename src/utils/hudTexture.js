import * as THREE from 'three';

// ---------------------------------------------------------------------------
// High-Definition Holographic HUD Textures (1024x640)
// Designed for crystal-clear readability, balance, and futuristic elegance.
// ---------------------------------------------------------------------------

export function createHudTexture(cardIndex = 0, colorHex = '#6c7bff') {
  const w = 1024;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Deep dark glass background
  ctx.fillStyle = 'rgba(6, 8, 14, 0.72)';
  ctx.fillRect(0, 0, w, h);

  // Outer border with subtle glow
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Precision corner brackets
  const bLen = 32;
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  // Top-left
  ctx.moveTo(12, 12 + bLen); ctx.lineTo(12, 12); ctx.lineTo(12 + bLen, 12);
  // Top-right
  ctx.moveTo(w - 12 - bLen, 12); ctx.lineTo(w - 12, 12); ctx.lineTo(w - 12, 12 + bLen);
  // Bottom-left
  ctx.moveTo(12, h - 12 - bLen); ctx.lineTo(12, h - 12); ctx.lineTo(12 + bLen, h - 12);
  // Bottom-right
  ctx.moveTo(w - 12 - bLen, h - 12); ctx.lineTo(w - 12, h - 12); ctx.lineTo(w - 12, h - 12 - bLen);
  ctx.stroke();

  // Top header rule
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, 100); ctx.lineTo(w - 36, 100);
  ctx.moveTo(36, h - 70); ctx.lineTo(w - 36, h - 70);
  ctx.stroke();

  // Draw card-specific HUD graphic
  switch (cardIndex % 4) {
    case 0:
      drawMotionWaveform(ctx, w, h, colorHex);
      break;
    case 1:
      drawAiNeuralGraph(ctx, w, h, colorHex);
      break;
    case 2:
      drawPrecisionReticle(ctx, w, h, colorHex);
      break;
    case 3:
    default:
      drawSystemDiagnostics(ctx, w, h, colorHex);
      break;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// Card 0: Motion Dynamics & Sound Waveform
function drawMotionWaveform(ctx, w, h, col) {
  // Title & Tag
  ctx.fillStyle = col;
  ctx.font = '700 26px "Space Grotesk", sans-serif';
  ctx.fillText('01 // MOTION DYNAMICS', 40, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px monospace';
  ctx.fillText('60.0 FPS // SYNCHRONIZED', w - 320, 68);

  // Equalizer Bars
  const bars = 28;
  const startX = 40;
  const barW = 20;
  const gap = 12;
  const baseY = 420;

  ctx.fillStyle = col;
  for (let i = 0; i < bars; i++) {
    const norm = Math.sin(i * 0.28) * 0.5 + 0.5;
    const barH = 30 + norm * 200;
    ctx.fillRect(startX + i * (barW + gap), baseY - barH, barW, barH);
  }

  // Luminous sine wave through the center
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  for (let x = 40; x < w - 40; x += 6) {
    const y = baseY + 40 + Math.sin(x * 0.025) * 22;
    if (x === 40) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Footer status
  ctx.fillStyle = 'rgba(217, 198, 160, 0.9)';
  ctx.font = '600 18px monospace';
  ctx.fillText('● SYSTEM STATUS: REALTIME 3D REEL PIPELINE', 40, h - 34);
}

// Card 1: Neural AI Network & Tensor Inference
function drawAiNeuralGraph(ctx, w, h, col) {
  ctx.fillStyle = col;
  ctx.font = '700 26px "Space Grotesk", sans-serif';
  ctx.fillText('02 // NEURAL AI PIPELINE', 40, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px monospace';
  ctx.fillText('LATENCY: 0.8ms // ACTIVE', w - 310, 68);

  // Node graph coordinates
  const layers = [
    [{ x: 120, y: 220 }, { x: 120, y: 340 }, { x: 120, y: 460 }],
    [{ x: 340, y: 180 }, { x: 340, y: 290 }, { x: 340, y: 400 }, { x: 340, y: 500 }],
    [{ x: 600, y: 200 }, { x: 600, y: 340 }, { x: 600, y: 480 }],
    [{ x: 880, y: 340 }]
  ];

  // Draw connecting synapses
  ctx.strokeStyle = 'rgba(108, 123, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let l = 0; l < layers.length - 1; l++) {
    const fromLayer = layers[l];
    const toLayer = layers[l + 1];
    fromLayer.forEach(p1 => {
      toLayer.forEach(p2 => {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      });
    });
  }
  ctx.stroke();

  // Draw glowing nodes
  layers.forEach((layer, lIdx) => {
    layer.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, lIdx === 3 ? 12 : 8, 0, Math.PI * 2);
      ctx.fillStyle = lIdx === 3 ? '#d9c6a0' : col;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });

  // Footer status
  ctx.fillStyle = 'rgba(217, 198, 160, 0.9)';
  ctx.font = '600 18px monospace';
  ctx.fillText('● CONVERGENCE ACCURACY: 99.8% // OPTIMAL', 40, h - 34);
}

// Card 2: Spatial Coordinates & Targeting Reticle
function drawPrecisionReticle(ctx, w, h, col) {
  ctx.fillStyle = col;
  ctx.font = '700 26px "Space Grotesk", sans-serif';
  ctx.fillText('03 // SPATIAL TOPOLOGY', 40, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px monospace';
  ctx.fillText('AZIMUTH: 180° // LOCK', w - 280, 68);

  const cx = w / 2;
  const cy = h / 2 + 15;

  // Concentric radar circles
  ctx.strokeStyle = 'rgba(169, 179, 255, 0.45)';
  ctx.lineWidth = 2;
  [60, 120, 190].forEach((r) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(cx - 220, cy); ctx.lineTo(cx + 220, cy);
  ctx.moveTo(cx, cy - 210); ctx.lineTo(cx, cy + 210);
  ctx.stroke();

  // Target lock box
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(cx - 40, cy - 40, 80, 80);

  // Target indicator dot
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = col;
  ctx.fill();

  // Footer status
  ctx.fillStyle = 'rgba(217, 198, 160, 0.9)';
  ctx.font = '600 18px monospace';
  ctx.fillText('● SPATIAL TRACKING: 3-AXIS CAMERA DOLLY LOCKED', 40, h - 34);
}

// Card 3: Creative Systems Diagnostics
function drawSystemDiagnostics(ctx, w, h, col) {
  ctx.fillStyle = col;
  ctx.font = '700 26px "Space Grotesk", sans-serif';
  ctx.fillText('04 // IDENTITY BLUEPRINT', 40, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px monospace';
  ctx.fillText('GSAP // MASTER EDIT', w - 280, 68);

  const rows = [
    { name: 'ACT 1: KINETIC HOOK (0-2s)', progress: 0.95, state: 'ARMED' },
    { name: 'ACT 2: SPACE TRAVEL (2-5s)', progress: 0.85, state: 'WARP RUNNING' },
    { name: 'ACT 3: VORTEX REVEAL (5-8s)', progress: 1.0, state: 'MAGNETIC' },
    { name: 'ACT 4: HERO SHOT (8-10s)', progress: 0.9, state: 'LOCKED' },
  ];

  rows.forEach((r, i) => {
    const y = 160 + i * 85;
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 20px monospace';
    ctx.fillText(r.name, 40, y);

    // Track
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(40, y + 14, w - 260, 12);

    // Fill
    ctx.fillStyle = col;
    ctx.fillRect(40, y + 14, (w - 260) * r.progress, 12);

    ctx.fillStyle = '#d9c6a0';
    ctx.font = '700 18px monospace';
    ctx.fillText(r.state, w - 190, y + 25);
  });

  // Footer status
  ctx.fillStyle = 'rgba(217, 198, 160, 0.9)';
  ctx.font = '600 18px monospace';
  ctx.fillText('● COMPILATION STATUS: 100% OPERATIONAL', 40, h - 34);
}
