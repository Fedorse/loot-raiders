// Dev-only tuning state for the Living Background studio. Holds an editable draft of each scene and,
// while open, exposes the draft being edited as an `override` the wrapper renders in place of the
// phase-driven scene — so edits show on the real screen live. No engine/DOM imports: pure data the
// wrapper applies through its existing apply-effect. The studio panel (debug-studio.svelte) is the
// only consumer besides that DEV-guarded read, so this module drops out of production builds with it.

import { SCENES, SCENE_PRESETS, type SceneDef, type SceneId, type ToggleKey } from './scenes';

function cloneScene(s: SceneDef): SceneDef {
	return {
		id: s.id,
		image: s.image,
		fx: [...s.fx],
		params: { ...s.params },
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
