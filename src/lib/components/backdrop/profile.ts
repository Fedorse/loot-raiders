// Pure backdrop decision logic — no DOM or engine imports, so it runs headless under vite-node.

import type { EngineParams } from './engine';
import type { GameStatus } from '$lib/store/game-loop.svelte';
import type { SceneId } from './scenes';
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

// Panel→engine normalization, mirroring the prototype wrapper.
export function normalizeParams(p: PanelParams): EngineParams {
	return {
		intensity: p.intensity / 100,
		fogAmt: (p.fogAmt / 100) * 0.95,
		grainAmt: (p.grainAmt / 100) * 0.18,
		bloomAmt: (p.bloomAmt / 100) * 1.5,
		dofAmt: p.dofAmt / 100,
		exposure: p.exposure / 100,
		zoomAmt: p.zoomAmt / 100
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
