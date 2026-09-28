// Rasterizes the wordmark to an offscreen canvas and returns normalized
// (-1..1) point coordinates for every "ink" pixel. Used only to give the
// particle system a silhouette to converge into — the crisp, guaranteed-
// readable text itself is always the real HTML layer on top (see
// TypographyOverlay.jsx), so this sampling never needs to be pixel-exact.
export function sampleWordmarkPoints(lines, count, { canvasW = 1200, canvasH = 900 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSize = Math.floor(canvasH * 0.34);
  ctx.font = `700 ${fontSize}px "Space Grotesk", "Arial", sans-serif`;

  const lineGap = fontSize * 1.02;
  const startY = canvasH / 2 - ((lines.length - 1) * lineGap) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, canvasW / 2, startY + i * lineGap);
  });

  const { data } = ctx.getImageData(0, 0, canvasW, canvasH);
  const candidates = [];
  const step = 2; // sample every Nth pixel for speed
  for (let y = 0; y < canvasH; y += step) {
    for (let x = 0; x < canvasW; x += step) {
      const alpha = data[(y * canvasW + x) * 4 + 3];
      if (alpha > 120) candidates.push(x, y);
    }
  }

  const points = new Float32Array(count * 2);
  if (candidates.length === 0) return points;

  for (let i = 0; i < count; i++) {
    const idx = (Math.floor(Math.random() * (candidates.length / 2)) * 2);
    const x = candidates[idx];
    const y = candidates[idx + 1];
    points[i * 2] = (x / canvasW) * 2 - 1;      // -1..1
    points[i * 2 + 1] = -((y / canvasH) * 2 - 1); // flip Y for 3D space
  }
  return points;
}
