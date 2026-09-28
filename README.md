# SHOWREEL STUDIO — Motion Design Platform

> **A production-grade, interactive motion design platform featuring dual showreels, real-time identity & photo customization, procedural Web Audio sound design, and instant 60FPS video export.**

Built with **React**, **Three.js (WebGL)**, **GSAP**, and the **Web Audio API**.

---

## 🎬 Dual Motion Design Video Reels

Showreel Studio includes two complete, distinct motion design video reels with independent aesthetics, typography, audio synthesis, and animation choreographies:

### 1. ✦ Swiss Kinetic (Video 1 — Claude Edition)
Inspired by the iconic Claude Opus 5.5 "Max Effort" motion graphics language:
* **01 // ORBIT (0.0 – 3.2s)**: Concentric counter-rotating typographic rings around a central asterism emblem and viewfinder HUD.
* **02 // SLAM (3.2 – 6.8s)**: Bold Swiss Terracotta cut with multi-slice kinetic motion smears and metadata readouts.
* **03 // EASING (6.8 – 12.0s)**: *"Six ways to get from A to B"* with 6 simultaneous physics velocity tracks (`linear`, `ease-in-out`, `expo-out`, `back-out`, `elastic`, `bounce`).
* **04 // GEOMETRY (12.0 – 16.0s)**: Electric Cobalt Blue geometric morphs with real-time bounding box dimension indicators and angular guides.
* **05 // 3D WAVE (16.0 – 21.0s)**: 2,304-point 3D Trapcode particle wave sea, floating oscilloscope sine ribbons, and a rotating wireframe geosphere with Dutch angle camera rolls.
* **06 // MARQUEE (21.0 – 24.0s)**: Acid lime multi-row high-speed marquee ribbons with kinetic word slams (`CREATE. MOVE. EVOLVE. TRANSCEND.`).
* **07 // SPLIT (24.0 – 26.5s)**: 4-panel synchronized motion matrix.
* **08 // OUTRO (26.5 – 30.0s)**: Grand Swiss editorial master outro with spinning asterism, avatar badge, and live project availability status.

### 2. ◈ Neon Pulse (Video 2 — Cyberpunk Glitch)
A high-energy, dark futuristic cyber aesthetic:
* **01 // BOOT (0.0 – 4.0s)**: Vertical matrix rain data streams, system initialization progress bar, and CRT scan-line overlay.
* **02 // GLITCH (4.0 – 8.5s)**: Chromatic RGB split displacement slam on identity with camera jitter and screen distortion.
* **03 // RADAR (8.5 – 13.0s)**: Circular vector HUD telemetry scanner with rotating beam, live telemetry metrics (60 FPS, 128 BPM, 2.1 MS latency), and 3D wave matrix.
* **04 // GRID (13.0 – 17.5s)**: Infinite 3D perspective wireframe horizon with animated 3D geosphere structure.
* **05 // BURST (17.5 – 21.5s)**: Sonic expansion shockwaves, 3D core particle explosion and reform, centered on the user avatar.
* **06 // FEED (21.5 – 25.5s)**: 6-panel security feed monitor matrix (`ORBITAL`, `DATA FLOW`, `WAVEFORM`, `GEOMETRY`, `PARTICLES`, `IDENTITY`) with analog static noise.
* **07 // HOLO (25.5 – 30.0s)**: High-tech holographic outro card with orbiting dashed rings, blinking terminal cursor, custom tags, and a live `ONLINE // AVAILABLE FOR PROJECTS` status pip.

---

## ⚡ Features & Capabilities

* **Dual Video Reel Switcher**: Seamlessly toggle between Swiss Kinetic and Neon Pulse from the top navigation bar or the floating studio dock.
* **Floating Studio Dock**:
  * **Interactive Scrubber**: Frame-accurate timeline scrubbing with clickable Act markers (`ORBIT`, `SLAM`, `EASING`, `GEOMETRY`, `3D WAVE`, `MARQUEE`, `SPLIT`, `OUTRO` / `BOOT`, `GLITCH`, `RADAR`, `GRID`, `BURST`, `FEED`, `HOLO`).
  * **Duration Scaling**: Switch between `10s`, `15s`, `20s`, and `30s` timelines — all animations scale proportionately.
  * **Aspect Ratio Switching**: Full support for `9:16` (Vertical Stories/Reels), `16:9` (Cinematic Landscape), and `1:1` (Square).
  * **Speed Controls**: Real-time playback at `0.5x`, `1x`, `1.5x`, and `2x` speeds.
  * **Palette Theming**: Live hot-swapping between Terracotta, Indigo, Acid Lime, Solar Amber, and Cobalt Blue.
* **Live Customizer & Identity Upload**:
  * Upload custom avatar/logo photos (PNG, JPG, SVG, WebP) mapped dynamically into both 2D overlays and 3D WebGL textures.
  * Live updates for First & Last Name, Professional Role, Handle, and Tags.
  * Custom hex color picker for personal branding.
* **Procedural Sound Engine**:
  * Web Audio API synthesized 808 sub drops, cyber risers, anvil impacts, bit-crushed glitch bursts, distorted waveshaper bass drops, and celestial chime chords.
* **Direct In-Browser 60FPS Video Export**:
  * One-click client-side video rendering and direct `.mp4` / `.webm` downloads via Canvas MediaStream and Web Audio recording.

---

## 🛠 Tech Stack

* **Framework**: React 18
* **Build Tool**: Vite
* **3D & WebGL**: Three.js
* **Animation Orchestration**: GSAP (GreenSock Animation Platform)
* **Audio Synthesis**: Web Audio API (zero external audio file dependencies)
* **Styling**: Vanilla CSS with scoped design tokens & variables

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm

### Installation

```bash
# Clone the repository
git clone https://github.com/TejaPriyan/Showreel.git
cd Showreel

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

MIT License © 2026 Teja Priyan
