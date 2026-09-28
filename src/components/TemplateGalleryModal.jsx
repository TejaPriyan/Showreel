import React from 'react';
import { TEMPLATES } from '../config.js';

export default function TemplateGalleryModal({
  isOpen,
  activeTemplate,
  onSelectTemplate,
  onClose,
}) {
  if (!isOpen) return null;

  const templateList = Object.values(TEMPLATES);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="template-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="modal-title-group">
            <span className="modal-eyebrow">MOTION REEL TEMPLATE VAULT</span>
            <h2 className="modal-main-title">Select Motion Design Style</h2>
            <p className="modal-subtext">
              Every template is 100% customizable with your name, photo, colors, speed, and audio.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="templates-grid">
          {templateList.map((tpl) => {
            const isSelected = activeTemplate === tpl.id;
            return (
              <div
                key={tpl.id}
                className={`template-item-card ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onSelectTemplate(tpl.id);
                  onClose();
                }}
              >
                <div className="tpl-card-header">
                  <div className="tpl-badge-wrap">
                    <span className="tpl-badge-pill" style={{ borderColor: tpl.accent, color: tpl.accent }}>
                      {tpl.badge}
                    </span>
                    <span className="tpl-cat">{tpl.category}</span>
                  </div>
                  <span className="tpl-big-icon" style={{ color: tpl.accent }}>
                    {tpl.icon}
                  </span>
                </div>

                <div className="tpl-card-body">
                  <h3 className="tpl-title">{tpl.name}</h3>
                  <div className="tpl-tagline" style={{ color: tpl.accent }}>
                    {tpl.tagline}
                  </div>
                  <p className="tpl-desc">{tpl.description}</p>
                </div>

                <div className="tpl-card-footer">
                  <div className="tpl-palette-preview">
                    <span className="swatch" style={{ background: tpl.bg }} title="Base Background" />
                    <span className="swatch accent" style={{ background: tpl.accent }} title="Signature Accent" />
                  </div>

                  <button
                    className={`tpl-select-btn ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(tpl.id);
                      onClose();
                    }}
                  >
                    {isSelected ? '✓ CURRENT STYLE' : 'USE TEMPLATE →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
