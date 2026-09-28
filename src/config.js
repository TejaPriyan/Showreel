// -------------------------------------------------------------------------
// Single source of truth for the Showreel Platform.
// Multi-template library, user photo customization, themes, and aspect ratios.
// -------------------------------------------------------------------------

export const TOTAL_DURATION = 30;
export const DURATION_OPTIONS = [10, 15, 30];

// The 5 Flagship Motion Design Styles
export const TEMPLATES = {
  claude: {
    id: 'claude',
    name: 'Claude Swiss Kinetic',
    category: 'Hybrid 2D / 3D',
    tagline: 'Grotesque Bold • Physics Easing • Swiss Outro',
    badge: 'POPULAR',
    accent: '#ff441f',
    bg: '#0a0a0e',
    icon: '✦',
    description:
      'Inspired by the award-winning Claude Opus 5.5 motion reel. Features kinetic typographic slams, "Six ways to get from A to B" physics curves, dimension box telemetry, and Swiss editorial finish.',
  },
  cyber3d: {
    id: 'cyber3d',
    name: '3D Cyber Spatial',
    category: 'Deep 3D WebGL',
    tagline: 'Wireframe Corridor • Holographic HUD • Wave Sea',
    badge: 'IMMERSIVE',
    accent: '#6c7bff',
    bg: '#06070b',
    icon: '⬡',
    description:
      'Deep spatial 3D corridor with flying camera, 2,300-dot undulating sine wave sea, floating glass holographic HUD cards with user photo projection, and Dutch angle camera roll.',
  },
  acid: {
    id: 'acid',
    name: 'Neo-Brutalist Acid',
    category: '2D Kinetic Motion',
    tagline: 'High-Voltage Marquee • Strobe Type • Acid Lime',
    badge: 'HIGH ENERGY',
    accent: '#d8ff00',
    bg: '#0a0a0c',
    icon: '⚡',
    description:
      'Raw, high-voltage graphic design. 5-layer staggered horizontal ticker marquee ribbons, high-contrast black & acid lime color blocking, and strobe kinetic word slams.',
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury Minimalist',
    category: 'Editorial Luxury',
    tagline: 'Serif Elegance • Liquid Glass • Champagne Gold',
    badge: 'PRESTIGE',
    accent: '#d9c6a0',
    bg: '#0a0b0e',
    icon: '❖',
    description:
      'Prestige creative director aesthetic. Cormorant serif typography, subtle metallic light sweeps, liquid glass reflection, and champagne gold particle dust.',
  },
  physics2d: {
    id: 'physics2d',
    name: '2D Kinetic Physics',
    category: 'Pure 2D Motion',
    tagline: 'Ball Bounce Trajectory • Bezier Easing • Rulers',
    badge: 'NEW',
    accent: '#1935ff',
    bg: '#f6f4ee',
    icon: '◈',
    description:
      'Pure graphic animation masterclass. Squash-and-stretch gravity bounces, cubic-bezier trajectory curves, coordinate angle telemetry, and Swiss poster typography.',
  },
};

export const DEFAULT_TEMPLATE = 'claude';

// Aspect ratios supported
export const ASPECT_RATIOS = {
  '9:16': { label: '9:16 (Reels/Shorts)', value: 9 / 16, cssVar: 9 / 16 },
  '16:9': { label: '16:9 (Landscape)', value: 16 / 9, cssVar: 16 / 9 },
  '1:1': { label: '1:1 (Square)', value: 1 / 1, cssVar: 1 / 1 },
};

export const DEFAULT_ASPECT = '9:16';
export const STAGE_RATIO = ASPECT_RATIOS[DEFAULT_ASPECT].value;

// Curated aesthetic themes
export const THEMES = {
  terracotta: {
    id: 'terracotta',
    name: 'Swiss Terracotta',
    bg0: 0x0a0a0e,
    bg1: 0x141012,
    accent: 0xff441f,
    accentSoft: 0xff7b5e,
    champagne: 0xffe2d4,
    ink: 0xffffff,
    cssBg0: '#0a0a0e',
    cssBg1: '#141012',
    cssAccent: '#ff441f',
    cssAccentSoft: '#ff7b5e',
    cssChampagne: '#ffe2d4',
    cssInk: '#ffffff',
  },
  indigo: {
    id: 'indigo',
    name: 'Electric Indigo',
    bg0: 0x06070b,
    bg1: 0x0b0d15,
    accent: 0x6c7bff,
    accentSoft: 0xa9b3ff,
    champagne: 0xd9c6a0,
    ink: 0xf4f5f8,
    cssBg0: '#06070b',
    cssBg1: '#0b0d15',
    cssAccent: '#6c7bff',
    cssAccentSoft: '#a9b3ff',
    cssChampagne: '#d9c6a0',
    cssInk: '#f4f5f8',
  },
  acid: {
    id: 'acid',
    name: 'Acid Volt',
    bg0: 0x0a0a0c,
    bg1: 0x12140f,
    accent: 0xd8ff00,
    accentSoft: 0xeeff80,
    champagne: 0xffffff,
    ink: 0xffffff,
    cssBg0: '#0a0a0c',
    cssBg1: '#12140f',
    cssAccent: '#d8ff00',
    cssAccentSoft: '#eeff80',
    cssChampagne: '#ffffff',
    cssInk: '#ffffff',
  },
  solar: {
    id: 'solar',
    name: 'Solar Amber',
    bg0: 0x0e0703,
    bg1: 0x1a0f07,
    accent: 0xff7b22,
    accentSoft: 0xffb370,
    champagne: 0xffd566,
    ink: 0xfff9f2,
    cssBg0: '#0e0703',
    cssBg1: '#1a0f07',
    cssAccent: '#ff7b22',
    cssAccentSoft: '#ffb370',
    cssChampagne: '#ffd566',
    cssInk: '#fff9f2',
  },
  emerald: {
    id: 'emerald',
    name: 'Cyber Emerald',
    bg0: 0x030d07,
    bg1: 0x07190f,
    accent: 0x00f090,
    accentSoft: 0x76ffd1,
    champagne: 0xd6fa75,
    ink: 0xf2fdf6,
    cssBg0: '#030d07',
    cssBg1: '#07190f',
    cssAccent: '#00f090',
    cssAccentSoft: '#76ffd1',
    cssChampagne: '#d6fa75',
    cssInk: '#f2fdf6',
  },
  cobalt: {
    id: 'cobalt',
    name: 'Electric Cobalt',
    bg0: 0x040817,
    bg1: 0x081329,
    accent: 0x1935ff,
    accentSoft: 0x6e84ff,
    champagne: 0xd0e0ff,
    ink: 0xf4f7ff,
    cssBg0: '#040817',
    cssBg1: '#081329',
    cssAccent: '#1935ff',
    cssAccentSoft: '#6e84ff',
    cssChampagne: '#d0e0ff',
    cssInk: '#f4f7ff',
  },
};

export const COLORS = THEMES.terracotta;

// Default brand identity
export const NAME_LINES = ['TEJA', 'PRIYAN'];
export const SUBTEXT_PARTS = ['MOTION DESIGNER', 'ART DIRECTION', '3D SPATIAL'];
export const DEFAULT_HANDLE = '@tejapriyan';
export const DEFAULT_TAGS = ['60 FPS', '120 BPM', 'CODE-DRIVEN', 'BERLIN / TOKYO'];

// Sample default avatar (Sleek minimalist 3D geometric portrait SVG)
export const DEFAULT_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff441f"/><stop offset="100%" stop-color="%231935ff"/></linearGradient></defs><rect width="200" height="200" rx="40" fill="%23111319"/><circle cx="100" cy="78" r="36" fill="url(%23g)"/><path d="M40,165 C40,125 70,118 100,118 C130,118 160,125 160,165 Z" fill="url(%23g)" opacity="0.9"/><circle cx="100" cy="100" r="88" fill="none" stroke="%23ffffff" stroke-width="2" stroke-dasharray="4 6" opacity="0.4"/></svg>`;

// Perf tiers — sampled once at boot
export function getPerfTier() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1080;
  const mem = typeof navigator !== 'undefined' && navigator.deviceMemory ? navigator.deviceMemory : 8;
  const isCoarse = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(pointer: coarse)').matches
    : false;
  if (w < 480 || mem <= 3) return 'low';
  if (isCoarse || w < 900 || mem <= 6) return 'mid';
  return 'high';
}

export const PERF = {
  low: { particles: 650, structures: 3, cards: 3, dpr: 1.5, bloom: false },
  mid: { particles: 1100, structures: 4, cards: 5, dpr: 1.75, bloom: true },
  high: { particles: 1800, structures: 5, cards: 5, dpr: 2, bloom: true },
};
