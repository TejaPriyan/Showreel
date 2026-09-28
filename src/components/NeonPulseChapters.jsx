import React, { forwardRef, useImperativeHandle, useRef } from 'react';

// ---------------------------------------------------------------------------
// NEON PULSE — Cyberpunk Glitch Motion Design Chapters
// A completely different motion style from Claude Swiss Kinetic.
//
// Visual Language:
//   - Neon cyan/magenta/electric blue palette
//   - Matrix-style data rain cascades
//   - Glitch distortion text reveals with RGB channel split
//   - Circular radar scan data visualization
//   - Neon wireframe grid horizon
//   - Holographic identity card with scan lines
//
// 7 Distinct Acts:
//   1. DATA STREAM BOOT (Matrix cascade + system initialization)
//   2. GLITCH NAME REVEAL (RGB split distortion slam)
//   3. RADAR SCAN DASHBOARD (Circular HUD + statistics)
//   4. NEON GRID HORIZON (Infinite wireframe perspective)
//   5. PARTICLE BURST & REFORM (Explosion to constellation)
//   6. MULTI-FEED SURVEILLANCE GRID (6-panel glitch matrix)
//   7. HOLOGRAPHIC IDENTITY CARD (Scan-line outro)
// ---------------------------------------------------------------------------

const NeonPulseChapters = forwardRef(({
  name = 'TEJA PRIYAN',
  role = 'MOTION DESIGNER // 3D SPATIAL',
  handle = '@tejapriyan',
  tags = ['60 FPS', '120 BPM', 'CODE-DRIVEN'],
  photo = null,
}, ref) => {
  const containerRef = useRef(null);
  const bootRef = useRef(null);
  const glitchRef = useRef(null);
  const radarRef = useRef(null);
  const gridRef = useRef(null);
  const burstRef = useRef(null);
  const feedRef = useRef(null);
  const holoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    boot: bootRef.current,
    glitch: glitchRef.current,
    radar: radarRef.current,
    grid: gridRef.current,
    burst: burstRef.current,
    feed: feedRef.current,
    holo: holoRef.current,
  }));

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || 'TEJA';
  const lastName = nameParts.slice(1).join(' ') || 'PRIYAN';

  // Matrix rain characters
  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
  const dataStreams = Array.from({ length: 12 }, (_, i) =>
    Array.from({ length: 18 }, () => matrixChars[Math.floor(Math.random() * matrixChars.length)]).join('')
  );

  // Stats for radar dashboard
  const stats = [
    { label: 'RENDER', value: '60', unit: 'FPS' },
    { label: 'TEMPO', value: '128', unit: 'BPM' },
    { label: 'LATENCY', value: '2.1', unit: 'MS' },
    { label: 'FRAMES', value: '1800', unit: 'TOT' },
  ];

  return (
    <div className="neon-chapters-wrap" ref={containerRef}>
      {/* ============================================================ */}
      {/* 1. DATA STREAM BOOT — Matrix cascade + system init           */}
      {/* ============================================================ */}
      <div className="np-chapter np-boot" ref={bootRef}>
        <div className="np-scanline-overlay" />
        <div className="np-boot-header">
          <span className="np-tag cyan">SYSTEM://BOOT</span>
          <span className="np-tag magenta">NEON_PULSE v2.0</span>
        </div>

        <div className="np-matrix-rain">
          {dataStreams.map((stream, i) => (
            <div
              key={i}
              className="np-matrix-col"
              style={{ '--col-delay': `${i * 0.12}s`, '--col-speed': `${1.5 + Math.random() * 1.5}s` }}
            >
              {stream}
            </div>
          ))}
        </div>

        <div className="np-boot-center">
          <div className="np-boot-logo">
            <span className="np-logo-bracket">[</span>
            <span className="np-logo-text">{firstName.charAt(0)}{lastName.charAt(0)}</span>
            <span className="np-logo-bracket">]</span>
          </div>
          <div className="np-boot-status">
            <span className="np-status-line">INITIALIZING MOTION ENGINE...</span>
            <div className="np-progress-bar">
              <div className="np-progress-fill" />
            </div>
          </div>
        </div>

        <div className="np-boot-footer">
          <span className="np-tag">NODE://RUNTIME</span>
          <span className="np-tag">{name.toUpperCase()} // IDENTITY LOADED</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. GLITCH NAME REVEAL — RGB split distortion slam            */}
      {/* ============================================================ */}
      <div className="np-chapter np-glitch" ref={glitchRef}>
        <div className="np-scanline-overlay" />
        <div className="np-glitch-header">
          <span className="np-tag cyan">02 // IDENTITY.DECODE</span>
          <span className="np-tag">CHANNEL: RGB_SPLIT</span>
        </div>

        <div className="np-glitch-center">
          <div className="np-glitch-name-wrap">
            <div className="np-glitch-layer np-r">{firstName}</div>
            <div className="np-glitch-layer np-g">{firstName}</div>
            <div className="np-glitch-layer np-b">{firstName}</div>
            <div className="np-glitch-layer np-main">{firstName}</div>
          </div>
          <div className="np-glitch-last">{lastName}</div>
          <div className="np-glitch-sub">
            <span className="np-blink">▌</span> {role}
          </div>
        </div>

        <div className="np-glitch-footer">
          <span className="np-tag">{handle}</span>
          <span className="np-tag">DECODE: COMPLETE</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RADAR SCAN DASHBOARD — Circular HUD + live statistics     */}
      {/* ============================================================ */}
      <div className="np-chapter np-radar" ref={radarRef}>
        <div className="np-scanline-overlay" />
        <div className="np-radar-header">
          <span className="np-tag cyan">03 // TELEMETRY</span>
          <span className="np-tag">SCAN: ACTIVE</span>
        </div>

        <div className="np-radar-center">
          <svg viewBox="0 0 300 300" className="np-radar-svg">
            <circle cx="150" cy="150" r="120" className="np-radar-ring outer" />
            <circle cx="150" cy="150" r="85" className="np-radar-ring mid" />
            <circle cx="150" cy="150" r="50" className="np-radar-ring inner" />
            <line x1="150" y1="30" x2="150" y2="270" className="np-radar-axis" />
            <line x1="30" y1="150" x2="270" y2="150" className="np-radar-axis" />
            <line x1="150" y1="150" x2="260" y2="90" className="np-radar-sweep" />
            {/* Data points */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const r = 60 + Math.random() * 50;
              const x = 150 + r * Math.cos((deg * Math.PI) / 180);
              const y = 150 + r * Math.sin((deg * Math.PI) / 180);
              return <circle key={deg} cx={x} cy={y} r="3" className="np-radar-dot" />;
            })}
          </svg>
        </div>

        <div className="np-radar-stats">
          {stats.map((s) => (
            <div key={s.label} className="np-stat-card">
              <span className="np-stat-label">{s.label}</span>
              <span className="np-stat-value">{s.value}</span>
              <span className="np-stat-unit">{s.unit}</span>
            </div>
          ))}
        </div>

        <div className="np-radar-footer">
          <span className="np-tag">MOTION TELEMETRY // LIVE</span>
          <span className="np-tag">FREQ: 128 Hz</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. NEON GRID HORIZON — Infinite wireframe perspective         */}
      {/* ============================================================ */}
      <div className="np-chapter np-grid" ref={gridRef}>
        <div className="np-grid-horizon">
          <div className="np-grid-lines">
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} className="np-h-line" style={{ '--line-i': i }} />
            ))}
          </div>
          <div className="np-grid-v-lines">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="np-v-line" style={{ '--vline-i': i }} />
            ))}
          </div>
        </div>

        <div className="np-grid-overlay-text">
          <div className="np-grid-big">{firstName}</div>
          <div className="np-grid-big outline">{lastName}</div>
          <div className="np-grid-tagline">MOTION DESIGN IN THE NEON VOID</div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. PARTICLE BURST & REFORM — Explosion to constellation      */}
      {/* ============================================================ */}
      <div className="np-chapter np-burst" ref={burstRef}>
        <div className="np-scanline-overlay" />
        <div className="np-burst-center">
          <div className="np-burst-ring ring-1" />
          <div className="np-burst-ring ring-2" />
          <div className="np-burst-ring ring-3" />
          <div className="np-burst-core">
            {photo ? (
              <img src={photo} alt={name} className="np-burst-avatar" />
            ) : (
              <span className="np-burst-icon">◆</span>
            )}
          </div>
          {/* Particle dots */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="np-particle"
              style={{
                '--p-angle': `${i * 18}deg`,
                '--p-dist': `${40 + Math.random() * 60}%`,
                '--p-delay': `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
        <div className="np-burst-text">
          <span className="np-burst-word">CREATE</span>
          <span className="np-burst-sep">×</span>
          <span className="np-burst-word">DESIGN</span>
          <span className="np-burst-sep">×</span>
          <span className="np-burst-word">EVOLVE</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. MULTI-FEED SURVEILLANCE GRID — 6-panel glitch matrix      */}
      {/* ============================================================ */}
      <div className="np-chapter np-feed" ref={feedRef}>
        <div className="np-feed-grid">
          {['ORBITAL', 'DATA FLOW', 'WAVEFORM', 'GEOMETRY', 'PARTICLES', 'IDENTITY'].map((label, i) => (
            <div key={label} className={`np-feed-panel fp-${i + 1}`}>
              <span className="np-feed-badge">CAM {String(i + 1).padStart(2, '0')}</span>
              <span className="np-feed-label">{label}</span>
              <div className="np-feed-noise" />
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. HOLOGRAPHIC IDENTITY CARD — Scan-line outro                */}
      {/* ============================================================ */}
      <div className="np-chapter np-holo" ref={holoRef}>
        <div className="np-scanline-overlay thick" />
        <div className="np-holo-card">
          <div className="np-holo-top-bar">
            <span className="np-tag cyan">IDENTITY://VERIFIED</span>
            <span className="np-tag magenta">NEON PULSE // 2026</span>
          </div>

          <div className="np-holo-avatar-wrap">
            {photo ? (
              <img src={photo} alt={name} className="np-holo-avatar-img" />
            ) : (
              <div className="np-holo-avatar-placeholder">
                <span>{firstName.charAt(0)}{lastName.charAt(0)}</span>
              </div>
            )}
            <div className="np-holo-ring" />
          </div>

          <h1 className="np-holo-name">
            <span className="np-holo-first">{firstName}</span>
            <span className="np-holo-second">{lastName}</span>
            <span className="np-holo-dot">_</span>
          </h1>

          <div className="np-holo-role">{role}</div>
          {handle && <div className="np-holo-handle">{handle}</div>}

          <div className="np-holo-tags">
            {tags.map((tag, i) => (
              <span key={tag} className="np-holo-tag-pill">{tag}</span>
            ))}
          </div>

          <div className="np-holo-status">
            <span className="np-status-pip" />
            <span>ONLINE // AVAILABLE FOR PROJECTS</span>
          </div>

          <div className="np-holo-bottom">
            <span className="np-tag">every frame is data.</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NeonPulseChapters;
