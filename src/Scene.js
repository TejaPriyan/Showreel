import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { getParticleTexture } from './utils/particleTexture.js';
import { sampleWordmarkPoints } from './utils/textPoints.js';
import { createHudTexture } from './utils/hudTexture.js';
import { COLORS, NAME_LINES, PERF } from './config.js';

export class Showreel {
  constructor(canvas, { tier = 'high', aspect = 9 / 16, theme = COLORS, photo = null, template = 'claude' } = {}) {
    this.canvas = canvas;
    this.tier = PERF[tier] || PERF.high;
    this.aspect = aspect;
    this.theme = theme;
    this.lines = NAME_LINES;
    this.photo = photo;
    this.template = template;

    this.clock = new THREE.Clock();
    this.energy = 0;      // 0..1 — drives ambient rotation speed
    this.collapseT = 0;   // 0..1 — particle convergence progress
    this.cameraRoll = 0;  // Dutch angle roll in radians
    this.waveAmp = 0;     // 0..1 — 3D particle sea undulating wave amplitude
    this.ribbonAmp = 0;   // 0..1 — 3D floating oscilloscope wave amplitude
    this.lookTarget = new THREE.Vector3(0, 0, 0);
    this._raf = null;

    // Smooth subtle mouse parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this._onMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.mouse.targetX = THREE.MathUtils.clamp(nx, -1, 1);
      this.mouse.targetY = THREE.MathUtils.clamp(ny, -1, 1);
    };
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });

    this._initRenderer();
    this._initScene();
    this._buildCore();
    this._buildStructures();
    this._buildTunnel();
    this._buildCards();
    this._buildGrid();
    this._buildWaveMatrix();
    this._buildSineWaveRibbon();
    this._buildRadarRipples();
    this._buildParticles();
    this._buildForegroundEmbers();
    this._initComposer();

    if (this.photo) {
      this.updatePhoto(this.photo);
    }

    this.resize();
  }

  // ---------------------------------------------------------------- setup
  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(new THREE.Color(this.theme.bg0), 1);
    renderer.setPixelRatio(Math.min(this.tier.dpr, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer = renderer;
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.theme.bg0, 0.08);

    this.camera = new THREE.PerspectiveCamera(48, this.aspect, 0.1, 60);
    this.camera.position.set(0, 0.0, 4.4);

    const key = new THREE.PointLight(this.theme.champagne, 4.0, 25, 2);
    key.position.set(2, 2.5, 3);
    const rim = new THREE.PointLight(this.theme.accent, 5.2, 25, 2);
    rim.position.set(-3, -1.8, -2);
    const amb = new THREE.AmbientLight(0x181c2b, 0.7);
    this.scene.add(key, rim, amb);
    this.keyLight = key;
    this.rimLight = rim;
    this.ambientLight = amb;
  }

  // Luminous Core + Anamorphic Horizontal Flare Sprite (Crisp Claude-Style Accent Dot)
  _buildCore() {
    const group = new THREE.Group();
    const tex = getParticleTexture();

    const orbMat = new THREE.SpriteMaterial({
      map: tex,
      color: new THREE.Color(0xff441f), // Signature vermilion accent
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const core = new THREE.Sprite(orbMat);
    core.scale.set(0.001, 0.001, 0.001);
    group.add(core);

    const flareMat = new THREE.SpriteMaterial({
      map: tex,
      color: new THREE.Color(this.theme.accentSoft),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flare = new THREE.Sprite(flareMat);
    flare.scale.set(0.001, 0.001, 0.001);
    group.add(flare);

    this.coreGroup = group;
    this.core = core;
    this.flare = flare;
    this.coreScale = 0.001;
    this.scene.add(group);
  }

  // Faceted 3D Physical Geometry
  _buildStructures() {
    const group = new THREE.Group();
    const geos = [
      new THREE.IcosahedronGeometry(0.9, 0),
      new THREE.TorusGeometry(1.7, 0.04, 16, 90),
      new THREE.OctahedronGeometry(0.85, 0),
    ];

    const positions = [
      [0, 0, -1.8],
      [0, 0, -3.2],
      [0, 0.1, -4.8],
    ];

    const colorA = new THREE.Color(this.theme.accent);
    const colorB = new THREE.Color(this.theme.champagne);

    this.structures = geos.map((geo, i) => {
      const subGroup = new THREE.Group();

      const faceMat = new THREE.MeshBasicMaterial({
        color: colorA.clone().lerp(colorB, i / (geos.length - 1)),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, faceMat);
      subGroup.add(mesh);

      const wf = new THREE.WireframeGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: i === 0 ? 0xffffff : colorA,
        transparent: true,
        opacity: 0,
      });
      const edges = new THREE.LineSegments(wf, edgeMat);
      subGroup.add(edges);

      const [x, y, z] = positions[i];
      subGroup.position.set(x, y, z);
      subGroup.scale.setScalar(0.001);

      subGroup.userData = { faceMat, edgeMat, geoMesh: mesh, edgeMesh: edges };
      group.add(subGroup);
      return subGroup;
    });

    this.structureGroup = group;
    this.scene.add(group);
  }

  _buildTunnel() {
    const group = new THREE.Group();
    const count = 9;
    const colorA = new THREE.Color(this.theme.accent);
    const colorB = new THREE.Color(this.theme.champagne);
    this.tunnelFrames = [];

    for (let i = 0; i < count; i++) {
      const size = 1.9 + i * 0.12;
      const geo = new THREE.PlaneGeometry(size, size);
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color: colorA.clone().lerp(colorB, i / count),
        transparent: true,
        opacity: 0,
      });
      const frame = new THREE.LineSegments(edges, mat);
      frame.position.z = -2.0 - i * 1.6;
      frame.scale.setScalar(0.001);
      group.add(frame);
      this.tunnelFrames.push(frame);
    }
    this.tunnelGroup = group;
    this.scene.add(group);
  }

  _buildCards() {
    const group = new THREE.Group();
    const cardPlacements = [
      { x: -1.35, y: 0.15, z: -1.5, rotY: 0.22, w: 1.1, h: 0.68 },
      { x: 1.35, y: -0.15, z: -2.8, rotY: -0.22, w: 1.1, h: 0.68 },
      { x: -1.4, y: -0.15, z: -4.2, rotY: 0.20, w: 1.15, h: 0.70 },
      { x: 1.4, y: 0.15, z: -5.6, rotY: -0.20, w: 1.15, h: 0.70 },
    ];

    this.cards = [];
    cardPlacements.forEach((cfg, i) => {
      const geo = new THREE.PlaneGeometry(cfg.w, cfg.h);
      const hudTexture = createHudTexture(i, this.theme.cssAccent || '#6c7bff');

      const fill = new THREE.MeshBasicMaterial({
        map: hudTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const panel = new THREE.Mesh(geo, fill);
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: this.theme.accentSoft, transparent: true, opacity: 0 })
      );
      panel.add(edge);
      panel.userData.edgeMat = edge.material;
      panel.position.set(cfg.x, cfg.y, cfg.z);
      panel.rotation.set(0, cfg.rotY, 0);
      panel.scale.setScalar(0.001);

      group.add(panel);
      this.cards.push(panel);
    });

    this.cardGroup = group;
    this.scene.add(group);
  }

  _buildGrid() {
    const size = 26;
    const divisions = 26;
    const geo = new THREE.BufferGeometry();
    const verts = [];
    const half = size / 2;
    const step = size / divisions;
    for (let i = 0; i <= divisions; i++) {
      const p = -half + i * step;
      verts.push(-half, 0, p, half, 0, p);
      verts.push(p, 0, -half, p, 0, half);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    const mat = new THREE.LineBasicMaterial({
      color: this.theme.accent,
      transparent: true,
      opacity: 0,
    });
    const grid = new THREE.LineSegments(geo, mat);
    grid.position.y = -2.0;
    grid.position.z = -5.5;
    this.grid = grid;
    this.scene.add(grid);
  }

  // -------------------------------------------------------------------------
  // NEW: 3D Undulating Particle Wave Sea ("Dots like waves illusion")
  // -------------------------------------------------------------------------
  _buildWaveMatrix() {
    const cols = 48;
    const rows = 48;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colA = new THREE.Color(this.theme.accent);
    const colB = new THREE.Color(this.theme.champagne);

    const xSpan = 11.0;
    const zSpan = 13.0;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const idx = (i * rows + j) * 3;
        const u = i / (cols - 1);
        const v = j / (rows - 1);
        positions[idx] = (u - 0.5) * xSpan;
        positions[idx + 1] = -1.9; // Base floor height
        positions[idx + 2] = -9.0 + v * zSpan;

        const c = colA.clone().lerp(colB, (u + v) * 0.5);
        colors[idx] = c.r;
        colors[idx + 1] = c.g;
        colors[idx + 2] = c.b;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.055,
      map: getParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const wavePoints = new THREE.Points(geo, mat);
    this.waveMatrix = wavePoints;
    this._wavePositions = positions;
    this.scene.add(wavePoints);
  }

  // -------------------------------------------------------------------------
  // NEW: Floating 3D Oscilloscope Sine Wave Ribbon ("Graphs and waves")
  // -------------------------------------------------------------------------
  _buildSineWaveRibbon() {
    const pointsCount = 180;
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    const colA = new THREE.Color(0xffffff);
    const colB = new THREE.Color(this.theme.accent);

    for (let i = 0; i < pointsCount; i++) {
      const u = i / (pointsCount - 1);
      positions[i * 3] = (u - 0.5) * 7.5;
      positions[i * 3 + 1] = 0.2;
      positions[i * 3 + 2] = -2.1;

      const c = colA.clone().lerp(colB, Math.sin(u * Math.PI));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });

    const ribbon = new THREE.Line(geo, mat);
    this.sineRibbon = ribbon;
    this._ribbonPositions = positions;
    this.scene.add(ribbon);
  }

  // -------------------------------------------------------------------------
  // NEW: Circular Sonic Radar Ripples (Concentric wave rings)
  // -------------------------------------------------------------------------
  _buildRadarRipples() {
    const group = new THREE.Group();
    const count = 4;
    this.ripples = [];

    for (let i = 0; i < count; i++) {
      const geo = new THREE.RingGeometry(0.8 + i * 0.7, 0.82 + i * 0.7, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: this.theme.accentSoft,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.set(0, 0, -2.6);
      group.add(ring);
      this.ripples.push(ring);
    }

    this.rippleGroup = group;
    this.scene.add(group);
  }

  // Wordmark Convergence Particles
  _buildParticles() {
    const count = this.tier.particles;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const origin = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);

    const inkColor = new THREE.Color(this.theme.ink);
    const accentColor = new THREE.Color(this.theme.accentSoft);
    const champagneColor = new THREE.Color(this.theme.champagne);

    for (let i = 0; i < count; i++) {
      const r = 1.2 + Math.pow(Math.random(), 0.6) * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.lerp(-1, 1, Math.random()));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const z = -Math.random() * 8 + 1.2;
      origin.set([x, y, z], i * 3);

      const c = Math.random();
      const col = c < 0.55 ? inkColor : c < 0.8 ? accentColor : champagneColor;
      colors.set([col.r, col.g, col.b], i * 3);
      sizes[i] = 0.028 + Math.random() * 0.045;
    }

    const textFraction = 0.72;
    const textCount = Math.floor(count * textFraction);
    const textPts = sampleWordmarkPoints(this.lines, textCount, { canvasW: 1200, canvasH: 760 });
    const textWorldW = 3.55;
    const textWorldH = 3.55 * (760 / 1200);

    for (let i = 0; i < textCount; i++) {
      if (i < textCount) {
        const nx = textPts[i * 2];
        const ny = textPts[i * 2 + 1];
        target.set(
          [
            nx * (textWorldW / 2),
            ny * (textWorldH / 2),
            -0.35 + (Math.random() - 0.5) * 0.15,
          ],
          i * 3
        );
      } else {
        const r = 1.9 + Math.random() * 1.2;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 2.2;
        target.set([Math.cos(theta) * r, y, -0.6 - Math.random() * 1.4], i * 3);
      }
    }

    positions.set(origin);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.065,
      map: getParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    points.scale.setScalar(0.01);

    this.particles = points;
    this._pOrigin = origin;
    this._pTarget = target;
    this._pPositions = positions;
    this.scene.add(points);
  }

  // Foreground Velocity Embers
  _buildForegroundEmbers() {
    const count = 90;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colA = new THREE.Color(this.theme.champagne);
    const colB = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 2] = Math.random() * 5.0 - 1.0;

      const c = colA.clone().lerp(colB, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.08,
      map: getParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const emberPoints = new THREE.Points(geo, mat);
    this.embers = emberPoints;
    this._emberPositions = positions;
    this.scene.add(emberPoints);
  }

  _initComposer() {
    if (!this.tier.bloom) {
      this.composer = null;
      return;
    }
    const size = new THREE.Vector2();
    this.renderer.getSize(size);
    const composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));

    const bloom = new UnrealBloomPass(size, 0.55, 0.65, 0.22);
    composer.addPass(bloom);
    this.bloom = bloom;

    const rgbShift = new ShaderPass(RGBShiftShader);
    rgbShift.uniforms['amount'].value = 0.0;
    composer.addPass(rgbShift);
    this.rgbShiftPass = rgbShift;

    this.composer = composer;
  }

  // ------------------------------------------------------------- public API
  get rgbShiftAmount() {
    return this.rgbShiftPass ? this.rgbShiftPass.uniforms['amount'].value : 0;
  }

  set rgbShiftAmount(v) {
    if (this.rgbShiftPass) {
      this.rgbShiftPass.uniforms['amount'].value = v;
    }
  }

  setCollapse(t) {
    this.collapseT = THREE.MathUtils.clamp(t, 0, 1);
    const ease = this.collapseT * this.collapseT * (3 - 2 * this.collapseT);

    const pos = this._pPositions;
    const origin = this._pOrigin;
    const target = this._pTarget;
    const count = origin.length / 3;

    const vortexAngle = (1 - ease) * Math.PI * 1.75;
    const cosA = Math.cos(vortexAngle);
    const sinA = Math.sin(vortexAngle);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = origin[i3], oy = origin[i3 + 1], oz = origin[i3 + 2];
      const tx = target[i3], ty = target[i3 + 1], tz = target[i3 + 2];

      const rx = ox * cosA - oy * sinA;
      const ry = ox * sinA + oy * cosA;

      pos[i3] = THREE.MathUtils.lerp(rx, tx, ease);
      pos[i3 + 1] = THREE.MathUtils.lerp(ry, ty, ease);
      pos[i3 + 2] = THREE.MathUtils.lerp(oz, tz, ease);
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  setFov(v) {
    this.camera.fov = v;
    this.camera.updateProjectionMatrix();
  }

  setAspect(aspect) {
    this.aspect = aspect;
    this.resize();
  }

  setTheme(theme) {
    this.theme = theme;
    this.renderer.setClearColor(new THREE.Color(theme.bg0), 1);
    if (this.scene.fog) this.scene.fog.color.setHex(theme.bg0);
    if (this.keyLight) this.keyLight.color.setHex(theme.champagne);
    if (this.rimLight) this.rimLight.color.setHex(theme.accent);

    const colorA = new THREE.Color(theme.accent);
    const colorB = new THREE.Color(theme.champagne);

    this.structures.forEach((subGroup, i) => {
      const { faceMat, edgeMat } = subGroup.userData;
      if (faceMat) faceMat.color.copy(colorA).lerp(colorB, i / Math.max(1, this.structures.length - 1));
      if (edgeMat) edgeMat.color.copy(i === 0 ? new THREE.Color(0xffffff) : colorA);
    });

    this.tunnelFrames.forEach((f, i) => {
      f.material.color.copy(colorA).lerp(colorB, i / this.tunnelFrames.length);
    });

    if (this.grid) this.grid.material.color.setHex(theme.accent);

    this.cards.forEach((panel, i) => {
      panel.material.map = createHudTexture(i, theme.cssAccent || '#6c7bff');
      panel.material.needsUpdate = true;
      if (panel.userData.edgeMat) panel.userData.edgeMat.color.setHex(theme.accentSoft);
    });

    if (this.flare) this.flare.material.color.setHex(theme.accentSoft);
    if (this.ripples) {
      this.ripples.forEach(r => r.material.color.setHex(theme.accentSoft));
    }

    const count = this.tier.particles;
    const inkColor = new THREE.Color(theme.ink);
    const accentColor = new THREE.Color(theme.accentSoft);
    const champagneColor = new THREE.Color(theme.champagne);
    const colorsAttr = this.particles.geometry.attributes.color;
    for (let i = 0; i < count; i++) {
      const c = Math.random();
      const col = c < 0.55 ? inkColor : c < 0.8 ? accentColor : champagneColor;
      colorsAttr.setXYZ(i, col.r, col.g, col.b);
    }
    colorsAttr.needsUpdate = true;
  }

  updateWordmark(lines) {
    this.lines = lines;
    const count = this.tier.particles;
    const textFraction = 0.72;
    const textCount = Math.floor(count * textFraction);
    const textPts = sampleWordmarkPoints(lines, textCount, { canvasW: 1200, canvasH: 760 });
    const textWorldW = 3.55;
    const textWorldH = 3.55 * (760 / 1200);

    for (let i = 0; i < textCount; i++) {
      const nx = textPts[i * 2];
      const ny = textPts[i * 2 + 1];
      this._pTarget.set(
        [
          nx * (textWorldW / 2),
          ny * (textWorldH / 2),
          -0.35 + (Math.random() - 0.5) * 0.15,
        ],
        i * 3
      );
    }
    this.setCollapse(this.collapseT);
  }

  updatePhoto(photoUrl) {
    if (!photoUrl) return;
    this.photo = photoUrl;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      if (this.cards && this.cards.length >= 2) {
        if (this.cards[0]) {
          this.cards[0].material.map = texture;
          this.cards[0].material.needsUpdate = true;
        }
        if (this.cards[2]) {
          this.cards[2].material.map = texture;
          this.cards[2].material.needsUpdate = true;
        }
      }
    };
    img.src = photoUrl;
  }

  setTemplate(templateId) {
    this.template = templateId;
    if (templateId === 'cyber3d') {
      if (this.waveMatrix) this.waveMatrix.material.opacity = 0.85;
      if (this.keyLight) this.keyLight.color.set(0x6c7bff);
      if (this.rimLight) this.rimLight.color.set(0x00f090);
    } else if (templateId === 'acid') {
      if (this.keyLight) this.keyLight.color.set(0xd8ff00);
      if (this.rimLight) this.rimLight.color.set(0xff0055);
    } else if (templateId === 'luxury') {
      if (this.keyLight) this.keyLight.color.set(0xffe2d4);
      if (this.rimLight) this.rimLight.color.set(0xd9c6a0);
    } else if (templateId === 'physics2d') {
      if (this.keyLight) this.keyLight.color.set(0x1935ff);
      if (this.rimLight) this.rimLight.color.set(0xffffff);
    } else {
      if (this.keyLight) this.keyLight.color.set(this.theme.champagne);
      if (this.rimLight) this.rimLight.color.set(this.theme.accent);
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.composer) this.composer.setSize(w, h);
  }

  mount() {
    this.clock.start();
    const loop = () => {
      const delta = Math.min(this.clock.getDelta(), 0.05);
      this._tick(delta);
      if (this.composer) this.composer.render();
      else this.renderer.render(this.scene, this.camera);
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  _tick(delta) {
    const e = this.energy;
    const time = this.clock.elapsedTime;

    // Subtle interactive mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.lookTarget.set(this.mouse.x * 0.22, this.mouse.y * 0.16, 0);

    // Steady, majestic rotation
    this.structureGroup.rotation.y += delta * 0.12 * (0.3 + e);
    if (this.structures[0]) this.structures[0].rotation.y += delta * 0.25 * (0.2 + e);
    if (this.structures[1]) this.structures[1].rotation.z += delta * 0.15 * (0.2 + e);

    this.particles.rotation.y += delta * 0.028 * (0.25 + e) * (this.collapseT < 0.05 ? 1 : 0.2);

    // Core pulsing & flare scale (clamped to sleek cinematic dot)
    const pulse = 1 + Math.sin(time * 2.1) * 0.04;
    const s = Math.min(Math.max(this.coreScale, 0.001) * pulse, 0.22);
    this.core.scale.set(s, s, s);
    if (this.flare) {
      this.flare.scale.set(s * 2.5, s * 0.08, 1);
    }

    // Camera look-at with dynamic Dutch angle roll
    this.camera.lookAt(this.lookTarget);
    this.camera.rotation.z += this.cameraRoll;

    // Foreground velocity embers drifting toward camera
    if (this.embers) {
      const pos = this._emberPositions;
      const count = pos.length / 3;
      const speed = delta * (0.4 + e * 2.2);
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 2] += speed;
        if (pos[i * 3 + 2] > 4.6) {
          pos[i * 3 + 2] = -1.0;
        }
      }
      this.embers.geometry.attributes.position.needsUpdate = true;
    }

    // -----------------------------------------------------------------------
    // Animate 3D Undulating Particle Wave Sea ("Dots like waves illusion")
    // -----------------------------------------------------------------------
    if (this.waveMatrix && this.waveAmp > 0.001) {
      const pos = this._wavePositions;
      const cols = 48;
      const rows = 48;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = (i * rows + j) * 3;
          const x = pos[idx];
          const z = pos[idx + 2];
          // Harmonic wave equation for liquid digital wave ocean
          const waveHeight = (Math.sin(x * 0.55 + time * 2.5) * Math.cos(z * 0.45 + time * 2.0)) * this.waveAmp;
          pos[idx + 1] = -1.9 + waveHeight;
        }
      }
      this.waveMatrix.geometry.attributes.position.needsUpdate = true;
    }

    // -----------------------------------------------------------------------
    // Animate 3D Floating Oscilloscope Wave Ribbon ("Graphs and waves")
    // -----------------------------------------------------------------------
    if (this.sineRibbon && this.ribbonAmp > 0.001) {
      const pos = this._ribbonPositions;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        const x = pos[i * 3];
        const wave = (Math.sin(x * 2.5 + time * 5.8) * 0.45 + Math.sin(x * 5.2 - time * 3.6) * 0.18) * this.ribbonAmp;
        pos[i * 3 + 1] = 0.25 + wave;
      }
      this.sineRibbon.geometry.attributes.position.needsUpdate = true;
    }

    // -----------------------------------------------------------------------
    // Animate Concentric Radar Wave Ripples
    // -----------------------------------------------------------------------
    if (this.ripples) {
      this.ripples.forEach((ring, i) => {
        const phase = (time * 0.6 + i * 0.25) % 1.0;
        ring.scale.setScalar(0.7 + phase * 1.8);
      });
    }
  }

  dispose() {
    if (this._raf) cancelAnimationFrame(this._raf);
    window.removeEventListener('mousemove', this._onMouseMove);
    this.renderer.dispose();
  }
}
