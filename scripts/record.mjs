#!/usr/bin/env node
/**
 * Frame-accurate video export for the TEJA PRIYAN showreel.
 *
 * Why this exists: screen-recording a live WebGL/GSAP animation only looks
 * as smooth as the machine doing the recording. This script instead drives
 * a *virtual* clock inside the page — it overrides requestAnimationFrame
 * and performance.now() before any app code runs, then steps that virtual
 * clock forward one exact frame at a time, screenshotting after each step.
 * The result is perfectly smooth output at whatever fps/resolution you ask
 * for, independent of how fast (or slow) the capturing machine is.
 *
 * Usage:
 *   npm install --save-dev puppeteer
 *   npm run build                      # produces dist/
 *   npm run preview -- --port 4173 &   # serve dist/ locally
 *   node scripts/record.mjs            # writes out/teja-priyan.mp4
 *
 * Requires ffmpeg on PATH for the final encode (frame PNGs are kept in
 * out/frames if you'd rather encode them yourself).
 *
 * Flags (all optional):
 *   --url       page to capture           (default http://localhost:4173)
 *   --fps       output frame rate         (default 30)
 *   --duration  seconds to capture        (default 10)
 *   --width     output pixel width        (default 1080)
 *   --height    output pixel height       (default 1920)
 *   --out       output mp4 path           (default out/teja-priyan.mp4)
 */
import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

const URL = arg('url', 'http://localhost:4173');
const FPS = Number(arg('fps', 30));
const DURATION = Number(arg('duration', 10));
const WIDTH = Number(arg('width', 1080));
const HEIGHT = Number(arg('height', 1920));
const OUT = arg('out', 'out/teja-priyan.mp4');
const FRAMES_DIR = path.join(path.dirname(OUT), 'frames');
const TOTAL_FRAMES = Math.round(FPS * DURATION);

async function main() {
  let puppeteer;
  try {
    ({ default: puppeteer } = await import('puppeteer'));
  } catch {
    console.error(
      '\nPuppeteer is not installed. Run: npm install --save-dev puppeteer\n'
    );
    process.exit(1);
  }

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });

  console.log(`Launching headless Chrome — ${WIDTH}x${HEIGHT} @ ${FPS}fps, ${DURATION}s (${TOTAL_FRAMES} frames)`);
  const browser = await puppeteer.launch({
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--force-color-profile=srgb'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

  // Installed BEFORE any page script runs, so Three.js's clock and GSAP's
  // ticker both read our virtual time instead of the real wall clock.
  await page.evaluateOnNewDocument(() => {
    let virtualNow = 0;
    const rafCallbacks = [];
    window.__setVirtualTime = (t) => { virtualNow = t; };
    window.__flushFrame = () => {
      const due = rafCallbacks.splice(0, rafCallbacks.length);
      due.forEach((cb) => cb(virtualNow));
    };
    window.requestAnimationFrame = (cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    };
    window.cancelAnimationFrame = () => {};
    const perf = window.performance;
    Object.defineProperty(perf, 'now', { value: () => virtualNow, configurable: true });
  });

  await page.goto(URL, { waitUntil: 'networkidle0' });
  // Let webfonts settle so the very first captured frame is correct.
  await page.evaluate(() => document.fonts && document.fonts.ready);

  const msPerFrame = 1000 / FPS;
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i * msPerFrame;
    // Two flushes: one to let the app register this frame's RAF callback
    // chain, one to actually run it at the target virtual time.
    await page.evaluate((time) => { window.__setVirtualTime(time); window.__flushFrame(); }, t);
    await page.evaluate((time) => { window.__setVirtualTime(time); window.__flushFrame(); }, t);
    const frameFile = path.join(FRAMES_DIR, `frame_${String(i).padStart(5, '0')}.png`);
    await page.screenshot({ path: frameFile });
    if (i % FPS === 0) console.log(`  captured t=${(t / 1000).toFixed(1)}s`);
  }

  await browser.close();
  console.log('Encoding with ffmpeg…');

  await mkdir(path.dirname(OUT), { recursive: true });
  await run('ffmpeg', [
    '-y',
    '-framerate', String(FPS),
    '-i', path.join(FRAMES_DIR, 'frame_%05d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '16',
    '-movflags', '+faststart',
    OUT,
  ]);

  console.log(`\nDone → ${OUT}`);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
    p.on('error', reject);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
