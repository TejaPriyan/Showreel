import puppeteer from 'puppeteer';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const OUT_DIR = path.join(rootDir, 'out');
const FRAMES_DIR = path.join(OUT_DIR, 'frames');
const OUTPUT_MP4 = path.join(OUT_DIR, 'teja-priyan-9-16-10s.mp4');
const AUDIO_WAV = path.join(OUT_DIR, 'audio.wav');

const WIDTH = 720;
const HEIGHT = 1280;
const FPS = 30;
const DURATION_REAL = 10.0; // Exact 10 seconds showreel at 1x normal speed
const TOTAL_FRAMES = Math.round(FPS * DURATION_REAL); // 300 frames

async function main() {
  console.log(`\n======================================================`);
  console.log(`🎬 RECORDING TEJA PRIYAN SHOWREEL (9:16, 1x SPEED, 10s)`);
  console.log(`======================================================`);
  console.log(`Resolution : ${WIDTH}x${HEIGHT} (9:16 Vertical)`);
  console.log(`Duration   : ${DURATION_REAL} Seconds (Full 1x Speed)`);
  console.log(`Frame Rate : ${FPS} FPS (${TOTAL_FRAMES} frames total)`);
  console.log(`FFmpeg Path: ${ffmpegPath}\n`);

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });

  console.log('1/4 Launching Chromium browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--force-color-profile=srgb',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

  const url = 'http://localhost:5173/?aspect=9:16&duration=10&speed=1&dock=hide';
  console.log(`2/4 Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait for web fonts and WebGL canvas to settle
  await page.evaluate(() => document.fonts?.ready);
  await new Promise((r) => setTimeout(r, 1500));

  // Synthesize synchronized studio audio track using OfflineAudioContext in the page
  console.log('3/4 Synthesizing synchronized stereo audio track (10 seconds)...');
  const wavBytes = await page.evaluate(async (sampleRate = 44100, duration = 10.0) => {
    const totalSamples = Math.floor(sampleRate * duration);
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    // 0.0s: 808 Sub-bass Kick Drop (Ignition)
    const kickOsc = offlineCtx.createOscillator();
    const kickGain = offlineCtx.createGain();
    kickOsc.frequency.setValueAtTime(260, 0);
    kickOsc.frequency.exponentialRampToValueAtTime(36, 0.55);
    kickGain.gain.setValueAtTime(0.95, 0);
    kickGain.gain.exponentialRampToValueAtTime(0.001, 0.85);
    kickOsc.connect(kickGain);
    kickGain.connect(offlineCtx.destination);
    kickOsc.start(0);
    kickOsc.stop(0.85);

    // High sizzle spark at 0.04s
    const sizzle = offlineCtx.createBufferSource();
    const sBuffer = offlineCtx.createBuffer(1, Math.floor(sampleRate * 0.3), sampleRate);
    const sData = sBuffer.getChannelData(0);
    for (let i = 0; i < sData.length; i++) sData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.08));
    sizzle.buffer = sBuffer;
    const sFilter = offlineCtx.createBiquadFilter();
    sFilter.type = 'highpass';
    sFilter.frequency.setValueAtTime(2200, 0);
    sizzle.connect(sFilter);
    sFilter.connect(offlineCtx.destination);
    sizzle.start(0.02);

    // Chapter Ticks at key transitions: 1.1s (Orbitals), 2.2s (Slam), 4.5s (Easing), 6.5s (Geometry), 7.8s (Marquee)
    [1.1, 2.2, 4.5, 6.5, 7.8].forEach((t) => {
      const tick = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      tick.frequency.setValueAtTime(480, t);
      tick.frequency.exponentialRampToValueAtTime(75, t + 0.08);
      g.gain.setValueAtTime(0.55, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      tick.connect(g);
      g.connect(offlineCtx.destination);
      tick.start(t);
      tick.stop(t + 0.1);
    });

    // 5.5s - 7.5s: Cyber Riser Sweep (3D Wave Sea)
    const riserOsc = offlineCtx.createOscillator();
    const riserGain = offlineCtx.createGain();
    riserOsc.type = 'sawtooth';
    riserOsc.frequency.setValueAtTime(105, 5.5);
    riserOsc.frequency.exponentialRampToValueAtTime(780, 7.4);
    riserGain.gain.setValueAtTime(0.02, 5.5);
    riserGain.gain.linearRampToValueAtTime(0.38, 7.3);
    riserGain.gain.exponentialRampToValueAtTime(0.001, 7.6);
    riserOsc.connect(riserGain);
    riserGain.connect(offlineCtx.destination);
    riserOsc.start(5.5);
    riserOsc.stop(7.6);

    // 8.5s - 10.0s: Master Finale Wordmark Lock (Sub Drop + Anvil Clank + Chimes)
    const subOsc = offlineCtx.createOscillator();
    const subGain = offlineCtx.createGain();
    subOsc.frequency.setValueAtTime(140, 8.5);
    subOsc.frequency.exponentialRampToValueAtTime(30, 9.8);
    subGain.gain.setValueAtTime(0.95, 8.5);
    subGain.gain.exponentialRampToValueAtTime(0.001, 10.0);
    subOsc.connect(subGain);
    subGain.connect(offlineCtx.destination);
    subOsc.start(8.5);
    subOsc.stop(10.0);

    const anvil = offlineCtx.createOscillator();
    const anvilG = offlineCtx.createGain();
    anvil.type = 'triangle';
    anvil.frequency.setValueAtTime(880, 8.5);
    anvil.frequency.exponentialRampToValueAtTime(220, 8.75);
    anvilG.gain.setValueAtTime(0.45, 8.5);
    anvilG.gain.exponentialRampToValueAtTime(0.001, 8.8);
    anvil.connect(anvilG);
    anvilG.connect(offlineCtx.destination);
    anvil.start(8.5);
    anvil.stop(8.8);

    const rendered = await offlineCtx.startRendering();

    // Encode to 16-bit Stereo WAV format
    const channels = rendered.numberOfChannels;
    const numSamples = rendered.length;
    const buffer = new ArrayBuffer(44 + numSamples * channels * 2);
    const view = new DataView(buffer);

    const writeStr = (off, s) => {
      for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * channels * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * channels * 2, true);

    const l = rendered.getChannelData(0);
    const r = rendered.getChannelData(1);
    let off = 44;
    for (let i = 0; i < numSamples; i++) {
      const sL = Math.max(-1, Math.min(1, l[i]));
      view.setInt16(off, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
      off += 2;
      const sR = Math.max(-1, Math.min(1, r[i]));
      view.setInt16(off, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
      off += 2;
    }
    return Array.from(new Uint8Array(buffer));
  });

  await writeFile(AUDIO_WAV, Buffer.from(wavBytes));
  console.log(`  Audio saved to: ${AUDIO_WAV}`);

  // Frame capture loop
  console.log(`4/4 Capturing ${TOTAL_FRAMES} frames at ${FPS} FPS...`);
  const frameIntervalSec = 1 / FPS;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i * frameIntervalSec;

    await page.evaluate((timeSec, dur) => {
      if (window.__timeline) {
        window.__timeline.pause();
        const masterTime = (timeSec / dur) * 30;
        window.__timeline.seek(masterTime, true);
      }
    }, t, DURATION_REAL);

    // Wait for Three.js render loop and DOM repaint
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

    const frameFile = path.join(FRAMES_DIR, `frame_${String(i).padStart(5, '0')}.jpg`);
    await page.screenshot({ path: frameFile, type: 'jpeg', quality: 92 });

    if (i % 25 === 0 || i === TOTAL_FRAMES - 1) {
      const progress = Math.round(((i + 1) / TOTAL_FRAMES) * 100);
      console.log(`  Progress: ${progress}% (Frame ${i + 1}/${TOTAL_FRAMES} @ t=${t.toFixed(2)}s)`);
    }
  }

  await browser.close();
  console.log('\nAll frames captured. Encoding broadcast MP4 via FFmpeg...');

  await new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(FRAMES_DIR, 'frame_%05d.jpg'),
      '-i', AUDIO_WAV,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'fast',
      '-crf', '18',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-shortest',
      '-movflags', '+faststart',
      OUTPUT_MP4,
    ];

    const proc = spawn(ffmpegPath, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
    proc.on('error', reject);
  });

  console.log(`\n🎉 SUCCESS! Video exported to:\n${OUTPUT_MP4}\n`);
}

main().catch((err) => {
  console.error('Recording failed:', err);
  process.exit(1);
});
