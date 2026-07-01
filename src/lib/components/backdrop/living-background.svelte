<script lang="ts">
	import type { Engine } from './engine';
	import { getGameContext } from '$lib/store/game.svelte';
	import { SCENES, togglesFromFx, type SceneId } from './scenes';
	import { normalizeFxParams, normalizeParams, resolveProfile, resolveSceneId } from './profile';
	import { studio } from './backdrop-debug.svelte';

	const game = getGameContext();

	// prefers-reduced-motion takes the static path, same as the no-WebGPU path.
	const reducedMotion =
		typeof window !== 'undefined' &&
		(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

	// Static-cover fallback (no canvas, no rAF) when WebGPU is unavailable or motion is reduced.
	let useStatic = $state(reducedMotion);

	// The engine is purely decorative; the wrapper is the bridge that reads the phase and drives it.
	let engine = $state<Engine | undefined>();

	// Which image is currently uploaded per scene-id texture key, so the apply-effect can re-upload
	// when a scene's image changes at runtime (the studio swapping in a preset with a new image — the
	// engine caches textures by id and only preloads the two baked images at boot).
	const loadedImg: Partial<Record<SceneId, string>> = {};

	// Same, for each scene's optional depth map (uploaded under a `${id}:depth` texture key, sampled by
	// the parallax effect). Scenes without a depth map never load one and fall back to the engine's
	// stand-in.
	const loadedDepth: Partial<Record<SceneId, string>> = {};
	const depthKey = (id: SceneId) => `${id}:depth`;

	// Dev-only studio override: while the tuning panel is open it supplies the scene being edited so
	// edits show live on the real screen. `import.meta.env.DEV` is statically false in production, so
	// this branch (and the studio module it references) is eliminated from the production build.
	const override = $derived(import.meta.env.DEV ? studio.override : null);

	// Current scene from the game phase — same pure map the sim pins. Drives both the live engine
	// (below) and the static <img>, so the fallback switches with phase too. The studio override, when
	// present, takes precedence so the backdrop reflects what's being tuned.
	const scene = $derived(override ?? SCENES[resolveSceneId(game.gameLoop.status)]);

	// Glitch scheduler — wrapper-side per the prototype handoff (the engine only takes an amplitude via
	// setGlitch). Plain (non-reactive) frame state: an accumulator fires a glitch on a randomized
	// interval derived from the scene's intervalMs, then the amplitude decays back to 0 each frame.
	let glitchAmp = 0;
	let glitchAcc = 0;
	let glitchNext = 3;

	function fireGlitch(strength: number) {
		glitchAmp = Math.min(1, strength / 100 + 0.15);
		glitchAcc = 0;
	}

	function backdrop(node: HTMLCanvasElement) {
		let raf = 0;
		let last = performance.now();
		let dead = false; // unmounted while the async boot was still awaiting
		let eng: Engine | undefined; // shared by the loop and the visibility handler

		const loop = (now: number) => {
			let dt = (now - last) / 1000;
			last = now;
			if (dt > 0.1) dt = 0.1; // safety cap; tab-hidden is handled by cancelling the loop
			// Tutorial Mode freezes the backdrop on its current frame: keep the loop alive but skip
			// the tick and the glitch scheduler, preserving the "hold still while the player reads
			// coachmarks" contract. Paused and every other state keep animating.
			if (eng && game.gameLoop.status !== 'tutorial') {
				const s = scene; // current scene (phase-driven or studio override)
				if (s.fx.includes('glitch')) {
					glitchAcc += dt;
					if (glitchAcc >= glitchNext) {
						glitchNext = Math.max(0.4, (s.glitch.intervalMs / 1000) * (0.7 + Math.random() * 0.6));
						fireGlitch(s.glitch.strength);
					}
				}
				if (glitchAmp > 0) glitchAmp = Math.max(0, glitchAmp - dt * 3.0);
				eng.setGlitch(glitchAmp);
				eng.tick(dt);
			}
			raf = requestAnimationFrame(loop);
		};

		// Global cursor → engine, normalized 0..1 (the backdrop is fullscreen + pointer-events-none, so
		// track on window). Drives depth-parallax and ripple injection; a no-op when neither is active.
		const onPointer = (e: PointerEvent) => {
			eng?.setMouse(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
		};

		// Hidden tab → cancel the rAF loop entirely (don't drain GPU/battery in the background).
		// On return, reset `last` so the first visible frame's dt is small instead of jumping the
		// scene forward by the whole hidden duration.
		const onVisibility = () => {
			if (document.hidden) {
				cancelAnimationFrame(raf);
				raf = 0;
			} else if (eng && !raf && !dead) {
				last = performance.now();
				raf = requestAnimationFrame(loop);
			}
		};

		(async () => {
			if (!resolveProfile({ webgpuAvailable: !!navigator.gpu, reducedMotion }).animate) {
				useStatic = true;
				return;
			}
			try {
				const { createEngine } = await import('./engine');
				eng = await createEngine(node);
				if (dead) {
					eng.dispose();
					eng = undefined;
					return;
				}
				// Both scene textures up front so phase switches dissolve without a load gap.
				for (const s of Object.values(SCENES)) {
					eng.loadTexture(s.id, s.image);
					loadedImg[s.id] = s.image;
					if (s.depth) {
						eng.loadTexture(depthKey(s.id), s.depth);
						loadedDepth[s.id] = s.depth;
					}
				}

				last = performance.now();
				if (!document.hidden) raf = requestAnimationFrame(loop);
				document.addEventListener('visibilitychange', onVisibility);
				window.addEventListener('pointermove', onPointer);

				// Publish last so the apply-effect runs only once the engine is ready.
				engine = eng;
			} catch (e) {
				console.error('living-background: engine init failed', e);
				useStatic = true;
			}
		})();

		return () => {
			dead = true;
			cancelAnimationFrame(raf);
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('pointermove', onPointer);
			eng?.dispose();
			eng = undefined;
			engine = undefined;
		};
	}

	// Apply the current scene to the live engine. Runs once on boot (engine becomes defined) and on
	// every phase-driven scene change; setActive dissolves from the second call onward (engine.js).
	$effect(() => {
		const eng = engine;
		const s = scene;
		if (!eng) return;
		// Runtime image swap (studio preset with a new image): re-upload under this scene's key before
		// activating, else setActive would dissolve to the stale cached texture.
		if (loadedImg[s.id] !== s.image) {
			eng.loadTexture(s.id, s.image);
			loadedImg[s.id] = s.image;
		}
		// Runtime depth swap (studio preset with a new depth map), same guard as the image above.
		if (s.depth && loadedDepth[s.id] !== s.depth) {
			eng.loadTexture(depthKey(s.id), s.depth);
			loadedDepth[s.id] = s.depth;
		}
		eng.setDepth(s.depth ? depthKey(s.id) : null);
		eng.setTransition(s.transition.mode, s.transition.dur);
		eng.setToggles(togglesFromFx(s.fx));
		eng.setParams({ ...normalizeParams(s.params), ...normalizeFxParams(s.fxParams) });
		eng.setActive(s.id);
	});

	// Dev-only: let the studio's "Glitch now" button trigger one glitch immediately. DEV-guarded so
	// the studio reference (and this wiring) drops out of the production build.
	$effect(() => {
		if (!import.meta.env.DEV) return;
		studio.fireGlitchNow = () => fireGlitch(scene.glitch.strength);
		return () => {
			studio.fireGlitchNow = null;
		};
	});
</script>

{#if useStatic}
	<img
		src={scene.image}
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 h-full w-full object-cover"
	/>
{:else}
	<canvas
		{@attach backdrop}
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 h-full w-full"
	></canvas>
{/if}

<!-- Per-scene dimming for UI-legibility testing; defaults to 0 (no dim). -->
{#if scene.dim > 0}
	<div
		class="pointer-events-none absolute inset-0 bg-black"
		style="opacity: {scene.dim}"
		aria-hidden="true"
	></div>
{/if}
