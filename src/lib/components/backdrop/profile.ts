// Pure backdrop decision logic — no DOM or engine imports, so it runs headless under vite-node.

import type { EngineParams } from './engine';
import type { GameStatus } from '$lib/store/game-loop.svelte';
import type { SceneFxParams, SceneId } from './scenes';
import { STATUS_SCENE } from './scenes';

// Phase→scene resolution. STATUS_SCENE (in scenes.ts) is the single source of truth; the map is
// total over GameStatus, so adding a status forces a one-line edit there to keep this exhaustive.
export function resolveSceneId(status: GameStatus): SceneId {
	return STATUS_SCENE[status];
}

// Params live in PANEL scale (0–100 / ms) so the debug panel's future "Copy config" pastes back
// with no recalculation; they are normalized to engine scale only at apply time.
export interface PanelParams {
	intensity: number;
	fogAmt: number;
	grainAmt: number;
	bloomAmt: number;
	dofAmt: number;
	exposure: number;
	zoomAmt: number;
}

// Particle toggle keys, in engine PT order — per-type turbulence is keyed by these.
export const PARTICLE_KEYS = [
	'embers',
	'ash',
	'snow',
	'rain',
	'fireflies',
	'sparks',
	'dust'
] as const;

// Panel→engine normalization, mirroring the prototype wrapper. tonemapMode/turb come from fxParams
// (normalizeFxParams) and are merged in by the wrapper, so defaults here keep the base params complete.
export function normalizeParams(p: PanelParams): EngineParams {
	return {
		intensity: p.intensity / 100,
		fogAmt: (p.fogAmt / 100) * 0.95,
		grainAmt: (p.grainAmt / 100) * 0.18,
		bloomAmt: (p.bloomAmt / 100) * 1.5,
		dofAmt: p.dofAmt / 100,
		exposure: p.exposure / 100,
		zoomAmt: p.zoomAmt / 100,
		tonemapMode: 0,
		focusMode: 0,
		vhsAmt: 0,
		turb: {},
		parallaxAmt: 0.05
	};
}

// Panel→engine normalization for per-effect params (Studio fxParams), mirroring normalizeParams. Only
// the subset the engine reads today: tonemap curve index (raw passthrough), focus family mode (raw
// passthrough), VHS strength (panel 0–100 → ×0.01, default 55 → 0.55, matching Studio), per-particle
// turbulence (panel 0–100 → ×0.002, matching Studio), and depth-parallax reach (parallax.strength
// 0–100 → ×0.001, default 50 → 0.05). Returns a full turb object over PARTICLE_KEYS so switching scenes
// always clears the previous look's turbulence. Unknown fxParams keys are ignored.
export function normalizeFxParams(
	fxParams: SceneFxParams | undefined
): Pick<EngineParams, 'tonemapMode' | 'focusMode' | 'vhsAmt' | 'turb' | 'parallaxAmt'> {
	const fx = fxParams ?? {};
	const turb: Record<string, number> = {};
	for (const k of PARTICLE_KEYS) turb[k] = (fx[k]?.turbulence ?? 0) * 0.002;
	return {
		tonemapMode: fx.tonemap?.mode ?? 0,
		focusMode: fx.focus?.mode ?? 0,
		vhsAmt: (fx.vhs?.strength ?? 55) * 0.01,
		turb,
		parallaxAmt: (fx.parallax?.strength ?? 50) * 0.001
	};
}

export interface BackdropEnv {
	webgpuAvailable: boolean;
	reducedMotion: boolean;
}

export interface BackdropProfile {
	// true → drive the WebGPU engine; false → show the static cover image.
	animate: boolean;
}

// WebGPU-only: the engine is the single render path. We animate only when WebGPU exists AND the
// user hasn't asked to reduce motion; either gap takes the static-image floor.
export function resolveProfile(env: BackdropEnv): BackdropProfile {
	return { animate: env.webgpuAvailable && !env.reducedMotion };
}
