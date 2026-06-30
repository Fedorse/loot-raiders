<script lang="ts">
	// Dev-only Living Background tuning studio. Mounted only under import.meta.env.DEV (see +layout),
	// so it — and its toggle button and shortcut — are absent from production builds entirely.
	// It edits the studio drafts; the wrapper renders the edited draft live (backdrop-debug.svelte).
	import { studio } from './backdrop-debug.svelte';
	import { SCENES, type SceneId, type ToggleKey } from './scenes';
	import { type PanelParams } from './profile';
	import { getGameContext } from '$lib/store/game.svelte';

	// Freezing the game-loop while tuning a scene: a live run's timer keeps counting under the panel
	// and would flip to 'over' mid-edit (and the studio override keeps the scene pinned, so the swap
	// is invisible but the run still ends). Pausing here stops the clock so the scene holds.
	const loop = getGameContext().gameLoop;
	const isPaused = $derived(loop.status === 'paused');
	const canPause = $derived(loop.status === 'playing' || loop.status === 'tutorial');
	const pauseLabel = $derived(
		isPaused ? '▶ RESUME GAME' : canPause ? '⏸ PAUSE GAME' : `GAME ${loop.status.toUpperCase()}`
	);

	function togglePause() {
		if (isPaused) loop.resume();
		else if (canPause) loop.pause();
	}

	// Derived from SCENES so the selector lists every scene automatically — no hand-kept list to drift.
	const SCENE_IDS = Object.keys(SCENES) as SceneId[];

	// Preset picker: the dropdown selects a name; LOAD clones it into the editing slot (studio store).
	let selectedPreset = $state(studio.presetNames[0]);

	// Engine transition modes, indexed as the engine expects them (engine.js setTransition).
	const TRANSITIONS = ['Fade', 'Wipe', 'Dissolve', 'Glitch', 'Pixels'];

	// Effect toggles grouped for legibility; keys are the engine's ToggleKey set.
	const GROUPS: { title: string; items: [ToggleKey, string][] }[] = [
		{
			title: 'COLOR',
			items: [
				['grade', 'Cinematic'],
				['warm', 'Warm'],
				['cool', 'Cool'],
				['sepia', 'Sepia'],
				['mono', 'B/W'],
				['invert', 'Invert']
			]
		},
		{
			title: 'OPTICS',
			items: [
				['vignette', 'Vignette'],
				['chroma', 'Chromatic ab.'],
				['barrel', 'Distortion'],
				['bloom', 'Bloom'],
				['heat', 'Heat haze'],
				['poster', 'Posterize'],
				['dof', 'Depth of field']
			]
		},
		{
			title: 'FILM',
			items: [
				['grain', 'Grain'],
				['scan', 'Scanlines']
			]
		},
		{ title: 'GLITCH', items: [['glitch', 'RGB glitch']] },
		{
			title: 'ATMOSPHERE',
			items: [
				['fog', 'Volumetric fog'],
				['godrays', 'God rays']
			]
		},
		{
			title: 'POST',
			items: [
				['tonemap', 'ACES tonemap'],
				['flare', 'Anamorphic flare'],
				['halation', 'Halation'],
				['sharpen', 'Sharpen'],
				['crt', 'CRT mask'],
				['dither', 'Dither'],
				['edge', 'Edge'],
				['zoomblur', 'Zoom blur']
			]
		},
		{ title: 'SIMULATION', items: [['ripple', 'Ripple / fluid']] },
		{
			title: 'PARTICLES',
			items: [
				['embers', 'Embers'],
				['ash', 'Ash'],
				['snow', 'Snow'],
				['rain', 'Rain'],
				['fireflies', 'Fireflies'],
				['sparks', 'Sparks'],
				['dust', 'Dust']
			]
		},
		{
			title: 'CAMERA',
			items: [
				['kenburns', 'Ken Burns'],
				['parallax', 'Depth parallax']
			]
		}
	];

	// Panel-scale parameter ranges, mirroring the /webgpu-lab sliders; values stay in panel scale and
	// are normalized to engine scale only at apply time (profile.normalizeParams).
	const PARAMS: { key: keyof PanelParams; label: string; min: number; max: number }[] = [
		{ key: 'intensity', label: 'Particle density', min: 0, max: 150 },
		{ key: 'fogAmt', label: 'Volumetric fog', min: 0, max: 100 },
		{ key: 'bloomAmt', label: 'Bloom', min: 0, max: 100 },
		{ key: 'grainAmt', label: 'Grain', min: 0, max: 100 },
		{ key: 'dofAmt', label: 'Depth of field', min: 0, max: 100 },
		{ key: 'exposure', label: 'Exposure', min: 50, max: 200 },
		{ key: 'zoomAmt', label: 'Zoom blur', min: 0, max: 100 }
	];

	let copied = $state(false);

	async function copyConfig() {
		await navigator.clipboard.writeText(studio.exportConfig());
		copied = true;
		setTimeout(() => (copied = false), 1200);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key !== '`') return;
		// Don't hijack the backtick while a field is focused (mirrors the global keydown guard).
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
		e.preventDefault();
		studio.toggle();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if studio.open}
	<div class="panel kt-scroll">
		<div class="phdr">
			<span class="phdr-l">BACKDROP STUDIO · DEV</span>
			<button class="x" onclick={() => (studio.open = false)} aria-label="Close">✕</button>
		</div>

		<div class="pbody">
			<button
				class="btn-pause"
				class:paused={isPaused}
				disabled={!canPause && !isPaused}
				onclick={togglePause}
			>
				{pauseLabel}
			</button>

			<div class="lbl">SCENE</div>
			<div class="row2">
				{#each SCENE_IDS as id (id)}
					<button
						class="seg"
						class:on={studio.editing === id}
						onclick={() => (studio.editing = id)}
					>
						{id}
					</button>
				{/each}
			</div>

			<div class="lbl">PRESET</div>
			<div class="preset">
				<select class="psel" bind:value={selectedPreset}>
					{#each studio.presetNames as name (name)}
						<option value={name}>{name}</option>
					{/each}
				</select>
				<button class="pload" onclick={() => studio.loadPreset(selectedPreset)}>LOAD</button>
			</div>

			<div class="lbl">TRANSITION</div>
			<div class="trans">
				{#each TRANSITIONS as t, i (t)}
					<button
						class="tbtn"
						class:on={studio.current.transition.mode === i}
						onclick={() => (studio.current.transition.mode = i)}
					>
						{t}
					</button>
				{/each}
			</div>
			<div class="prow">
				<span>Duration</span>
				<span class="val">{studio.current.transition.dur.toFixed(1)}s</span>
			</div>
			<input
				class="kt-rng"
				type="range"
				min="0.2"
				max="2.2"
				step="0.1"
				bind:value={studio.current.transition.dur}
			/>

			<div class="prow">
				<span>Dimming</span>
				<span class="val">{studio.current.dim.toFixed(2)}</span>
			</div>
			<input
				class="kt-rng"
				type="range"
				min="0"
				max="0.9"
				step="0.05"
				bind:value={studio.current.dim}
			/>

			<button class="btn-primary" onclick={copyConfig}>
				{copied ? 'COPIED ✓' : 'COPY CONFIG'}
			</button>

			{#each GROUPS as g (g.title)}
				<div class="lbl">{g.title}</div>
				{#each g.items as [key, label] (key)}
					<div
						class="tgl"
						onclick={() => studio.toggleFx(key)}
						onkeydown={(e) =>
							(e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), studio.toggleFx(key))}
						role="switch"
						aria-checked={studio.hasFx(key)}
						tabindex="0"
					>
						<span class="tlabel" class:on={studio.hasFx(key)}>{label}</span>
						<span class="sw" class:on={studio.hasFx(key)}><span class="knob"></span></span>
					</div>
				{/each}
			{/each}

			<div class="sep"></div>
			<div class="lbl">PARAMETERS</div>
			{#each PARAMS as pm (pm.key)}
				<div class="prow">
					<span>{pm.label}</span>
					<span class="val">{studio.current.params[pm.key]}</span>
				</div>
				<input
					class="kt-rng"
					type="range"
					min={pm.min}
					max={pm.max}
					step="1"
					bind:value={studio.current.params[pm.key]}
				/>
			{/each}

			<div class="sep"></div>
			<div class="lbl">GLITCH (needs the toggle above)</div>
			<div class="prow">
				<span>Interval</span>
				<span class="val">{(studio.current.glitch.intervalMs / 1000).toFixed(1)}s</span>
			</div>
			<input
				class="kt-rng"
				type="range"
				min="800"
				max="8000"
				step="100"
				bind:value={studio.current.glitch.intervalMs}
			/>
			<div class="prow">
				<span>Strength</span>
				<span class="val">{studio.current.glitch.strength}</span>
			</div>
			<input
				class="kt-rng"
				type="range"
				min="0"
				max="100"
				step="5"
				bind:value={studio.current.glitch.strength}
			/>
			<button class="btn-ghost" onclick={() => studio.fireGlitchNow?.()}>GLITCH NOW</button>
		</div>
	</div>
{:else}
	<button class="reopen" onclick={() => (studio.open = true)} title="Backdrop studio (`)"
		>FX `</button
	>
{/if}

<style>
	.panel {
		position: fixed;
		top: 18px;
		right: 18px;
		z-index: 80;
		width: 288px;
		max-height: calc(100% - 36px);
		overflow-y: auto;
		border-radius: 12px;
		background: rgba(8, 11, 18, 0.82);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(16px);
		box-shadow: 0 14px 50px rgba(0, 0, 0, 0.5);
		color: #cfd6e4;
		font-family: monospace;
		font-size: 11px;
	}
	.phdr {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 9px 12px;
		background: rgba(12, 16, 26, 0.96);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}
	.phdr-l {
		letter-spacing: 0.14em;
		color: #fff;
		font-weight: 500;
	}
	.x {
		cursor: pointer;
		color: #6b7488;
		background: none;
		border: none;
		font-size: 12px;
		padding: 0 2px;
	}
	.pbody {
		padding: 12px 13px 16px;
	}
	.lbl {
		color: #6b7488;
		letter-spacing: 0.18em;
		font-size: 10px;
		margin: 13px 0 9px;
	}
	.row2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.seg {
		padding: 8px 0;
		border-radius: 8px;
		cursor: pointer;
		font-family: inherit;
		font-size: 12px;
		text-transform: capitalize;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
		color: #cfd6e4;
		transition: all 0.15s;
	}
	.seg.on {
		border-color: #a78bfa;
		background: rgba(167, 139, 250, 0.16);
		color: #fff;
	}
	.preset {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 6px;
	}
	.psel {
		min-width: 0;
		padding: 7px 8px;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
		color: #cfd6e4;
		font-family: inherit;
		font-size: 11px;
		cursor: pointer;
	}
	.pload {
		padding: 7px 12px;
		border-radius: 8px;
		border: 1px solid rgba(167, 139, 250, 0.5);
		background: rgba(167, 139, 250, 0.16);
		color: #fff;
		font-family: inherit;
		font-size: 10px;
		letter-spacing: 0.08em;
		cursor: pointer;
	}
	.trans {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 5px;
		margin-bottom: 9px;
	}
	.tbtn {
		padding: 6px 4px;
		border-radius: 7px;
		cursor: pointer;
		font-family: inherit;
		font-size: 9px;
		text-align: center;
		transition: all 0.15s;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
		color: #9aa3b4;
	}
	.tbtn.on {
		border-color: #a78bfa;
		background: rgba(167, 139, 250, 0.16);
		color: #fff;
	}
	.prow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 12px 0 6px;
		color: #9aa3b4;
	}
	.prow .val {
		color: #a78bfa;
	}
	.sep {
		height: 1px;
		background: rgba(255, 255, 255, 0.08);
		margin: 13px 0;
	}
	.btn-primary {
		width: 100%;
		margin-top: 14px;
		padding: 9px 0;
		border: none;
		border-radius: 8px;
		background: #a78bfa;
		color: #1b1033;
		font-family: inherit;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.08em;
		cursor: pointer;
	}
	.btn-pause {
		width: 100%;
		padding: 9px 0;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.04);
		color: #cfd6e4;
		font-family: inherit;
		font-size: 11px;
		letter-spacing: 0.08em;
		cursor: pointer;
		transition: all 0.15s;
	}
	.btn-pause.paused {
		border-color: #a78bfa;
		background: rgba(167, 139, 250, 0.16);
		color: #fff;
	}
	.btn-pause:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.btn-ghost {
		width: 100%;
		margin-top: 10px;
		padding: 8px 0;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.04);
		color: #cfd6e4;
		font-family: inherit;
		font-size: 11px;
		letter-spacing: 0.08em;
		cursor: pointer;
	}
	.tgl {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 0;
		cursor: pointer;
	}
	.tlabel {
		color: #9aa3b4;
	}
	.tlabel.on {
		color: #fff;
	}
	.sw {
		position: relative;
		width: 30px;
		height: 16px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.14);
		flex: none;
		transition: background 0.15s;
	}
	.sw.on {
		background: #a78bfa;
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #0b1020;
		transition: transform 0.15s;
	}
	.sw.on .knob {
		transform: translateX(14px);
	}
	.reopen {
		position: fixed;
		bottom: 14px;
		left: 14px;
		z-index: 80;
		padding: 6px 11px;
		border-radius: 999px;
		background: rgba(8, 11, 18, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #9aa3b4;
		font-family: monospace;
		font-size: 11px;
		letter-spacing: 0.12em;
		cursor: pointer;
		opacity: 0.6;
		backdrop-filter: blur(10px);
		transition: opacity 0.15s;
	}
	.reopen:hover {
		opacity: 1;
	}
	.kt-rng {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 3px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.16);
		outline: none;
	}
	.kt-rng::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #a78bfa;
		cursor: pointer;
		box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.18);
	}
	.kt-rng::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border: none;
		border-radius: 50%;
		background: #a78bfa;
		cursor: pointer;
	}
	.kt-scroll::-webkit-scrollbar {
		width: 8px;
	}
	.kt-scroll::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.14);
		border-radius: 4px;
	}
</style>
