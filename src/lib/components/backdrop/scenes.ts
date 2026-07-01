// Scenes as data, following the repo's config-as-data convention (interface + exported const).
// Two scenes ship now (menu / session); STATUS_SCENE binds them to the game phase.

import type { PanelParams } from './profile';
import type { GameStatus } from '$lib/store/game-loop.svelte';

export const ALL_TOGGLE_KEYS = [
	'grade',
	'warm',
	'cool',
	'sepia',
	'mono',
	'invert',
	'vignette',
	'chroma',
	'barrel',
	'bloom',
	'heat',
	'poster',
	'focus',
	'grain',
	'scan',
	'vhs',
	'glitch',
	'fog',
	'godrays',
	'embers',
	'ash',
	'snow',
	'rain',
	'fireflies',
	'sparks',
	'dust',
	'parallax',
	'kenburns',
	'tonemap',
	'flare',
	'halation',
	'sharpen',
	'crt',
	'dither',
	'edge',
	'zoomblur',
	'ripple'
] as const;

export type ToggleKey = (typeof ALL_TOGGLE_KEYS)[number];

// Closed set of scene ids — like GameStatus, so a typo in STATUS_SCENE can't compile.
export type SceneId =
	| 'menu'
	| 'session'
	| 'test'
	| 'test-v2'
	| 'test-v3'
	| 'test-v4'
	| 'storm'
	| 'ember-vhs'
	| 'night-glow';

// Per-effect params (Studio "fxParams"), panel scale. Permissive by design: unknown effect keys are
// tolerated so a full Studio look pastes in unchanged — the engine reads only the subset it supports
// today (tonemap.mode, per-particle {turbulence}). Normalized by normalizeFxParams at apply time.
export type SceneFxParams = Record<string, Record<string, number>>;

export interface SceneDef {
	id: SceneId;
	image: string; // background image URL
	depth?: string; // optional depth-map URL; the 'parallax' effect samples its red channel
	fx: ToggleKey[]; // enabled effect toggles
	params: PanelParams; // PANEL scale, normalized at apply time
	fxParams?: SceneFxParams; // optional per-effect params (Studio), normalized at apply time
	transition: { mode: number; dur: number }; // default dissolve
	dim: number; // 0..1 backdrop dimming, default 0
	// Periodic glitch the wrapper schedules (panel scale: ms interval, 0..100 strength). It's a
	// wrapper-side timing/decay concern (drives setGlitch), not a uniform — so it lives apart from
	// `params`. Only fires while 'glitch' is in `fx`.
	glitch: { intervalMs: number; strength: number };
}

export const SCENES: Record<SceneId, SceneDef> = {
	session: {
		id: 'session',
		image: '/assets/test-bg/night.jpeg',
		fx: ['vignette', 'bloom', 'grain', 'scan', 'glitch', 'dust', 'kenburns'],
		params: {
			intensity: 22,
			fogAmt: 0,
			grainAmt: 59,
			bloomAmt: 54,
			dofAmt: 24,
			exposure: 120,
			zoomAmt: 41
		},
		transition: { mode: 2, dur: 0.8 },
		dim: 0,
		glitch: { intervalMs: 4000, strength: 15 }
	},
	// Studio look 'storm-filmic' ported (2026-07-01). Not phase-bound yet — a studio-only slot for
	// visually QA'ing the depth-parallax + filmic-tonemap ports before promoting into menu/session.
	// Dropped from the Studio config: teal-orange LUT (not ported) and the fxParams the game doesn't read
	// (focus/fog.mode/trails/vhs/print/lensdirt/anamorphic/chromadesync). fog renders the game's single
	// volumetric variant (= Studio fog.mode 0). Only the engine-consumed fxParams are kept below.
	storm: {
		id: 'storm',
		image: '/assets/test-bg/stormwatch.png',
		depth: '/assets/test-bg/stormwatch-depth.png',
		fx: [
			'scan',
			'grade',
			'ash',
			'kenburns',
			'parallax',
			'tonemap',
			'fog',
			'vignette',
			'warm',
			'glitch'
		],
		params: {
			intensity: 44,
			fogAmt: 30,
			grainAmt: 14,
			bloomAmt: 16,
			dofAmt: 50,
			exposure: 106,
			zoomAmt: 45
		},
		fxParams: {
			parallax: { strength: 5 },
			ash: { turbulence: 24 },
			tonemap: { mode: 2 }
		},
		transition: { mode: 3, dur: 0.4 },
		dim: 0,
		glitch: { intervalMs: 5000, strength: 12 }
	},
	// Studio look 'ember-vhs' ported (2026-07-01). Studio-only slot (not phase-bound) — showcases the
	// newly ported focus family (tilt-shift, mode 1) + VHS carrier over a depth-parallax ember scene.
	// Pruned to engine-consumed fxParams only (like storm): dropped fog.mode (game renders its single
	// volumetric variant), blockglitch, and the turbulence of particles not in `fx` (embers/ash/sparks).
	'ember-vhs': {
		id: 'ember-vhs',
		image: '/assets/looks/ember-road.png',
		depth: '/assets/depth/ember-road-depth.png',
		fx: ['bloom', 'grade', 'warm', 'vignette', 'fog', 'kenburns', 'parallax', 'glitch', 'dust', 'vhs', 'focus'],
		params: {
			intensity: 21,
			fogAmt: 16,
			grainAmt: 12,
			bloomAmt: 18,
			dofAmt: 55,
			exposure: 108,
			zoomAmt: 40
		},
		fxParams: {
			focus: { mode: 1 },
			parallax: { strength: 6 },
			vhs: { strength: 16 },
			dust: { turbulence: 15 }
		},
		transition: { mode: 3, dur: 0.7 },
		dim: 0,
		glitch: { intervalMs: 6000, strength: 10 }
	},
	// Studio look 'night-glow' ported (2026-07-01). Studio-only slot (not phase-bound) — depth-parallax
	// night scene with a halation/bloom glow stack. fxParams pruned to what the engine reads for this
	// fx set: no focus/vhs/tonemap toggle here, so focus.mode/vhs/print/anamorphic and fog.mode are
	// dropped; only parallax.strength (depth reach) and ash.turbulence survive.
	'night-glow': {
		id: 'night-glow',
		image: '/assets/looks/night.jpeg',
		depth: '/assets/depth/night-depth.png',
		fx: ['kenburns', 'parallax', 'halation', 'glitch', 'vignette', 'scan', 'ash', 'warm', 'bloom'],
		params: {
			intensity: 22,
			fogAmt: 26,
			grainAmt: 40,
			bloomAmt: 40,
			dofAmt: 55,
			exposure: 118,
			zoomAmt: 41
		},
		fxParams: {
			parallax: { strength: 6 },
			ash: { turbulence: 12 }
		},
		transition: { mode: 2, dur: 0.8 },
		dim: 0.05,
		glitch: { intervalMs: 6000, strength: 10 }
	},
	'test-v4': {
		id: 'test-v4',
		image: '/assets/test-bg/arc-speranza.jpeg',
		fx: ['grade', 'warm', 'vignette', 'bloom', 'scan', 'glitch', 'sharpen', 'dust', 'kenburns'],
		params: {
			intensity: 68,
			fogAmt: 15,
			grainAmt: 24,
			bloomAmt: 8,
			dofAmt: 18,
			exposure: 112,
			zoomAmt: 54
		},
		transition: { mode: 2, dur: 0.8 },
		dim: 0,
		glitch: { intervalMs: 5000, strength: 15 }
	},
	test: {
		id: 'test',
		image: '/assets/test-bg/1.png',
		fx: [
			'bloom',
			'grade',
			'warm',
			'vignette',
			'glitch',
			'cool',
			'kenburns',
			'dither',
			'scan',
			'dust'
		],
		params: {
			intensity: 47,
			fogAmt: 18,
			grainAmt: 27,
			bloomAmt: 12,
			dofAmt: 18,
			exposure: 111,
			zoomAmt: 58
		},
		transition: { mode: 2, dur: 0.8 },
		dim: 0,
		glitch: { intervalMs: 5000, strength: 15 }
	},
	'test-v2': {
		id: 'test-v2',
		image: '/assets/test-bg/2.png',
		fx: [
			'kenburns',
			'grade',
			'warm',
			'vignette',
			'bloom',
			'heat',
			'scan',
			'glitch',
			'fog',
			'sharpen',
			'dither',
			'dust'
		],
		params: {
			intensity: 25,
			fogAmt: 15,
			grainAmt: 24,
			bloomAmt: 20,
			dofAmt: 18,
			exposure: 112,
			zoomAmt: 54
		},
		transition: { mode: 2, dur: 0.8 },
		dim: 0,
		glitch: { intervalMs: 5000, strength: 15 }
	},
	'test-v3': {
		id: 'test-v3',
		image: '/assets/test-bg/3.png',
		fx: [
			'grade',
			'warm',
			'vignette',
			'bloom',
			'glitch',
			'kenburns',
			'halation',
			'sharpen',
			'scan',
			'rain'
		],
		params: {
			intensity: 4,
			fogAmt: 14,
			grainAmt: 24,
			bloomAmt: 10,
			dofAmt: 14,
			exposure: 88,
			zoomAmt: 43
		},
		transition: { mode: 1, dur: 0.8 },
		dim: 0,
		glitch: { intervalMs: 5400, strength: 15 }
	},
	menu: {
		id: 'menu',
		image: '/assets/test-bg/4.png',
		fx: [
			'bloom',
			'kenburns',
			'grade',
			'warm',
			'vignette',
			'chroma',
			'scan',
			'glitch',
			'sharpen',
			'dither',
			'dust'
		],
		params: {
			intensity: 24,
			fogAmt: 15,
			grainAmt: 24,
			bloomAmt: 16,
			dofAmt: 18,
			exposure: 112,
			zoomAmt: 54
		},
		transition: { mode: 2, dur: 0.8 },
		dim: 0,
		glitch: { intervalMs: 5000, strength: 15 }
	}
};

// Named full-scene presets for the dev studio — a library of variants to A/B without touching the
// two live scenes. The 'current' entries reference SCENES (not copies), so they always mirror the
// shipped look and double as a "reset to current". Loading a preset clones it into the edited slot,
// so the live scenes are never overwritten. Add a variant by pasting a COPY CONFIG block as a new
// entry, e.g. 'session test v2': { id: 'session', image: '…', fx: […], … }.
export const SCENE_PRESETS: Record<string, SceneDef> = {
	'menu · current': SCENES.menu,
	'session · current': SCENES.session,
	'storm · filmic': SCENES.storm,
	'ember · vhs': SCENES['ember-vhs'],
	'night · glow': SCENES['night-glow']
};

// Scene image URLs to warm on load, menu first so the menu backdrop is decoded before the rest.
// The preloader backdrop, the static fallback <img>, and the engine's menu texture all read
// SCENES.menu.image, so the browser fetches one bitmap and the preloader→menu hand-off has no swap.
export const SCENE_IMAGE_URLS: readonly string[] = [SCENES.menu.image, SCENES.session.image];

// Phase→scene map: the single source of truth, extendable to per-state scenes with a one-line edit.
export const STATUS_SCENE: Record<GameStatus, SceneId> = {
	idle: 'menu',
	playing: 'session',
	paused: 'menu',
	tutorial: 'session',
	over: 'menu'
};

// The engine takes a full toggle object (replace, not merge); expand the scene's enabled list.
export function togglesFromFx(fx: readonly ToggleKey[]): Record<ToggleKey, boolean> {
	const out = {} as Record<ToggleKey, boolean>;
	for (const k of ALL_TOGGLE_KEYS) out[k] = false;
	for (const k of fx) out[k] = true;
	return out;
}
