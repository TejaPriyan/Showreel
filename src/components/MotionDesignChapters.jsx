import React, { forwardRef, useImperativeHandle, useRef } from 'react';

// ---------------------------------------------------------------------------
// Claude Opus 5.5 Max Effort Motion Design Chapters Component
// Authentic recreation of the iconic Claude motion reel:
// 1. Act 1: Radial Identity & Orbital Concentric Typography
// 2. Act 2: Terracotta Kinetic Slam & Motion Smear Streaks ("TEJA PRIYAN")
// 3. Act 3: "Six ways to get from A to B." (Physics Easing Curves & Bouncing Pucks)
// 4. Act 4: Cobalt Blue Geometric Morph & Bounding Box Telemetry
// 5. Act 5: Acid Lime / High-Voltage Multi-Strip Marquee Ribbon & Kinetic Words
// 6. Act 6: 4-Panel Split-Screen Synchronized Motion Matrix
// 7. Act 7: The Grand Swiss Editorial Master Outro (Asterisk + Metadata + Projects)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Flagship Motion Design Chapters Component
// Supports 5 distinct motion design styles (Claude, Cyber 3D, Neo Acid, Luxury, 2D Physics)
// with live photo mapping, kinetic orbital typography, physics curves, and Swiss outro.
// ---------------------------------------------------------------------------

const MotionDesignChapters = forwardRef(({
  name = 'TEJA PRIYAN',
  role = 'MOTION DESIGNER // 3D SPATIAL',
  handle = '@tejapriyan',
  tags = ['60 FPS', '120 BPM', 'CODE-DRIVEN', 'BERLIN / TOKYO'],
  photo = null,
  template = 'claude',
}, ref) => {
  const containerRef = useRef(null);
  const orbitalRef = useRef(null);
  const slamRef = useRef(null);
  const easingRef = useRef(null);
  const geometryRef = useRef(null);
  const marqueeRef = useRef(null);
  const splitRef = useRef(null);
  const outroRef = useRef(null);

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    orbital: orbitalRef.current,
    slam: slamRef.current,
    easing: easingRef.current,
    geometry: geometryRef.current,
    marquee: marqueeRef.current,
    split: splitRef.current,
    outro: outroRef.current,
  }));

  const easingCurves = [
    { id: '01', name: 'linear', desc: 'constant velocity', path: 'M 10 20 L 290 20' },
    { id: '02', name: 'ease-in-out', desc: 'smooth sine acceleration', path: 'M 10 25 Q 150 5 290 25' },
    { id: '03', name: 'expo-out', desc: 'explosive slingshot start', path: 'M 10 28 C 45 4 180 20 290 20' },
    { id: '04', name: 'back-out', desc: 'target overshoot & snap', path: 'M 10 22 C 120 26 230 4 290 22' },
    { id: '05', name: 'elastic', desc: 'spring harmonic wave', path: 'M 10 20 Q 80 4 140 26 Q 200 12 245 22 L 290 20' },
    { id: '06', name: 'bounce', desc: 'gravity ground collision', path: 'M 10 22 Q 90 4 150 22 Q 195 10 235 22 Q 265 15 290 22' },
  ];

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || 'TEJA';
  const lastName = nameParts.slice(1).join(' ') || 'PRIYAN';

  return (
    <div className={`motion-chapters-wrap template-${template}`} ref={containerRef}>
      {/* ============================================================ */}
      {/* 1. RADIAL EMBLEM & ORBITAL TYPOGRAPHY (Frame 00:00 - 00:02)   */}
      {/* ============================================================ */}
      <div className="chapter-orbital" ref={orbitalRef}>
        <div className="ch-meta-header">
          <span className="mono-tag">{name.toUpperCase()} // MOTION REEL • 2026</span>
          <span className="mono-tag">01 // IDENTITY</span>
        </div>

        <div className="orbital-svg-wrap">
          <svg viewBox="0 0 540 540" className="orbital-svg">
            <defs>
              <clipPath id="centerAvatarClip">
                <circle cx="270" cy="270" r="38" />
              </clipPath>
              <path
                id="orbitOuter"
                d="M 270, 270 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0"
              />
              <path
                id="orbitMid"
                d="M 270, 270 m -160, 0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0"
              />
              <path
                id="orbitInner"
                d="M 270, 270 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0"
              />
            </defs>

            {/* Radial coordinate circles */}
            <circle cx="270" cy="270" r="220" className="orbit-line outer" />
            <circle cx="270" cy="270" r="160" className="orbit-line mid" />
            <circle cx="270" cy="270" r="100" className="orbit-line inner" />
            <circle cx="270" cy="270" r="45" className="orbit-line core-ring" />

            {/* Outer spinning text (CW) */}
            <text className="orbit-text outer">
              <textPath href="#orbitOuter" startOffset="0%">
                {`${name.toUpperCase()} • MOTION DESIGN • 2026 • DIGITAL IDENTITY • 3D SPATIAL • `}
              </textPath>
            </text>

            {/* Mid spinning text (CCW) */}
            <text className="orbit-text mid">
              <textPath href="#orbitMid" startOffset="0%">
                EVERY FRAME ON PURPOSE • EVERY FRAME IS CODE • RHYTHM • TIMING • EASING •
              </textPath>
            </text>

            {/* Inner spinning text (CW) */}
            <text className="orbit-text inner">
              <textPath href="#orbitInner" startOffset="0%">
                LINE • COLOR • SHAPE • RHYTHM • EASING • 3D •
              </textPath>
            </text>

            {/* Center User Avatar or Asterism Star Emblem */}
            {photo ? (
              <g className="orbit-avatar-center">
                <circle cx="270" cy="270" r="41" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 5" className="spin-slow" />
                <image
                  href={photo}
                  x="232"
                  y="232"
                  width="76"
                  height="76"
                  clipPath="url(#centerAvatarClip)"
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="270" cy="270" r="38" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              </g>
            ) : (
              <g className="orbit-asterism" transform="translate(270, 270)">
                {[0, 45, 90, 135].map((deg) => (
                  <line
                    key={deg}
                    x1="-24"
                    y1="0"
                    x2="24"
                    y2="0"
                    transform={`rotate(${deg})`}
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ))}
                <circle cx="0" cy="0" r="7" className="center-orb-dot" />
              </g>
            )}
          </svg>
        </div>

        <div className="ch-meta-footer">
          <span className="mono-tag">00:00:01:14 // 60 FPS</span>
          <span className="mono-tag">120 BPM // BAR 1/8</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TERRACOTTA KINETIC SLAM & MOTION SMEAR (Frame 00:02 - 00:03) */}
      {/* ============================================================ */}
      <div className="chapter-slam" ref={slamRef}>
        <div className="ch-corners">
          <div className="vf-c tl" />
          <div className="vf-c tr" />
          <div className="vf-c bl" />
          <div className="vf-c br" />
        </div>

        <div className="ch-meta-header text-black">
          <span className="mono-tag">02 // SPEED & IMPACT</span>
          <span className="mono-tag">SHUTTER: 180° // 60 FPS</span>
        </div>

        <div className="slam-center-stage">
          {/* Motion Smear Ghost Layers */}
          <div className="smear-layer smear-2">{firstName}</div>
          <div className="smear-layer smear-1">{firstName}</div>
          <div className="smear-layer smear-main">{firstName}</div>
          <div className="slam-lastname">{lastName}</div>
          <div className="slam-motto">EVERY FRAME ON PURPOSE.</div>
        </div>

        <div className="ch-meta-footer text-black">
          <span className="mono-tag">CODED IN REAL-TIME</span>
          <span className="mono-tag">900 FRAMES // #01-175</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. SIX WAYS TO GET FROM A TO B (Physics Easing Curves)         */}
      {/* ============================================================ */}
      <div className="chapter-easing" ref={easingRef}>
        <div className="easing-card-swiss">
          <div className="easing-top-row">
            <h2 className="easing-title">Six ways to get from A to B.</h2>
            <div className="easing-telemetry">
              <span>SAME DISTANCE // SAME DURATION (1.2S)</span>
              <span className="fps-badge">60 FPS</span>
            </div>
          </div>

          <div className="easing-tracks-list">
            {easingCurves.map((curve, idx) => (
              <div className="easing-track-row" key={curve.id}>
                <div className="track-label-col">
                  <span className="track-num">{curve.id}</span>
                  <span className="track-name">{curve.name}</span>
                </div>

                <div className="track-stage">
                  <div className="track-baseline" />
                  <div className={`puck puck-${idx}`} />
                  <div className={`puck-trail puck-trail-${idx}`} />
                </div>

                <div className="track-metric-col">
                  <span className="track-desc">{curve.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="easing-footer-row">
            <span>00:00:04:12</span>
            <span>VELOCITY CURVE STUDY // INTERPOLATION</span>
            <span>120 BPM • BAR 2/8</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. COBALT BLUE GEOMETRIC MORPH & BOUNDING BOX (Frame 00:06)   */}
      {/* ============================================================ */}
      <div className="chapter-geometry" ref={geometryRef}>
        <div className="ch-meta-header text-white">
          <span className="mono-tag">04 // GEOMETRY & BOUNDS</span>
          <span className="mono-tag">SHAPE: SQUARE // ROT: 335.5°</span>
        </div>

        <div className="geometry-center-stage">
          <div className="bounding-box-graphic">
            <div className="dim-handle tl" />
            <div className="dim-handle tr" />
            <div className="dim-handle bl" />
            <div className="dim-handle br" />

            <div className="dim-tag top-tag">[ 1872 × 842 PX ]</div>

            <div className="morphing-shape-wrap">
              <svg viewBox="0 0 200 200" className="shape-svg">
                <circle cx="100" cy="100" r="88" className="guide-circle" />
                <rect x="36" y="36" width="128" height="128" rx="20" className="dynamic-squircle" />
                <path d="M 100 25 L 175 160 L 25 160 Z" className="dynamic-triangle" />
                <line x1="100" y1="10" x2="100" y2="190" className="crosshair-axis" />
                <line x1="10" y1="100" x2="190" y2="100" className="crosshair-axis" />
              </svg>
            </div>

            <div className="dim-tag bottom-tag">ROT: 335.5° // MATRIX: LOCKED</div>
          </div>
        </div>

        <div className="ch-meta-footer text-white">
          <span className="mono-tag">ISOMETRIC PROJECTION</span>
          <span className="mono-tag">SCALE: 1.000 // T: 0.84s</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. ACID LIME MULTI-LINE MARQUEE & KINETIC SLAM (Frame 00:12)  */}
      {/* ============================================================ */}
      <div className="chapter-marquee" ref={marqueeRef}>
        <div className="marquee-stack">
          <div className="marquee-row row-left row-lime">
            <span>MOTION DESIGN • 3D SPATIAL • ART DIRECTION • KINETIC TYPE • MOTION DESIGN • 3D SPATIAL •</span>
          </div>
          <div className="marquee-row row-right row-black">
            <span>{`${name.toUpperCase()} • ${name.toUpperCase()} • ${name.toUpperCase()} • ${name.toUpperCase()} •`}</span>
          </div>
          <div className="marquee-row row-center-slam">
            <div className="slam-pill">CREATE. MOVE. EVOLVE.</div>
          </div>
          <div className="marquee-row row-left row-black">
            <span>EVERY FRAME ON PURPOSE • EVERY FRAME IS CODE • EVERY FRAME ON PURPOSE •</span>
          </div>
          <div className="marquee-row row-right row-lime">
            <span>ANIMATION • TIMING • RHYTHM • EASING • INTERPOLATION • ANIMATION • TIMING •</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. 4-PANEL SYNCHRONIZED SPLIT-SCREEN MATRIX (Clip 3 Frame 12) */}
      {/* ============================================================ */}
      <div className="chapter-split" ref={splitRef}>
        <div className="split-grid-4">
          <div className="split-panel p1">
            <span className="panel-badge">01 // EASING PHYSICS</span>
            <div className="panel-inner-puck-track">
              <div className="mini-puck" />
            </div>
          </div>
          <div className="split-panel p2">
            <span className="panel-badge">02 // GEOMETRY</span>
            <div className="mini-bounding-box">
              <div className="mini-rect" />
            </div>
          </div>
          <div className="split-panel p3">
            <span className="panel-badge">03 // 3D WAVE SEA</span>
            <div className="mini-wave-dots">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="dot-wave-pip" style={{ '--i': i }} />
              ))}
            </div>
          </div>
          <div className="split-panel p4">
            <span className="panel-badge">04 // ORBITAL IDENTITY</span>
            <div className="mini-orbit-spin">
              <div className="mini-asterisk" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. THE GRAND SWISS EDITORIAL MASTER OUTRO (Claude Signature)  */}
      {/* ============================================================ */}
      <div className="chapter-outro" ref={outroRef}>
        <div className="ch-corners">
          <div className="vf-c tl" />
          <div className="vf-c tr" />
          <div className="vf-c bl" />
          <div className="vf-c br" />
        </div>

        <div className="ch-meta-header">
          <span className="mono-tag">{name.toUpperCase()} // MOTION REEL</span>
          <span className="mono-tag">07 // FINALE</span>
        </div>

        <div className="outro-card-content">
          <div className="outro-emblem-wrap">
            {photo ? (
              <div className="outro-avatar-badge">
                <img src={photo} alt={name} className="outro-avatar-img" />
                <span className="pulse-green-dot-corner" title="Available for projects" />
              </div>
            ) : (
              <div className="outro-rotating-asterisk">
                {[0, 30, 60, 90, 120, 150].map((deg) => (
                  <div
                    key={deg}
                    className="spoke"
                    style={{ transform: `rotate(${deg}deg)` }}
                  />
                ))}
              </div>
            )}
          </div>

          <h1 className="outro-big-title">
            {name.toUpperCase()}
            <span className="red-dot">.</span>
          </h1>

          <div className="outro-sub-title">{role}</div>
          {handle && <div className="outro-handle-badge">{handle}</div>}

          <div className="outro-summary-pill-bar">
            {tags.map((tag, ti) => (
              <React.Fragment key={tag}>
                {ti > 0 && <span className="sep">•</span>}
                <span>{tag}</span>
              </React.Fragment>
            ))}
          </div>

          <div className="outro-availability-pill">
            <span className="pulse-green-dot" />
            <span>AVAILABLE FOR NEW PROJECTS</span>
          </div>

          <div className="outro-bottom-motto">every frame of this reel is code.</div>
        </div>

        <div className="ch-meta-footer">
          <span className="mono-tag">00:00:30:00 // 900 FRAMES</span>
          <span className="mono-tag">BERLIN / TOKYO / WORLDWIDE</span>
        </div>
      </div>
    </div>
  );
});

export default MotionDesignChapters;
