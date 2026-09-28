// ---------------------------------------------------------------------------
// Trailer-Grade Motion Design Audio Engine for Teja Priyan Showreel
// Massive 808 sub drops, rhythmic cyber risers, anvil impacts & celestial chimes.
// ---------------------------------------------------------------------------

class ShowreelAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.droneGain = null;
    this.droneOscs = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.9, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this._startAmbientDrone();
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getMediaStreamDestination() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return null;
    if (!this.streamDest) {
      this.streamDest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.streamDest);
    }
    return this.streamDest;
  }

  setMuted(muted) {
    this.ensureContext();
    this.isMuted = muted;
    if (!this.masterGain) return;
    const now = this.ctx.currentTime;
    if (muted) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.03);
    } else {
      this.masterGain.gain.setTargetAtTime(0.9, now, 0.03);
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- Deep Cinematic Ambient Drone ---
  _startAmbientDrone() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(220, now);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.25, now);
    this.droneGain.connect(droneFilter);
    droneFilter.connect(this.masterGain);

    const freqs = [55, 110, 164.81]; // A1, A2, E3
    this.droneOscs = freqs.map((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((i - 1) * 7, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 / (i + 1), now);
      osc.connect(gain);
      gain.connect(this.droneGain);
      osc.start(now);
      return osc;
    });
  }

  // --- Act 1 (0.0s): 808 Sub-Drop Ignition ---
  playIgnite() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 808 transient punch
    const kickOsc = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(240, now);
    kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.09);
    kickOsc.frequency.exponentialRampToValueAtTime(28, now + 0.8);

    kickGain.gain.setValueAtTime(1.0, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    kickOsc.connect(kickGain);
    kickGain.connect(this.masterGain);
    kickOsc.start(now);
    kickOsc.stop(now + 1.4);

    // High sizzle spark
    this._playNoiseBurst(0.25, 0.45, 1800);
  }

  // --- Act 1 Kinetic Typography Slams ---
  playKineticTick() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Snappy punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);

    this._playNoiseBurst(0.08, 0.25, 3000);
  }

  // --- Act 2 (2.0s): Trailer Riser with Accelerating Cyber Pulses ---
  playTunnelWarp() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 2.6;

    // Sweeping wind noise
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.0, now);
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3600, now + duration * 0.85);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.linearRampToValueAtTime(0.55, now + duration * 0.75);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);

    // Rhythmic pulses accelerating like a film trailer
    const pulseCount = 7;
    for (let i = 0; i < pulseCount; i++) {
      const pTime = now + (i * 0.32);
      const pOsc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      pOsc.type = 'sawtooth';
      pOsc.frequency.setValueAtTime(110 + i * 28, pTime);

      pGain.gain.setValueAtTime(0.25 + i * 0.04, pTime);
      pGain.gain.exponentialRampToValueAtTime(0.001, pTime + 0.12);

      pOsc.connect(pGain);
      pGain.connect(this.masterGain);
      pOsc.start(pTime);
      pOsc.stop(pTime + 0.12);
    }
  }

  // --- Act 3 (4.85s): The "Drop" Silence & Suction ---
  playCollapse() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Quick reverse gravity sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.65);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.65, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  // --- Act 3 (5.55s): Thunderous Cinematic Impact Slam + Anvil Clank ---
  playWordmarkLock() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Massive cinematic sub-boom
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.7);

    subGain.gain.setValueAtTime(1.0, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 1.6);

    // Anvil metallic hit
    const anvilOsc = this.ctx.createOscillator();
    const anvilGain = this.ctx.createGain();
    anvilOsc.type = 'triangle';
    anvilOsc.frequency.setValueAtTime(880, now);
    anvilOsc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

    anvilGain.gain.setValueAtTime(0.5, now);
    anvilGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    anvilOsc.connect(anvilGain);
    anvilGain.connect(this.masterGain);
    anvilOsc.start(now);
    anvilOsc.stop(now + 0.25);

    // Celestial golden chime chord (D-maj9 heavenly resonance)
    const chord = [587.33, 880.0, 1174.66, 1479.98, 1760.0];
    chord.forEach((freq, idx) => {
      const cOsc = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      cOsc.type = 'sine';
      cOsc.frequency.setValueAtTime(freq, now + idx * 0.03);

      cGain.gain.setValueAtTime(0.3 / (idx + 1), now + idx * 0.03);
      cGain.gain.exponentialRampToValueAtTime(0.0005, now + 1.8 + idx * 0.1);

      cOsc.connect(cGain);
      cGain.connect(this.masterGain);
      cOsc.start(now + idx * 0.03);
      cOsc.stop(now + 2.0);
    });
  }

  _playNoiseBurst(duration, vol, cutoff) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }

  // =====================================================================
  // NEON PULSE — Cyberpunk Glitch Sound Design
  // =====================================================================

  // Digital glitch stutter — rapid bit-crushed staccato bursts
  playGlitchStutter() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const burstCount = 6;
    for (let i = 0; i < burstCount; i++) {
      const t = now + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220 + Math.random() * 1200, t);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.04);
    }
  }

  // Heavy digital bass drop with distorted saw wave
  playNeonDrop() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const sawOsc = this.ctx.createOscillator();
    const sawGain = this.ctx.createGain();
    const waveshaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1;
      curve[i] = Math.tanh(x * 3);
    }
    waveshaper.curve = curve;

    sawOsc.type = 'sawtooth';
    sawOsc.frequency.setValueAtTime(280, now);
    sawOsc.frequency.exponentialRampToValueAtTime(32, now + 0.5);

    sawGain.gain.setValueAtTime(0.85, now);
    sawGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    sawOsc.connect(waveshaper);
    waveshaper.connect(sawGain);
    sawGain.connect(this.masterGain);
    sawOsc.start(now);
    sawOsc.stop(now + 1.2);

    // Digital crackle overlay
    this._playNoiseBurst(0.15, 0.4, 6000);
  }

  // Cyberpunk arpeggio sequence — 16th note pings ascending
  playNeonArp() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      const t = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3 - i * 0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

  // Neon outro resolve — glowing sustained pad chord (Cm9)
  playNeonResolve() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const chord = [130.81, 155.56, 196.0, 261.63, 293.66, 349.23];
    chord.forEach((freq, idx) => {
      const cOsc = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      cOsc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      cOsc.frequency.setValueAtTime(freq, now + idx * 0.04);
      cGain.gain.setValueAtTime(0.25 / (idx + 1), now + idx * 0.04);
      cGain.gain.exponentialRampToValueAtTime(0.0005, now + 2.4 + idx * 0.15);
      cOsc.connect(cGain);
      cGain.connect(this.masterGain);
      cOsc.start(now + idx * 0.04);
      cOsc.stop(now + 2.8);
    });

    // Sub rumble underneath
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(65.41, now);
    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 2.2);
  }

  // Rhythmic cyber pulse — repeating ping for data stream scenes
  playCyberPulse() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.18;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.06);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.09);
    }
  }

  dispose() {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (err) {
        // ignore
      }
      this.ctx = null;
    }
  }
}

export const audioEngine = new ShowreelAudioEngine();

