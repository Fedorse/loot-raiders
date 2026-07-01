// Dev-only tuning state for the Living Background studio. Holds an editable draft of each scene and,
// while open, exposes the draft being edited as an `override` the wrapper renders in place of the
// phase-driven scene — so edits show on the real screen live. No engine/DOM imports: pure data the
// wrapper applies through its existing apply-effect. The studio panel (debug-studio.svelte) is the
// only consumer besides that DEV-guarded read, so this module drops out of production builds with it.

import {
	SCENES,
	SCENE_PRESETS,
	type SceneDef,
	type SceneFxParams,
	type SceneId,
	type ToggleKey
} from './scenes';

const cloneFxParams = (fx: SceneFxParams): SceneFxParams =>
	Object.fromEntries(Object.entries(fx).map(([k, v]) => [k, { ...v }]));

function cloneScene(s: SceneDef): SceneDef {
	return {
		id: s.id,
		image: s.image,
		// depth/fxParams are optional and must survive the clone, else the studio override path (drafts +
		// loadPreset + exportConfig) would silently drop depth-parallax and the per-effect params.
		...(s.depth !== undefined ? { depth: s.depth } : {}),
		fx: [...s.fx],
		params: { ...s.params },
		...(s.fxParams !== undefined ? { fxParams: cloneFxParams(s.fxParams) } : {}),
		transition: { ...s.transition },
		dim: s.dim,
		glitch: { ...s.glitch }
	};
}

class BackdropStudio {
	open = $state(false);
	editing = $state<SceneId>('menu');
	// Editable copies, seeded from the baked config so the panel opens on the current look. Derived
	// from SCENES so every scene id gets a draft automatically — adding a scene needs no edit here, and
	// the studio's slot keys can't drift out of sync with the baked ids (that mismatch crashes `current`).
	drafts: Record<SceneId, SceneDef> = $state(
		Object.fromEntries(
			(Object.keys(SCENES) as SceneId[]).map((id) => [id, cloneScene(SCENES[id])])
		) as Record<SceneId, SceneDef>
	);

	// The draft currently selected for editing.
	get current(): SceneDef {
		return this.drafts[this.editing];
	}

	// Depth-parallax cursor-shift strength (fxParams.parallax.strength, panel 0–100 → parallaxAmt
	// strength×0.001). Flat accessor for the studio slider: reading falls back to the normalize default
	// (50), writing lazily materializes the nested fxParams so a scene without it can still be tuned. The
	// value rides into exportConfig (COPY CONFIG) like any other field. Only takes visible effect while
	// the 'parallax' toggle is on and the scene has a depth map.
	get parallaxStrength(): number {
		return this.current.fxParams?.parallax?.strength ?? 50;
	}
	set parallaxStrength(v: number) {
		const s = this.current;
		if (!s.fxParams) s.fxParams = {};
		if (!s.fxParams.parallax) s.fxParams.parallax = {};
		s.fxParams.parallax.strength = v;
	}

	// Focus family mode (fxParams.focus.mode): 0 radial · 1 tilt-shift · 2 depth. Same lazy-materialize
	// pattern as parallaxStrength; only visible while the 'focus' toggle is on (mode 2 also needs a depth map).
	get focusMode(): number {
		return this.current.fxParams?.focus?.mode ?? 0;
	}
	set focusMode(v: number) {
		const s = this.current;
		if (!s.fxParams) s.fxParams = {};
		if (!s.fxParams.focus) s.fxParams.focus = {};
		s.fxParams.focus.mode = v;
	}

	// VHS artifact strength (fxParams.vhs.strength, panel 0–100 → vhsAmt ×0.01). Only visible while the
	// 'vhs' toggle is on. Same lazy-materialize pattern as parallaxStrength.
	get vhsStrength(): number {
		return this.current.fxParams?.vhs?.strength ?? 55;
	}
	set vhsStrength(v: number) {
		const s = this.current;
		if (!s.fxParams) s.fxParams = {};
		if (!s.fxParams.vhs) s.fxParams.vhs = {};
		s.fxParams.vhs.strength = v;
	}

	// What the backdrop should show: the edited draft while the panel is open (so tuning is visible
	// on the real screen), null when closed so the wrapper resumes phase-driven scene selection.
	get override(): SceneDef | null {
		return this.open ? this.drafts[this.editing] : null;
	}

	// Registered by the wrapper (dev only) so the panel's "Glitch now" button can fire one immediately;
	// a plain slot, not reactive state, so reading scene.glitch.strength stays a wrapper concern.
	fireGlitchNow: (() => void) | null = null;

	toggle(): void {
		this.open = !this.open;
	}

	hasFx(key: ToggleKey): boolean {
		return this.current.fx.includes(key);
	}

	toggleFx(key: ToggleKey): void {
		const fx = this.current.fx;
		this.current.fx = fx.includes(key) ? fx.filter((k) => k !== key) : [...fx, key];
	}

	// Names of the saved presets, for the studio's picker.
	get presetNames(): string[] {
		return Object.keys(SCENE_PRESETS);
	}

	// Load a named preset into the current editing slot. Cloned so the preset stays pristine, and the
	// slot id is preserved (drafts are keyed by slot) while image/fx/params come from the preset — so a
	// preset authored for either scene can be dropped into whichever slot is being edited.
	loadPreset(name: string): void {
		const p = SCENE_PRESETS[name];
		if (!p) return;
		this.drafts[this.editing] = { ...cloneScene(p), id: this.editing };
	}

	// JSON in SceneDef shape and panel scale — pastes straight into scenes.ts with no recalculation.
	exportConfig(): string {
		return JSON.stringify(this.current, null, '\t');
	}
}

export const studio = new BackdropStudio();
