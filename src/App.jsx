import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Showreel } from './Scene.js';
import StudioDock from './components/StudioDock.jsx';
import MotionDesignChapters from './components/MotionDesignChapters.jsx';
import NeonPulseChapters from './components/NeonPulseChapters.jsx';
import HeaderNav from './components/HeaderNav.jsx';
import TemplateGalleryModal from './components/TemplateGalleryModal.jsx';
import {
  NAME_LINES,
  SUBTEXT_PARTS,
  ASPECT_RATIOS,
  DEFAULT_ASPECT,
  THEMES,
  COLORS,
  TEMPLATES,
  DEFAULT_PHOTO,
  DEFAULT_HANDLE,
  DEFAULT_TAGS,
  getPerfTier,
  TOTAL_DURATION,
} from './config.js';
import { audioEngine } from './utils/audioEngine.js';
import './neonPulse.css';

export default function App() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const wordmarkRef = useRef(null);
  const subtextRef = useRef(null);
  const curtainRef = useRef(null);
  const replayRef = useRef(null);
  const strobeRef = useRef(null);
  const beamRef = useRef(null);
  const chaptersRef = useRef(null);
  const neonRef = useRef(null);
  const kineticRefs = useRef([]);
  const glyphRefs = useRef([]);

  const showreelRef = useRef(null);
  const timelineRef = useRef(null);
  const neonTimelineRef = useRef(null);
  const roRef = useRef(null);

  // Studio states (initialized from URL params if present)
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlDuration = Number(queryParams.get('duration'));
  const urlSpeed = Number(queryParams.get('speed'));
  const urlAspect = queryParams.get('aspect');
  const urlTemplate = queryParams.get('template');
  const hideDock = queryParams.get('dock') === 'hide';

  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[urlTemplate] ? urlTemplate : 'claude');
  const [totalDuration, setTotalDuration] = useState([10, 15, 20, 30].includes(urlDuration) ? urlDuration : TOTAL_DURATION);
  const [currentAspect, setCurrentAspect] = useState(ASPECT_RATIOS[urlAspect] ? urlAspect : DEFAULT_ASPECT);
  const [currentTheme, setCurrentTheme] = useState(COLORS);
  const [speed, setSpeed] = useState(urlSpeed > 0 ? urlSpeed : 1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Identity & Photo customizer states
  const [nameLines, setNameLines] = useState(NAME_LINES);
  const [subtext, setSubtext] = useState(SUBTEXT_PARTS.join(' • '));
  const [role, setRole] = useState('MOTION DESIGNER // 3D SPATIAL');
  const [handle, setHandle] = useState(DEFAULT_HANDLE);
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [photo, setPhoto] = useState(DEFAULT_PHOTO);

  // Modal & section states
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('claude'); // 'claude' | 'neon'

  const isWide = ASPECT_RATIOS[currentAspect]?.value >= 1;
  const wordmarkLines = isWide ? [nameLines.join(' ')] : nameLines;
  const subtextParts = subtext.split('•').map((s) => s.trim()).filter(Boolean);
  const fullDisplayName = nameLines.join(' ');

  const kineticWords = ['CREATE.', 'MOVE.', 'EVOLVE.', 'TRANSCEND.'];
  kineticRefs.current = [];
  glyphRefs.current = [];

  const registerGlyph = (el) => {
    if (el) glyphRefs.current.push(el);
  };

  // Build the complete motion design video edit timeline
  const setupTimeline = useCallback(() => {
    if (!showreelRef.current) return;
    const showreel = showreelRef.current;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const glyphs = glyphRefs.current;
    const chapters = chaptersRef.current;

    // Reset initial visual states
    if (curtainRef.current) gsap.set(curtainRef.current, { opacity: 0 });
    if (replayRef.current) gsap.set(replayRef.current, { opacity: 0, pointerEvents: 'none' });
    if (strobeRef.current) gsap.set(strobeRef.current, { opacity: 0 });
    if (beamRef.current) gsap.set(beamRef.current, { opacity: 0, scaleX: 0.01 });

    if (chapters) {
      if (chapters.orbital) gsap.set(chapters.orbital, { opacity: 0, scale: 0.85 });
      if (chapters.slam) gsap.set(chapters.slam, { opacity: 0, scale: 1.15 });
      if (chapters.easing) gsap.set(chapters.easing, { opacity: 0, y: 30 });
      if (chapters.geometry) gsap.set(chapters.geometry, { opacity: 0, scale: 0.85 });
      if (chapters.marquee) gsap.set(chapters.marquee, { opacity: 0 });
      if (chapters.split) gsap.set(chapters.split, { opacity: 0, scale: 0.92 });
      if (chapters.outro) gsap.set(chapters.outro, { opacity: 0, scale: 1.1 });
    }

    if (wordmarkRef.current) gsap.set(wordmarkRef.current, { opacity: 0 });
    if (subtextRef.current) gsap.set(subtextRef.current, { opacity: 0 });

    showreel.cameraRoll = 0;
    showreel.waveAmp = 0;
    showreel.ribbonAmp = 0;
    showreel.coreScale = 0.001;
    if (showreel.core) showreel.core.material.opacity = 0;
    if (showreel.flare) showreel.flare.material.opacity = 0;
    if (showreel.waveMatrix) showreel.waveMatrix.material.opacity = 0;
    if (showreel.sineRibbon) showreel.sineRibbon.material.opacity = 0;
    if (showreel.rippleGroup) {
      showreel.ripples.forEach((r) => { r.material.opacity = 0; });
    }
    if (showreel.structures) {
      showreel.structures.forEach((s) => {
        s.scale.setScalar(0.001);
        s.userData.edgeMat.opacity = 0;
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onUpdate: () => {
        const normalized = tl.time() / 30;
        setCurrentTime(normalized * totalDuration);
      },
      onStart: () => {
        setIsPlaying(true);
      },
      onComplete: () => {
        setIsPlaying(false);
        if (replayRef.current) {
          gsap.to(replayRef.current, { opacity: 1, duration: 0.5, pointerEvents: 'auto' });
        }
      },
    });

    // ============================================================
    // ACT 1: 0.0 – 3.2s · RADIAL IDENTITY & CONCENTRIC ORBITALS
    // ============================================================
    tl.call(() => audioEngine.playIgnite(), null, 0)
      .fromTo(strobeRef.current, { opacity: 0.7 }, { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0)
      .fromTo(beamRef.current, { opacity: 0, scaleX: 0.02 }, { opacity: 1, scaleX: 1, duration: 0.2, ease: 'power3.out' }, 0)
      .to(beamRef.current, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.2)

      .to(showreel.core.material, { opacity: 0.8, duration: 0.2 }, 0)
      .to(showreel, { coreScale: 0.12, duration: 0.3, ease: 'power3.out' }, 0)
      .to(showreel, { coreScale: 0.03, duration: 0.8, ease: 'power2.in' }, 0.3)

      // Concentric Orbital Spinning Typography Rings with User Avatar
      .fromTo(chapters.orbital,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1.0, duration: 0.65, ease: 'power3.out' }, 0.1)
      .to(chapters.orbital,
        { opacity: 0, scale: 1.15, duration: 0.25, ease: 'power2.in' }, 3.0)

      // ============================================================
      // ACT 2: 3.2 – 6.8s · TERRACOTTA KINETIC SLAM & MOTION SMEAR
      // ============================================================
      .call(() => audioEngine.playKineticTick(), null, 3.2)
      .fromTo(strobeRef.current, { opacity: 0.3 }, { opacity: 0, duration: 0.08 }, 3.2)
      .fromTo(chapters.slam,
        { opacity: 0, scale: 1.25 },
        { opacity: 1, scale: 1.0, duration: 0.35, ease: 'power4.out' }, 3.2)
      .to(chapters.slam,
        { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in' }, 6.5)

      // ============================================================
      // ACT 3: 6.8 – 12.0s · "SIX WAYS TO GET FROM A TO B" (PHYSICS)
      // ============================================================
      .call(() => audioEngine.playKineticTick(), null, 6.8)
      .fromTo(chapters.easing,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power4.out' }, 6.8)

      // Background 3D subtle wave dots
      .to(showreel.waveMatrix.material, { opacity: 0.25, duration: 1.5 }, 7.5)
      .to(showreel, { waveAmp: 0.35, duration: 2.0 }, 7.5)

      .to(chapters.easing,
        { opacity: 0, y: -25, duration: 0.35, ease: 'power2.in' }, 11.7)

      // ============================================================
      // ACT 4: 12.0 – 16.0s · COBALT BLUE GEOMETRIC MORPH & BOUNDS
      // ============================================================
      .call(() => audioEngine.playKineticTick(), null, 12.0)
      .fromTo(chapters.geometry,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1.0, duration: 0.45, ease: 'back.out(1.4)' }, 12.0)
      .to(chapters.geometry,
        { opacity: 0, scale: 1.15, duration: 0.35, ease: 'power2.in' }, 15.6)

      // ============================================================
      // ACT 5: 16.0 – 21.0s · 3D TRAPCODE WAVE SEA & WIREFRAME GEOSPHERE
      // ============================================================
      .call(() => audioEngine.playTunnelWarp(), null, 15.8)
      // Rise of 3D Particle Wave Matrix (2,304 dots)
      .to(showreel.waveMatrix.material, { opacity: 0.95, duration: 1.0 }, 16.0)
      .to(showreel, { waveAmp: 0.85, duration: 2.0, ease: 'sine.out' }, 16.0)
      // Floating 3D Oscilloscope Sine Ribbon
      .to(showreel.sineRibbon.material, { opacity: 0.9, duration: 1.0 }, 16.2)
      .to(showreel, { ribbonAmp: 0.9, duration: 2.0 }, 16.2)
      // Concentric Radar Rings
      .to(showreel.ripples.map((r) => r.material), { opacity: 0.6, stagger: 0.1, duration: 0.8 }, 16.4)

      // 3D Wireframe Geosphere structure
      .to(showreel.structures[0].scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'back.out(1.3)' }, 16.0)
      .to(showreel.structures[0].userData.edgeMat, { opacity: 0.9, duration: 0.8 }, 16.0)

      // Dynamic Camera sweep and Dutch Angle Roll
      .to(showreel.camera.position, { z: 1.8, y: -0.15, duration: 4.5, ease: 'power2.inOut' }, 16.0)
      .to(showreel, { cameraRoll: -0.065, duration: 2.2, ease: 'sine.inOut' }, 16.0)
      .to(showreel, { cameraRoll: 0, duration: 2.0, ease: 'sine.inOut' }, 18.5)

      // Calm 3D elements before Act 6
      .to(showreel.structures[0].scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.5 }, 20.6)
      .to(showreel.waveMatrix.material, { opacity: 0.15, duration: 0.6 }, 20.6)
      .to(showreel.sineRibbon.material, { opacity: 0, duration: 0.5 }, 20.6)

      // ============================================================
      // ACT 6: 21.0 – 24.0s · ACID LIME MULTI-ROW MARQUEE
      // ============================================================
      .call(() => audioEngine.playKineticTick(), null, 21.0)
      .fromTo(chapters.marquee,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' }, 21.0)
      .to(chapters.marquee,
        { opacity: 0, duration: 0.25, ease: 'power2.in' }, 23.7)

      // ============================================================
      // ACT 7: 24.0 – 26.5s · 4-PANEL SYNCHRONIZED SPLIT-SCREEN MATRIX
      // ============================================================
      .call(() => audioEngine.playKineticTick(), null, 24.0)
      .fromTo(chapters.split,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1.0, duration: 0.35, ease: 'power4.out' }, 24.0)
      .to(chapters.split,
        { opacity: 0, scale: 1.08, duration: 0.3, ease: 'power2.in' }, 26.2)

      // ============================================================
      // ACT 8: 26.5 – 30.0s · THE GRAND SWISS EDITORIAL MASTER OUTRO
      // ============================================================
      .call(() => audioEngine.playWordmarkLock(), null, 26.5)
      .fromTo(strobeRef.current, { opacity: 0.7 }, { opacity: 0, duration: 0.2, ease: 'power2.out' }, 26.5)
      .fromTo(beamRef.current, { opacity: 0, scaleX: 0.02 }, { opacity: 0.95, scaleX: 1, duration: 0.18, ease: 'power3.out' }, 26.5)
      .to(beamRef.current, { opacity: 0, duration: 0.4, ease: 'power1.in' }, 26.7)

      // Full Swiss Master Outro Card with User Avatar Badge
      .fromTo(chapters.outro,
        { opacity: 0, scale: 1.15, y: 15 },
        { opacity: 1, scale: 1.0, y: 0, duration: 0.65, ease: 'power4.out' }, 26.5)

      .to(curtainRef.current, { opacity: 1, duration: 0.6, ease: 'power2.in' }, 29.4);

    // Apply speed scale & duration scaling
    const durationRatio = 30 / totalDuration;
    tl.timeScale(speed * durationRatio);
    timelineRef.current = tl;
    window.__timeline = tl;
    window.__showreel = showreel;
  }, [speed, totalDuration]);

  // Boot showreel after fonts are ready
  useEffect(() => {
    let active = true;

    document.fonts.ready.then(() => {
      if (!active || !canvasRef.current || !stageRef.current) return;

      const tier = getPerfTier();
      const initialAspect = ASPECT_RATIOS[currentAspect]?.value || ASPECT_RATIOS[DEFAULT_ASPECT].value;
      document.documentElement.style.setProperty('--stage-ratio', initialAspect);
      const showreel = new Showreel(canvasRef.current, {
        tier,
        aspect: initialAspect,
        theme: currentTheme,
        photo,
        template: activeTemplate,
      });
      showreel.mount();
      showreelRef.current = showreel;

      const ro = new ResizeObserver(() => showreel.resize());
      ro.observe(stageRef.current);
      roRef.current = ro;

      setupTimeline();
    });

    return () => {
      active = false;
      if (roRef.current) roRef.current.disconnect();
      if (timelineRef.current) timelineRef.current.kill();
      if (showreelRef.current) showreelRef.current.dispose();
      audioEngine.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-link timeline whenever wordmark, duration, speed or template changes
  useEffect(() => {
    if (showreelRef.current) {
      setupTimeline();
    }
  }, [nameLines, subtext, totalDuration, activeTemplate, setupTimeline]);

  // Dock & Header Control Handlers (universal for both reels)
  const handleTogglePlay = () => {
    const tl = activeSection === 'neon' ? neonTimelineRef.current : timelineRef.current;
    if (!tl) return;
    audioEngine.ensureContext();
    if (tl.isActive()) {
      tl.pause();
      setIsPlaying(false);
    } else {
      if (tl.progress() >= 1) {
        tl.restart();
      } else {
        tl.resume();
      }
      setIsPlaying(true);
    }
  };

  const handleToggleAudio = () => {
    audioEngine.ensureContext();
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleSeek = (time) => {
    const tl = activeSection === 'neon' ? neonTimelineRef.current : timelineRef.current;
    if (!tl) return;
    audioEngine.ensureContext();
    const masterTime = (time / totalDuration) * 30;
    tl.seek(masterTime);
    setCurrentTime(time);
  };

  const handleRestart = () => {
    const tl = activeSection === 'neon' ? neonTimelineRef.current : timelineRef.current;
    if (!tl) return;
    audioEngine.ensureContext();
    if (replayRef.current) {
      gsap.to(replayRef.current, { opacity: 0, duration: 0.25, pointerEvents: 'none' });
    }
    tl.restart();
    setIsPlaying(true);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    const tl = activeSection === 'neon' ? neonTimelineRef.current : timelineRef.current;
    if (tl) {
      const durationRatio = 30 / totalDuration;
      tl.timeScale(newSpeed * durationRatio);
    }
  };

  const handleDurationChange = (newDuration) => {
    setTotalDuration(newDuration);
    setTimeout(() => {
      handleRestart();
    }, 50);
  };

  const handleAspectChange = (aspectKey) => {
    setCurrentAspect(aspectKey);
    const ratio = ASPECT_RATIOS[aspectKey].value;
    document.documentElement.style.setProperty('--stage-ratio', ratio);
    if (showreelRef.current) {
      showreelRef.current.setAspect(ratio);
    }
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    document.documentElement.style.setProperty('--bg-0', newTheme.cssBg0);
    document.documentElement.style.setProperty('--bg-1', newTheme.cssBg1);
    document.documentElement.style.setProperty('--accent', newTheme.cssAccent);
    document.documentElement.style.setProperty('--accent-soft', newTheme.cssAccentSoft);
    document.documentElement.style.setProperty('--champagne', newTheme.cssChampagne);
    document.documentElement.style.setProperty('--ink', newTheme.cssInk);

    if (showreelRef.current) {
      showreelRef.current.setTheme(newTheme);
    }
  };

  const handleSelectTemplate = (templateId) => {
    setActiveTemplate(templateId);
    const tplThemeMap = {
      claude: THEMES.terracotta,
      cyber3d: THEMES.indigo,
      acid: THEMES.acid,
      luxury: THEMES.solar,
      physics2d: THEMES.cobalt,
    };
    if (tplThemeMap[templateId]) {
      handleThemeChange(tplThemeMap[templateId]);
    }
    if (showreelRef.current) {
      showreelRef.current.setTemplate(templateId);
    }
    setTimeout(() => {
      handleRestart();
    }, 60);
  };

  const handlePhotoChange = (newPhoto) => {
    setPhoto(newPhoto);
    if (showreelRef.current) {
      showreelRef.current.updatePhoto(newPhoto);
    }
  };

  const handleUpdateIdentity = ({ lines, role: newRole, handle: newHandle, tags: newTags, photo: newPhoto }) => {
    setNameLines(lines);
    if (newRole) setRole(newRole);
    if (newHandle) setHandle(newHandle);
    if (newTags) setTags(newTags);
    if (newPhoto) handlePhotoChange(newPhoto);

    if (showreelRef.current) {
      showreelRef.current.updateWordmark(lines);
    }

    setTimeout(() => {
      handleRestart();
    }, 60);
  };

  // --- Neon Pulse Timeline Setup (Full 3D WebGL + Sound + GSAP) ---
  const setupNeonTimeline = useCallback(() => {
    if (!neonRef.current) return;
    const np = neonRef.current;
    const showreel = showreelRef.current;

    if (neonTimelineRef.current) {
      neonTimelineRef.current.kill();
    }

    // Reset neon visual components
    if (np.boot) gsap.set(np.boot, { opacity: 0 });
    if (np.glitch) gsap.set(np.glitch, { opacity: 0 });
    if (np.radar) gsap.set(np.radar, { opacity: 0 });
    if (np.grid) gsap.set(np.grid, { opacity: 0 });
    if (np.burst) gsap.set(np.burst, { opacity: 0, scale: 0.8 });
    if (np.feed) gsap.set(np.feed, { opacity: 0 });
    if (np.holo) gsap.set(np.holo, { opacity: 0, scale: 1.05 });

    // Reset Swiss overlays
    if (wordmarkRef.current) gsap.set(wordmarkRef.current, { opacity: 0 });
    if (subtextRef.current) gsap.set(subtextRef.current, { opacity: 0 });
    if (strobeRef.current) gsap.set(strobeRef.current, { opacity: 0 });
    if (beamRef.current) gsap.set(beamRef.current, { opacity: 0, scaleX: 0.01 });
    if (curtainRef.current) gsap.set(curtainRef.current, { opacity: 0 });
    if (replayRef.current) gsap.set(replayRef.current, { opacity: 0, pointerEvents: 'none' });

    // Reset 3D elements
    if (showreel) {
      showreel.cameraRoll = 0;
      showreel.waveAmp = 0;
      showreel.ribbonAmp = 0;
      showreel.coreScale = 0.001;
      if (showreel.core) showreel.core.material.opacity = 0;
      if (showreel.waveMatrix) showreel.waveMatrix.material.opacity = 0;
      if (showreel.sineRibbon) showreel.sineRibbon.material.opacity = 0;
      if (showreel.ripples) {
        showreel.ripples.forEach((r) => { r.material.opacity = 0; });
      }
      if (showreel.structures) {
        showreel.structures.forEach((s) => {
          s.scale.setScalar(0.001);
          s.userData.edgeMat.opacity = 0;
        });
      }
    }

    const ntl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onUpdate: () => {
        const normalized = ntl.time() / 30;
        setCurrentTime(normalized * totalDuration);
      },
      onStart: () => setIsPlaying(true),
      onComplete: () => {
        setIsPlaying(false);
        if (replayRef.current) {
          gsap.to(replayRef.current, { opacity: 1, duration: 0.5, pointerEvents: 'auto' });
        }
      },
    });

    // ================================================================
    // NP ACT 1: 0.0–4.0s · DATA STREAM BOOT (Matrix cascade + 3D particles)
    // ================================================================
    ntl.call(() => audioEngine.playCyberPulse(), null, 0)
      .to(np.boot, { opacity: 1, duration: 0.3 }, 0)
      .fromTo(strobeRef.current, { opacity: 0.6 }, { opacity: 0, duration: 0.15 }, 0)
      .fromTo(beamRef.current, { opacity: 0, scaleX: 0.05 }, { opacity: 0.9, scaleX: 1, duration: 0.2 }, 0)
      .to(beamRef.current, { opacity: 0, duration: 0.3 }, 0.2)
      .to(np.boot, { opacity: 0, duration: 0.3 }, 3.7)

    // ================================================================
    // NP ACT 2: 4.0–8.5s · GLITCH NAME REVEAL (RGB split slam + Dutch camera roll)
    // ================================================================
      .call(() => audioEngine.playGlitchStutter(), null, 4.0)
      .call(() => audioEngine.playNeonDrop(), null, 4.15)
      .fromTo(np.glitch, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 4.0)
      .fromTo(strobeRef.current, { opacity: 0.8 }, { opacity: 0, duration: 0.18 }, 4.0)
      // 3D camera glitch shake
      .to(showreel, { cameraRoll: 0.08, duration: 0.1 }, 4.0)
      .to(showreel, { cameraRoll: -0.06, duration: 0.15 }, 4.1)
      .to(showreel, { cameraRoll: 0, duration: 0.3 }, 4.25)
      .to(np.glitch, { opacity: 0, duration: 0.3 }, 8.2)

    // ================================================================
    // NP ACT 3: 8.5–13.0s · RADAR SCAN DASHBOARD (HUD stats + 3D wave matrix)
    // ================================================================
      .call(() => audioEngine.playCyberPulse(), null, 8.5)
      .fromTo(np.radar, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 8.5)
      // 3D background wave radar
      .to(showreel.waveMatrix.material, { opacity: 0.65, duration: 1.0 }, 8.5)
      .to(showreel, { waveAmp: 0.6, duration: 2.0 }, 8.5)
      .to(showreel.ripples.map((r) => r.material), { opacity: 0.4, stagger: 0.12, duration: 0.8 }, 8.8)
      .to(np.radar, { opacity: 0, duration: 0.3 }, 12.7)

    // ================================================================
    // NP ACT 4: 13.0–17.5s · NEON GRID HORIZON (Wireframe perspective + 3D Geosphere)
    // ================================================================
      .call(() => audioEngine.playNeonArp(), null, 13.0)
      .fromTo(np.grid, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 13.0)
      // 3D Wireframe structure spin
      .to(showreel.structures[0].scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1.2, ease: 'back.out(1.4)' }, 13.0)
      .to(showreel.structures[0].userData.edgeMat, { opacity: 0.85, duration: 0.6 }, 13.0)
      .to(showreel.sineRibbon.material, { opacity: 0.8, duration: 0.8 }, 13.2)
      .to(showreel, { ribbonAmp: 0.8, duration: 1.5 }, 13.2)
      .to(showreel.structures[0].scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.4 }, 17.1)
      .to(showreel.sineRibbon.material, { opacity: 0, duration: 0.4 }, 17.1)
      .to(np.grid, { opacity: 0, duration: 0.4 }, 17.1)

    // ================================================================
    // NP ACT 5: 17.5–21.5s · PARTICLE BURST (3D Core burst + reform)
    // ================================================================
      .call(() => audioEngine.playNeonDrop(), null, 17.5)
      .fromTo(strobeRef.current, { opacity: 0.7 }, { opacity: 0, duration: 0.2 }, 17.5)
      .to(showreel.core.material, { opacity: 0.9, duration: 0.2 }, 17.5)
      .to(showreel, { coreScale: 0.18, duration: 0.35, ease: 'power4.out' }, 17.5)
      .to(showreel, { coreScale: 0.04, duration: 1.2, ease: 'power2.in' }, 17.85)
      .fromTo(np.burst, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 }, 17.5)
      .to(np.burst, { opacity: 0, duration: 0.35 }, 21.15)

    // ================================================================
    // NP ACT 6: 21.5–25.5s · SURVEILLANCE FEED GRID (6-panel matrix)
    // ================================================================
      .call(() => audioEngine.playGlitchStutter(), null, 21.5)
      .fromTo(np.feed, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 21.5)
      .to(showreel.waveMatrix.material, { opacity: 0.2, duration: 0.5 }, 21.5)
      .to(np.feed, { opacity: 0, duration: 0.3 }, 25.2)

    // ================================================================
    // NP ACT 7: 25.5–30.0s · HOLOGRAPHIC IDENTITY CARD (Cinematic Outro)
    // ================================================================
      .call(() => audioEngine.playNeonResolve(), null, 25.5)
      .fromTo(strobeRef.current, { opacity: 0.5 }, { opacity: 0, duration: 0.25 }, 25.5)
      .fromTo(np.holo, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 25.5)
      .to(curtainRef.current, { opacity: 1, duration: 0.6, ease: 'power2.in' }, 29.4);

    neonTimelineRef.current = ntl;
    window.__timeline = ntl;
    window.__showreel = showreel;

    const durationRatio = 30 / totalDuration;
    ntl.timeScale(speed * durationRatio);
    ntl.play(0);
  }, [totalDuration, speed]);

  const handleSwitchSection = useCallback((section) => {
    setActiveSection(section);
    if (timelineRef.current) { timelineRef.current.kill(); timelineRef.current = null; }
    if (neonTimelineRef.current) { neonTimelineRef.current.kill(); neonTimelineRef.current = null; }
    if (replayRef.current) gsap.set(replayRef.current, { opacity: 0, pointerEvents: 'none' });
    setTimeout(() => {
      if (section === 'neon') setupNeonTimeline();
      else setupTimeline();
    }, 100);
  }, [setupTimeline, setupNeonTimeline]);

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      {/* Top Header Navigation with Dual Video Reel Switcher */}
      {!hideDock && (
        <HeaderNav
          activeTemplate={activeTemplate}
          activeSection={activeSection}
          onSwitchSection={handleSwitchSection}
          onOpenTemplates={() => setIsTemplatesModalOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onExport={() => {
            setIsCustomizerOpen(true);
          }}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* Main Cinema Stage Wrap */}
      <div className="stage-wrap" ref={stageRef}>
        <canvas className="stage-canvas" ref={canvasRef} />

        {/* Cinema Director Viewfinder & Technical HUD */}
        <div className="cinema-viewfinder">
          <div className="vf-corner tl" />
          <div className="vf-corner tr" />
          <div className="vf-corner bl" />
          <div className="vf-corner br" />

          <div className="cinema-hud-top">
            <span className="rec-indicator">
              <span className="rec-dot" />
              REC ● 4K 60FPS
            </span>
            <span>SHUTTER: 180° // ISO 800</span>
          </div>

          <div className="cinema-hud-bottom">
            <span>35MM ANAMORPHIC // 2.39:1</span>
            <span>AI MOTION PIPELINE</span>
          </div>
        </div>

        {/* Dynamic Strobe Flash & Anamorphic Lens Flare Line */}
        <div className="strobe-flash" ref={strobeRef} />
        <div className="anamorphic-beam" ref={beamRef} />

        {/* Motion Chapters — Claude Swiss Kinetic (visible when activeSection === 'claude') */}
        {activeSection === 'claude' && (
          <MotionDesignChapters
            ref={chaptersRef}
            name={fullDisplayName}
            role={role}
            handle={handle}
            tags={tags}
            photo={photo}
            template={activeTemplate}
          />
        )}

        {/* Motion Chapters — Neon Pulse Cyberpunk Glitch (visible when activeSection === 'neon') */}
        {activeSection === 'neon' && (
          <NeonPulseChapters
            ref={neonRef}
            name={fullDisplayName}
            role={role}
            handle={handle}
            tags={tags}
            photo={photo}
          />
        )}

        {/* Swiss Kinetic Wordmark Overlay (visible only for Swiss Kinetic) */}
        {activeSection === 'claude' && (
          <div className="overlay">
            {kineticWords.map((word, i) => (
              <div
                key={word}
                className="kinetic-word"
                ref={(el) => { kineticRefs.current[i] = el; }}
              >
                {word}
              </div>
            ))}

            <div className="wordmark" ref={wordmarkRef}>
              {wordmarkLines.map((line, li) => (
                <div className="wordmark-line" key={`${line}-${li}`}>
                  {line.split('').map((ch, ci) =>
                    ch === ' ' ? (
                      <span key={ci} className="glyph space" ref={registerGlyph}>&nbsp;</span>
                    ) : (
                      <span key={ci} className="glyph" ref={registerGlyph}>{ch}</span>
                    )
                  )}
                </div>
              ))}

              <div className="subtext" ref={subtextRef}>
                {subtextParts.map((part, i) => (
                  <React.Fragment key={part}>
                    {i > 0 && <span className="dot">•</span>}
                    <span>{part}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="stage-vignette" />
        <div className="stage-grain" />
        <div className="curtain" ref={curtainRef} />

        <button
          className="replay-btn"
          ref={replayRef}
          onClick={handleRestart}
          aria-label="Replay"
        >
          Replay ↻
        </button>
      </div>

      {/* Floating Studio Dock (hidden in record mode) */}
      {!hideDock && (
        <StudioDock
          timeline={activeSection === 'neon' ? neonTimelineRef.current : timelineRef.current}
          currentTime={currentTime}
          totalDuration={totalDuration}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          onRestart={handleRestart}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          currentAspect={currentAspect}
          onAspectChange={handleAspectChange}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          nameLines={nameLines}
          subtext={subtext}
          role={role}
          handle={handle}
          tags={tags}
          photo={photo}
          activeTemplate={activeTemplate}
          activeSection={activeSection}
          onSwitchSection={handleSwitchSection}
          onSelectTemplate={handleSelectTemplate}
          onUpdateIdentity={handleUpdateIdentity}
          onDurationChange={handleDurationChange}
          onPhotoChange={handlePhotoChange}
          canvasRef={canvasRef}
          isCustomizerOpen={isCustomizerOpen}
          setIsCustomizerOpen={setIsCustomizerOpen}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* Template Gallery Library Modal */}
      <TemplateGalleryModal
        isOpen={isTemplatesModalOpen}
        activeTemplate={activeTemplate}
        onSelectTemplate={handleSelectTemplate}
        onClose={() => setIsTemplatesModalOpen(false)}
      />
    </div>
  );
}
