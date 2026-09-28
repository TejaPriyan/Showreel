import React, { useState, useRef } from 'react';
import { THEMES, ASPECT_RATIOS, DURATION_OPTIONS, TEMPLATES, DEFAULT_PHOTO } from '../config.js';
import { audioEngine } from '../utils/audioEngine.js';

export default function StudioDock({
  timeline,
  currentTime,
  totalDuration = 30,
  isPlaying,
  onTogglePlay,
  onSeek,
  onRestart,
  speed,
  onSpeedChange,
  currentAspect,
  onAspectChange,
  currentTheme,
  onThemeChange,
  nameLines,
  subtext,
  role = 'MOTION DESIGNER // 3D SPATIAL',
  handle = '@tejapriyan',
  tags = ['60 FPS', '120 BPM', 'CODE-DRIVEN', 'BERLIN / TOKYO'],
  photo = DEFAULT_PHOTO,
  activeTemplate = 'claude',
  activeSection = 'claude',
  onSwitchSection,
  onSelectTemplate,
  onUpdateIdentity,
  onDurationChange,
  onPhotoChange,
  canvasRef,
  isCustomizerOpen,
  setIsCustomizerOpen,
  isAudioMuted,
  onToggleAudio,
}) {
  const [isDockMinimized, setIsDockMinimized] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Form states for customizer
  const [editLine1, setEditLine1] = useState(nameLines[0] || 'TEJA');
  const [editLine2, setEditLine2] = useState(nameLines[1] || 'PRIYAN');
  const [editRole, setEditRole] = useState(role);
  const [editHandle, setEditHandle] = useState(handle);
  const [editTags, setEditTags] = useState(tags.join(' • '));
  const [previewPhoto, setPreviewPhoto] = useState(photo);
  const [customColor, setCustomColor] = useState(currentTheme.cssAccent || '#ff441f');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setPreviewPhoto(dataUrl);
        if (onPhotoChange) onPhotoChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    setPreviewPhoto(DEFAULT_PHOTO);
    if (onPhotoChange) onPhotoChange(DEFAULT_PHOTO);
  };

  const handleApplyIdentity = (e) => {
    e.preventDefault();
    const clean1 = editLine1.trim().toUpperCase() || 'TEJA';
    const clean2 = editLine2.trim().toUpperCase();
    const lines = clean2 ? [clean1, clean2] : [clean1];
    const cleanRole = editRole.trim().toUpperCase() || 'MOTION DESIGNER';
    const cleanHandle = editHandle.trim() || '@showreel';
    const cleanTags = editTags.split('•').map((t) => t.trim().toUpperCase()).filter(Boolean);

    onUpdateIdentity({
      lines,
      role: cleanRole,
      handle: cleanHandle,
      tags: cleanTags,
      photo: previewPhoto,
    });
    setIsCustomizerOpen(false);
  };

  const handleCustomColorChange = (hex) => {
    setCustomColor(hex);
    const customTheme = {
      ...currentTheme,
      id: 'custom',
      name: 'Custom Palette',
      cssAccent: hex,
      cssAccentSoft: hex,
      accent: parseInt(hex.replace('#', '0x'), 16),
      accentSoft: parseInt(hex.replace('#', '0x'), 16),
    };
    onThemeChange(customTheme);
  };

  // Instant in-browser 60FPS video recording and export
  const handleExportVideo = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      setExportProgress(0);
      audioEngine.ensureContext();
      audioEngine.setMuted(false);

      if (!canvasRef?.current) {
        setIsExporting(false);
        return;
      }

      const canvas = canvasRef.current;
      const stream = canvas.captureStream(60);

      // Connect Web Audio track to stream
      const audioDest = audioEngine.getMediaStreamDestination();
      if (audioDest && audioDest.stream) {
        audioDest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 16000000,
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const sanitizedName = (nameLines.join('-') || 'showreel').toLowerCase();
        a.download = `${sanitizedName}-motion-showreel-${totalDuration}s.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExporting(false);
      };

      recorder.start();
      onRestart();

      const interval = setInterval(() => {
        if (!timeline) return;
        const progress = Math.min(100, Math.floor((timeline.time() / totalDuration) * 100));
        setExportProgress(progress);
        if (timeline.time() >= totalDuration || !timeline.isActive()) {
          clearInterval(interval);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 200);
    } catch (err) {
      console.warn('Export error or cancelled:', err);
      setIsExporting(false);
    }
  };

  const formatTime = (secs) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs - s) * 10);
    return `00:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const progressPct = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // Dynamic Act markers tuned to Swiss Kinetic vs Neon Pulse chapters
  const swissActs = totalDuration === 30
    ? [
        { label: 'ORBIT', time: 0 },
        { label: 'SLAM', time: 3.2 },
        { label: 'EASING', time: 6.8 },
        { label: 'GEOMETRY', time: 12.0 },
        { label: '3D WAVE', time: 16.0 },
        { label: 'MARQUEE', time: 21.0 },
        { label: 'SPLIT', time: 24.0 },
        { label: 'OUTRO', time: 26.5 },
      ]
    : [
        { label: 'ORBIT', time: 0 },
        { label: 'SLAM', time: 1.1 },
        { label: 'EASING', time: 2.3 },
        { label: 'GEOMETRY', time: 4.0 },
        { label: '3D WAVE', time: 5.3 },
        { label: 'MARQUEE', time: 7.0 },
        { label: 'SPLIT', time: 8.0 },
        { label: 'OUTRO', time: 8.8 },
      ];

  const neonActs = totalDuration === 30
    ? [
        { label: 'BOOT', time: 0 },
        { label: 'GLITCH', time: 4.0 },
        { label: 'RADAR', time: 8.5 },
        { label: 'GRID', time: 13.0 },
        { label: 'BURST', time: 17.5 },
        { label: 'FEED', time: 21.5 },
        { label: 'HOLO', time: 25.5 },
      ]
    : [
        { label: 'BOOT', time: 0 },
        { label: 'GLITCH', time: 1.3 },
        { label: 'RADAR', time: 2.8 },
        { label: 'GRID', time: 4.3 },
        { label: 'BURST', time: 5.8 },
        { label: 'FEED', time: 7.2 },
        { label: 'HOLO', time: 8.5 },
      ];

  const acts = activeSection === 'neon' ? neonActs : swissActs;

  return (
    <div className={`studio-dock-container ${isDockMinimized ? 'minimized' : ''}`}>
      {/* Floating Toggle Pill when minimized */}
      <button
        className="dock-toggle-btn"
        onClick={() => setIsDockMinimized(!isDockMinimized)}
        title={isDockMinimized ? 'Expand Studio Controls' : 'Minimize Controls'}
      >
        {isDockMinimized ? '⚙ STUDIO DOCK' : '▾ HIDE'}
      </button>

      {!isDockMinimized && (
        <div className="studio-dock">
          {/* Top Row: Scrubber & Timecode */}
          <div className="dock-scrubber-row">
            <button
              className="dock-btn icon-btn"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            <button
              className="dock-btn icon-btn"
              onClick={onRestart}
              aria-label="Restart"
              title="Restart from beginning"
            >
              ↻
            </button>

            <span className="dock-timecode">
              {formatTime(currentTime)} <span className="dim">/ {formatTime(totalDuration)}</span>
            </span>

            {/* Interactive Timeline Track */}
            <div
              className="dock-track-wrap"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                onSeek(pos * totalDuration);
              }}
            >
              <div className="dock-track">
                <div className="dock-track-fill" style={{ width: `${progressPct}%` }} />
                <div className="dock-track-thumb" style={{ left: `${progressPct}%` }} />
                {acts.map((act) => (
                  <button
                    key={act.label}
                    className={`act-marker ${currentTime >= act.time ? 'passed' : ''}`}
                    style={{ left: `${(act.time / totalDuration) * 100}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(act.time);
                    }}
                    title={`Jump to: ${act.label} (${act.time}s)`}
                  >
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              className={`dock-btn audio-btn ${!isAudioMuted ? 'active' : ''}`}
              onClick={onToggleAudio}
              title={isAudioMuted ? 'Enable Sound FX & Synth' : 'Mute Sound'}
            >
              <span className="audio-icon">{isAudioMuted ? '🔇' : '🔊'}</span>
              {!isAudioMuted && (
                <span className="eq-bars">
                  <span className="eq-bar b1" />
                  <span className="eq-bar b2" />
                  <span className="eq-bar b3" />
                </span>
              )}
            </button>
          </div>

          {/* Bottom Row: Duration, Aspect, Speed, Theme & Export */}
          <div className="dock-controls-row">
            {/* Motion Style Video Switcher */}
            <div className="dock-group">
              <span className="dock-group-label">REEL</span>
              <button
                className={`dock-pill-btn ${activeSection === 'claude' ? 'active' : ''}`}
                onClick={() => onSwitchSection && onSwitchSection('claude')}
                title="Swiss Kinetic Reel (Claude style)"
              >
                ✦ Swiss
              </button>
              <button
                className={`dock-pill-btn ${activeSection === 'neon' ? 'active-neon' : ''}`}
                onClick={() => onSwitchSection && onSwitchSection('neon')}
                title="Neon Pulse Cyberpunk Reel"
              >
                ◈ Neon
              </button>
            </div>

            {/* Duration Switcher */}
            <div className="dock-group">
              <span className="dock-group-label">TIME</span>
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  className={`dock-pill-btn ${totalDuration === d ? 'active' : ''}`}
                  onClick={() => onDurationChange(d)}
                >
                  {d}s
                </button>
              ))}
            </div>

            {/* Aspect Switcher */}
            <div className="dock-group">
              <span className="dock-group-label">RATIO</span>
              {Object.keys(ASPECT_RATIOS).map((key) => (
                <button
                  key={key}
                  className={`dock-pill-btn ${currentAspect === key ? 'active' : ''}`}
                  onClick={() => onAspectChange(key)}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Speed Selector */}
            <div className="dock-group">
              <span className="dock-group-label">SPEED</span>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  className={`dock-pill-btn ${speed === s ? 'active' : ''}`}
                  onClick={() => onSpeedChange(s)}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Theme Selector + Custom Color Picker */}
            <div className="dock-group theme-group">
              <span className="dock-group-label">PALETTE</span>
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  className={`theme-dot-btn ${currentTheme.id === th.id ? 'active' : ''}`}
                  style={{ '--theme-color': th.cssAccent }}
                  onClick={() => onThemeChange(th)}
                  title={th.name}
                />
              ))}
              <label className="custom-color-picker" title="Pick Custom Accent Color">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                />
                <span className="color-pip" style={{ background: customColor }} />
              </label>
            </div>

            {/* One-Click Video Export */}
            <button
              className={`dock-btn export-btn ${isExporting ? 'recording' : ''}`}
              onClick={handleExportVideo}
              disabled={isExporting}
              title="Record and download 60FPS video file with audio"
            >
              {isExporting ? `● RECORDING (${exportProgress}%)` : '📹 EXPORT (60FPS)'}
            </button>

            {/* Direct Lossless MP4 Download */}
            <a
              href="/teja-priyan-9-16-10s.mp4"
              download="teja-priyan-showreel-10s.mp4"
              className="dock-btn mp4-link-btn"
              title="Direct Download lossless H.264 4K/1080p MP4 with synced audio"
            >
              ⬇ MP4
            </a>

            {/* Customize Identity Modal Toggle */}
            <button
              className={`dock-btn customizer-btn ${isCustomizerOpen ? 'active' : ''}`}
              onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
            >
              ✦ CUSTOMIZE
            </button>
          </div>
        </div>
      )}

      {/* Customizer Drawer / Modal */}
      {isCustomizerOpen && !isDockMinimized && (
        <div className="customizer-modal">
          <div className="customizer-header">
            <div className="cust-title-wrap">
              <h4>CUSTOMIZE SHOWREEL</h4>
              <span className="cust-badge">LIVE 60FPS</span>
            </div>
            <button className="close-btn" onClick={() => setIsCustomizerOpen(false)}>✕</button>
          </div>

          <form onSubmit={handleApplyIdentity} className="customizer-form">
            {/* Photo / Avatar Upload Section */}
            <div className="form-section-title">PROFILE PHOTO / LOGO</div>
            <div className="photo-upload-row">
              <div className="photo-preview-wrap">
                <img src={previewPhoto} alt="Avatar preview" className="photo-preview-img" />
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={handleResetPhoto}
                  title="Reset to geometric vector avatar"
                >
                  ✕
                </button>
              </div>
              <div className="photo-upload-controls">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="upload-file-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 Upload Photo / Logo
                </button>
                <span className="upload-hint">Appears in 3D holographic cards, orbital ring, & outro badge.</span>
              </div>
            </div>

            {/* Template Selector Section */}
            <div className="form-section-title">MOTION DESIGN STYLE</div>
            <div className="template-pills-row">
              {Object.values(TEMPLATES).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  className={`template-pill-select ${activeTemplate === tpl.id ? 'active' : ''}`}
                  onClick={() => {
                    if (onSelectTemplate) onSelectTemplate(tpl.id);
                  }}
                >
                  <span>{tpl.icon}</span>
                  <span>{tpl.name}</span>
                </button>
              ))}
            </div>

            {/* Typography & Identity Section */}
            <div className="form-section-title">IDENTITY & BRANDING</div>
            <div className="form-grid-2">
              <div className="form-row">
                <label>First Name (Line 1)</label>
                <input
                  type="text"
                  value={editLine1}
                  maxLength={12}
                  onChange={(e) => setEditLine1(e.target.value)}
                  placeholder="TEJA"
                />
              </div>
              <div className="form-row">
                <label>Last Name (Line 2)</label>
                <input
                  type="text"
                  value={editLine2}
                  maxLength={12}
                  onChange={(e) => setEditLine2(e.target.value)}
                  placeholder="PRIYAN"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-row">
                <label>Role / Specialty</label>
                <input
                  type="text"
                  value={editRole}
                  maxLength={36}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="MOTION DESIGNER // 3D SPATIAL"
                />
              </div>
              <div className="form-row">
                <label>Social Handle</label>
                <input
                  type="text"
                  value={editHandle}
                  maxLength={24}
                  onChange={(e) => setEditHandle(e.target.value)}
                  placeholder="@tejapriyan"
                />
              </div>
            </div>

            <div className="form-row">
              <label>Outro Summary Tags (Separated by •)</label>
              <input
                type="text"
                value={editTags}
                maxLength={60}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="60 FPS • 120 BPM • CODE-DRIVEN • BERLIN / TOKYO"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="reset-btn"
                onClick={() => {
                  setEditLine1('TEJA');
                  setEditLine2('PRIYAN');
                  setEditRole('MOTION DESIGNER // 3D SPATIAL');
                  setEditHandle('@tejapriyan');
                  setEditTags('60 FPS • 120 BPM • CODE-DRIVEN • BERLIN / TOKYO');
                  handleResetPhoto();
                }}
              >
                Reset Default
              </button>
              <button type="submit" className="apply-btn">
                Apply & Play Reconstruct ↻
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
