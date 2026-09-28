import React from 'react';
import { TEMPLATES } from '../config.js';

export default function HeaderNav({
  activeTemplate,
  activeSection = 'claude',
  onSwitchSection,
  onOpenTemplates,
  onOpenCustomizer,
  onExport,
  isAudioMuted,
  onToggleAudio,
}) {
  const currentTpl = TEMPLATES[activeTemplate] || TEMPLATES.claude;

  return (
    <header className="platform-header">
      <div className="header-left">
        <div className="platform-brand">
          <span className="brand-logo">SHOWREEL</span>
          <span className="brand-dot" />
          <span className="brand-badge">STUDIO</span>
        </div>

        {/* Active Template Quick Selector Pill */}
        <button
          className="active-template-pill"
          onClick={onOpenTemplates}
          title="Browse all 5 Motion Styles"
        >
          <span className="tpl-icon">{currentTpl.icon}</span>
          <span className="tpl-name">{currentTpl.name}</span>
          <span className="tpl-tag">{currentTpl.badge}</span>
          <span className="tpl-chevron">▾</span>
        </button>
      </div>

      {/* Center: Dual Video Reel Section Switcher */}
      <div className="header-center">
        <div className="header-section-switcher">
          <button
            className={`section-tab-btn ${activeSection === 'claude' ? 'active' : ''}`}
            onClick={() => onSwitchSection && onSwitchSection('claude')}
            title="Video 1: Swiss Kinetic Motion (Claude Style)"
          >
            <span className="tab-indicator dot-swiss" />
            <span className="tab-title">✦ Swiss Kinetic</span>
            <span className="tab-pill">VIDEO 1</span>
          </button>
          <button
            className={`section-tab-btn ${activeSection === 'neon' ? 'neon-active' : ''}`}
            onClick={() => onSwitchSection && onSwitchSection('neon')}
            title="Video 2: Neon Pulse Cyberpunk Glitch"
          >
            <span className="tab-indicator dot-neon" />
            <span className="tab-title">◈ Neon Pulse</span>
            <span className="tab-pill new">NEW VIDEO</span>
          </button>
        </div>
      </div>

      <div className="header-right">
        {/* Templates Gallery Button */}
        <button
          className="header-nav-btn templates-btn"
          onClick={onOpenTemplates}
          title="Open Motion Templates Library"
        >
          <span>⊞</span>
          <span>Templates</span>
        </button>

        {/* Audio Engine Live Toggle */}
        <button
          className={`header-nav-btn audio-btn ${!isAudioMuted ? 'active' : ''}`}
          onClick={onToggleAudio}
          title={isAudioMuted ? 'Enable Sound FX & Synth' : 'Mute Audio'}
        >
          <span>{isAudioMuted ? '🔇' : '🔊'}</span>
          {!isAudioMuted && (
            <span className="mini-eq">
              <span className="eq-bar b1" />
              <span className="eq-bar b2" />
              <span className="eq-bar b3" />
            </span>
          )}
        </button>

        {/* Customize Identity & Photo */}
        <button
          className="header-nav-btn customize-btn"
          onClick={onOpenCustomizer}
          title="Customize Name, Photo, Palette, Speed"
        >
          <span>✦</span>
          <span>Customize</span>
        </button>

        {/* Instant Video Export */}
        <button
          className="header-nav-btn export-hero-btn"
          onClick={onExport}
          title="Download 60FPS Video with Audio"
        >
          <span>📹</span>
          <span>Download</span>
        </button>
      </div>
    </header>
  );
}

