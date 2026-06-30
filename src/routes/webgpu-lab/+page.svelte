<script>
	// @ts-nocheck — isolated prototype playground kept as-is; not type-checked (plain JS, like the engine core).
	// Full port of the claude-design WebGPU "Лаборатория" prototype onto a route.
	// Engine loaded as-is from /vendor/webgpu-lab.js (reference stays in claude-design/).
	// WebGPU-only: no WebGL2 fallback — if navigator.gpu is missing we show a static poster.

	const BG = '/assets/test-bg';
	// 7 scenes — handoff §5 keys; "fon 8" is missing so robert-berg-thedam-15 stands in.
	const TEX = [
		`${BG}/fon.jpeg`,
		`${BG}/fon3.jpeg`,
		`${BG}/robert-berg-thedam-15.jpeg`,
		`${BG}/fon5.jpeg`,
		`${BG}/fon4.jpeg`,
		`${BG}/particls-tuman.jpeg`,
		`${BG}/fon2.jpeg`
	];

	const PRESETS = [
		{ n: 'Плотина', idx: 0, fx: ['grade', 'tonemap', 'vignette', 'bloom', 'godrays', 'dust', 'grain', 'kenburns'], p: { intensity: 55, fogAmt: 0, grainAmt: 25, bloomAmt: 45, dofAmt: 15, glitchMs: 4000, strength: 30, exposure: 108, zoomAmt: 50 } },
		{ n: 'Тоннель', idx: 1, fx: ['grade', 'warm', 'tonemap', 'vignette', 'bloom', 'halation', 'embers', 'grain', 'kenburns'], p: { intensity: 80, fogAmt: 25, grainAmt: 35, bloomAmt: 65, dofAmt: 10, glitchMs: 4000, strength: 40, exposure: 110, zoomAmt: 50 } },
		{ n: 'Ночной лес', idx: 2, fx: ['grade', 'cool', 'tonemap', 'vignette', 'bloom', 'fog', 'rain', 'grain', 'kenburns'], p: { intensity: 90, fogAmt: 45, grainAmt: 35, bloomAmt: 40, dofAmt: 25, glitchMs: 5000, strength: 35, exposure: 100, zoomAmt: 50 } },
		{ n: 'Красный туман', idx: 3, fx: ['grade', 'tonemap', 'vignette', 'fog', 'embers', 'ash', 'glitch', 'grain', 'kenburns'], p: { intensity: 75, fogAmt: 70, grainAmt: 45, bloomAmt: 50, dofAmt: 15, glitchMs: 3200, strength: 55, exposure: 104, zoomAmt: 50 } },
		{ n: 'Ночные руины', idx: 4, fx: ['grade', 'cool', 'tonemap', 'vignette', 'bloom', 'fireflies', 'grain', 'kenburns'], p: { intensity: 60, fogAmt: 30, grainAmt: 30, bloomAmt: 75, dofAmt: 18, glitchMs: 5000, strength: 35, exposure: 106, zoomAmt: 50 } },
		{ n: 'Вулкан', idx: 5, fx: ['grade', 'warm', 'tonemap', 'vignette', 'bloom', 'halation', 'heat', 'embers', 'ash', 'kenburns'], p: { intensity: 105, fogAmt: 45, grainAmt: 35, bloomAmt: 75, dofAmt: 12, glitchMs: 4000, strength: 45, exposure: 110, zoomAmt: 50 } },
		{ n: 'Закат', idx: 6, fx: ['grade', 'warm', 'tonemap', 'vignette', 'bloom', 'halation', 'godrays', 'dust', 'grain', 'kenburns'], p: { intensity: 50, fogAmt: 0, grainAmt: 50, bloomAmt: 60, dofAmt: 30, glitchMs: 5000, strength: 28, exposure: 108, zoomAmt: 50 } }
	];

	const TRANS = ['Fade', 'Wipe', 'Раствор', 'Глитч', 'Пиксели'];

	const GROUPS = [
		{ title: 'ЦВЕТ', items: [['grade', 'Кинокор'], ['warm', 'Тёплый'], ['cool', 'Холодный'], ['sepia', 'Сепия'], ['mono', 'Ч/Б'], ['invert', 'Инверсия']] },
		{ title: 'ОПТИКА (шейдер)', items: [['vignette', 'Виньетка'], ['chroma', 'Хром. аберрация'], ['barrel', 'Дисторсия'], ['bloom', 'Свечение (bloom)'], ['heat', 'Тепловое марево'], ['poster', 'Постеризация'], ['dof', 'Глубина резкости']] },
		{ title: 'ПЛЁНКА', items: [['grain', 'Зерно'], ['scan', 'Сканлайны']] },
		{ title: 'ГЛИТЧ', items: [['glitch', 'RGB-глитч']] },
		{ title: 'АТМОСФЕРА', items: [['fog', 'Объёмный туман'], ['godrays', 'Объёмный свет']] },
		{ title: 'ПОСТ-ОБРАБОТКА', items: [['tonemap', 'Тонмаппинг ACES'], ['flare', 'Анаморф. блики'], ['halation', 'Halation'], ['sharpen', 'Резкость'], ['crt', 'CRT-маска'], ['dither', 'Дизеринг'], ['edge', 'Контур'], ['zoomblur', 'Zoom-блюр']] },
		{ title: 'СИМУЛЯЦИЯ (GPU)', items: [['ripple', 'Рябь / жидкость']] },
		{ title: 'ЧАСТИЦЫ (GPU)', items: [['embers', 'Угли'], ['ash', 'Пепел'], ['snow', 'Снег'], ['rain', 'Дождь'], ['fireflies', 'Светлячки'], ['sparks', 'Искры'], ['dust', 'Пыль']] },
		{ title: 'ДВИЖЕНИЕ КАДРА', items: [['kenburns', 'Дыхание кадра'], ['parallax', 'Depth-параллакс']] }
	];

	const PARAMS = [
		{ key: 'glitchMs', label: 'Интервал глитча', min: 800, max: 8000, step: 100, sec: true },
		{ key: 'strength', label: 'Сила глитча', min: 0, max: 100, step: 5 },
		{ key: 'intensity', label: 'Плотность частиц', min: 0, max: 150, step: 5 },
		{ key: 'fogAmt', label: 'Объёмный туман', min: 0, max: 100, step: 5 },
		{ key: 'bloomAmt', label: 'Свечение (bloom)', min: 0, max: 100, step: 5 },
		{ key: 'grainAmt', label: 'Зерно', min: 0, max: 100, step: 5 },
		{ key: 'dofAmt', label: 'Глубина резкости', min: 0, max: 100, step: 5 },
		{ key: 'exposure', label: 'Экспозиция', min: 50, max: 200, step: 5 },
		{ key: 'zoomAmt', label: 'Сила zoom-блюра', min: 0, max: 100, step: 5 }
	];

	const FX_KEYS = GROUPS.flatMap((g) => g.items.map(([k]) => k));
	const PCOUNT = { embers: 3000, ash: 2500, snow: 4000, rain: 5000, fireflies: 500, sparks: 600, dust: 3000 };

	function allFalse() {
		const o = {};
		for (const k of FX_KEYS) o[k] = false;
		return o;
	}
	function fxFromPreset(i) {
		const o = allFalse();
		for (const k of PRESETS[i].fx) o[k] = true;
		return o;
	}

	// --- reactive state ---
	let showPanel = $state(true);
	let preset = $state(3);
	let frameIndex = $state(3);
	let fx = $state(fxFromPreset(3));
	let fps = $state(60);
	let glitching = $state(false);
	let animKey = $state(0);
	let error = $state('');
	let gpuError = $state(false);

	const P = PRESETS[3].p;
	let glitchMs = $state(P.glitchMs);
	let strength = $state(P.strength);
	let intensity = $state(P.intensity);
	let fogAmt = $state(P.fogAmt);
	let grainAmt = $state(P.grainAmt);
	let bloomAmt = $state(P.bloomAmt);
	let dofAmt = $state(P.dofAmt);
	let transMode = $state(2);
	let transDur = $state(800);
	let exposure = $state(P.exposure);
	let zoomAmt = $state(P.zoomAmt);

	let engine = $state(null);
	let panelEl = $state();

	// per-frame, non-reactive glitch scheduler state
	let glitchAmp = 0;
	let gAcc = 0;
	let gNext = 3;

	// --- derived ---
	const activeCount = $derived(Object.values(fx).filter(Boolean).length);
	const particleCount = $derived.by(() => {
		let pc = 0;
		for (const k in PCOUNT) if (fx[k]) pc += Math.round((PCOUNT[k] * intensity) / 100);
		return pc >= 1000 ? (pc / 1000).toFixed(1) + 'k' : String(pc);
	});
	const frameName = $derived(PRESETS[preset]?.n ?? 'Свободный режим');
	const fpsColor = $derived(fps >= 50 ? '#5fd38a' : fps >= 30 ? '#a78bfa' : '#ff5a6a');
	const stateDot = $derived(glitching ? '#ff3b5c' : '#5fd38a');

	// push toggles/params/transition to engine on any change (NOT setActive — that's applyPreset)
	$effect(() => {
		if (!engine) return;
		engine.setToggles({ ...fx });
		engine.setParams({
			intensity: intensity / 100,
			fogAmt: (fogAmt / 100) * 0.95,
			grainAmt: (grainAmt / 100) * 0.18,
			bloomAmt: (bloomAmt / 100) * 1.5,
			dofAmt: dofAmt / 100,
			exposure: exposure / 100,
			zoomAmt: zoomAmt / 100
		});
		engine.setTransition(transMode, transDur / 1000);
	});

	function loadEngine() {
		if (window.WebGPULab) return Promise.resolve();
		return new Promise((res, rej) => {
			const s = document.createElement('script');
			s.src = '/vendor/webgpu-lab.js';
			s.onload = () => res();
			s.onerror = () => rej(new Error('не удалось загрузить /vendor/webgpu-lab.js'));
			document.head.appendChild(s);
		});
	}

	// Escape the global game-shell stacking context so the view sits on top.
	function portal(node) {
		document.body.appendChild(node);
		return () => node.remove();
	}

	function canvasAttach(node) {
		let raf;
		let last = performance.now();
		let frames = 0;
		let fpsT = last;
		let eng;
		let dead = false; // unmounted while the async boot was still awaiting
		(async () => {
			if (!navigator.gpu) {
				gpuError = true;
				return;
			}
			try {
				await loadEngine();
				eng = await window.WebGPULab.createEngine(node);
				if (dead) {
					eng.dispose();
					return;
				}
				TEX.forEach((url, i) => eng.loadTexture('t' + i, url));
				eng.setActive('t' + frameIndex);
				engine = eng;
				const loop = (now) => {
					let dt = (now - last) / 1000;
					last = now;
					if (dt > 0.1) dt = 0.1;
					frames++;
					if (now - fpsT >= 500) {
						const v = Math.round((frames * 1000) / (now - fpsT));
						frames = 0;
						fpsT = now;
						if (v !== fps) fps = v;
					}
					if (fx.glitch) {
						gAcc += dt;
						if (gAcc >= gNext) {
							gAcc = 0;
							gNext = Math.max(0.4, (glitchMs / 1000) * (0.7 + Math.random() * 0.6));
							fireGlitch();
						}
					}
					if (glitchAmp > 0) glitchAmp = Math.max(0, glitchAmp - dt * 3.0);
					eng.setGlitch(glitchAmp);
					eng.tick(dt);
					const g = glitchAmp > 0.05;
					if (g !== glitching) glitching = g;
					raf = requestAnimationFrame(loop);
				};
				raf = requestAnimationFrame(loop);
			} catch (e) {
				const msg = String(e?.message || e);
				if (msg.includes('webgpu') || msg.includes('adapter')) gpuError = true;
				else error = msg;
			}
		})();
		return () => {
			dead = true;
			cancelAnimationFrame(raf);
			eng?.dispose();
		};
	}

	function onKey(e) {
		if (e.key === '`') {
			e.preventDefault();
			showPanel = !showPanel;
		} else if (e.key.toLowerCase() === 'g') {
			fireGlitch();
		} else if (e.key >= '1' && e.key <= '7') {
			applyPreset(Number(e.key) - 1);
		}
	}

	function fireGlitch() {
		glitchAmp = Math.min(1, strength / 100 + 0.15);
	}

	function toggleFx(key) {
		fx = { ...fx, [key]: !fx[key] };
		preset = -1;
	}

	function clearAll() {
		fx = allFalse();
		preset = -1;
	}

	function applyPreset(i) {
		const pr = PRESETS[i];
		gAcc = 0;
		engine?.setActive('t' + pr.idx);
		preset = i;
		frameIndex = pr.idx;
		fx = fxFromPreset(i);
		glitchMs = pr.p.glitchMs;
		strength = pr.p.strength;
		intensity = pr.p.intensity;
		fogAmt = pr.p.fogAmt;
		grainAmt = pr.p.grainAmt;
		bloomAmt = pr.p.bloomAmt;
		dofAmt = pr.p.dofAmt;
		exposure = pr.p.exposure;
		zoomAmt = pr.p.zoomAmt;
		animKey++;
	}

	function onMove(e) {
		if (!engine) return;
		const r = e.currentTarget.getBoundingClientRect();
		engine.setMouse((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
	}

	function startDrag(e) {
		if (!panelEl) return;
		const r = panelEl.getBoundingClientRect();
		const ox = e.clientX - r.left;
		const oy = e.clientY - r.top;
		panelEl.style.right = 'auto';
		const move = (ev) => {
			panelEl.style.left = ev.clientX - ox + 'px';
			panelEl.style.top = ev.clientY - oy + 'px';
		};
		const up = () => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
	}

	function paramValue(key) {
		switch (key) {
			case 'glitchMs': return glitchMs;
			case 'strength': return strength;
			case 'intensity': return intensity;
			case 'fogAmt': return fogAmt;
			case 'grainAmt': return grainAmt;
			case 'bloomAmt': return bloomAmt;
			case 'dofAmt': return dofAmt;
			case 'exposure': return exposure;
			case 'zoomAmt': return zoomAmt;
		}
	}
	function setParam(key, v) {
		const n = Number(v);
		switch (key) {
			case 'glitchMs': glitchMs = n; break;
			case 'strength': strength = n; break;
			case 'intensity': intensity = n; break;
			case 'fogAmt': fogAmt = n; break;
			case 'grainAmt': grainAmt = n; break;
			case 'bloomAmt': bloomAmt = n; break;
			case 'dofAmt': dofAmt = n; break;
			case 'exposure': exposure = n; break;
			case 'zoomAmt': zoomAmt = n; break;
		}
	}
</script>

<svelte:window onkeydown={onKey} />

<div class="stage" {@attach portal} onpointermove={onMove}>
	<canvas {@attach canvasAttach}></canvas>

	{#if gpuError}
		<div class="fallback">
			<img src={TEX[frameIndex]} alt="" />
			<div class="fallback-msg">WebGPU недоступен в этом браузере</div>
		</div>
	{:else}
		{#key animKey}
			<div class="badge">
				<div class="badge-top">
					<span class="tag">WEBGPU</span>
					{String(frameIndex + 1).padStart(2, '0')} / 07
				</div>
				<div class="title">{frameName}</div>
			</div>
		{/key}

		{#if error}
			<div class="err">Ошибка движка: {error}</div>
		{/if}

		{#if showPanel}
			<div class="panel kt-scroll" bind:this={panelEl}>
				<div class="phdr" onpointerdown={startDrag}>
					<span class="phdr-l">
						<span class="dot" style="background:{stateDot}; box-shadow:0 0 8px {stateDot};"></span>
						WEBGPU · ШЕЙДЕРЫ
					</span>
					<button class="x" onclick={() => (showPanel = false)} aria-label="Закрыть">✕</button>
				</div>

				<div class="pbody">
					<div class="lbl">ВАРИАНТЫ</div>
					<div class="presets">
						{#each PRESETS as pr, i}
							<button class="preset" class:on={i === preset} onclick={() => applyPreset(i)}>
								<span class="pnum">VARIANT {String(i + 1).padStart(2, '0')}</span>
								<span>{pr.n}</span>
							</button>
						{/each}
					</div>

					<div class="lbl">ПЕРЕХОД МЕЖДУ СЦЕНАМИ</div>
					<div class="trans">
						{#each TRANS as t, i}
							<button class="tbtn" class:on={i === transMode} onclick={() => (transMode = i)}>{t}</button>
						{/each}
					</div>
					<div class="prow">
						<span>Длительность</span>
						<span class="val">{(transDur / 1000).toFixed(1)}с</span>
					</div>
					<input class="kt-rng" type="range" min="200" max="2200" step="100" bind:value={transDur} />

					<div class="sep"></div>

					<div class="stats">
						<div class="stat"><span>FPS</span><b style="color:{fpsColor}">{fps}</b></div>
						<div class="stat"><span>ЧАСТИЦ</span><b>{particleCount}</b></div>
						<div class="stat"><span>ЭФФЕКТОВ</span><b>{activeCount}</b></div>
						<div class="stat"><span>РЕНДЕР</span><b style="color:#fff">GPU</b></div>
					</div>

					<div class="actions">
						<button class="btn-primary" onclick={fireGlitch}>ГЛИТЧ (G)</button>
						<button class="btn-ghost" onclick={clearAll}>ОЧИСТИТЬ</button>
					</div>

					{#each GROUPS as g}
						<div class="lbl">{g.title}</div>
						{#each g.items as [key, label]}
							<div
								class="tgl"
								onclick={() => toggleFx(key)}
								onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleFx(key))}
								role="switch"
								aria-checked={fx[key]}
								tabindex="0"
							>
								<span style="color:{fx[key] ? '#fff' : '#9aa3b4'}">{label}</span>
								<span class="sw" class:on={fx[key]}><span class="knob"></span></span>
							</div>
						{/each}
					{/each}

					<div class="sep"></div>
					<div class="lbl">ПАРАМЕТРЫ</div>
					{#each PARAMS as pm}
						<div class="prow">
							<span>{pm.label}</span>
							<span class="val">{pm.sec ? (paramValue(pm.key) / 1000).toFixed(1) + 'с' : paramValue(pm.key)}</span>
						</div>
						<input
							class="kt-rng"
							type="range"
							min={pm.min}
							max={pm.max}
							step={pm.step}
							value={paramValue(pm.key)}
							oninput={(e) => setParam(pm.key, e.currentTarget.value)}
						/>
					{/each}
				</div>
			</div>
		{:else}
			<button class="reopen" onclick={() => (showPanel = true)}>FX `</button>
		{/if}
	{/if}
</div>

<style>
	.stage {
		position: fixed;
		inset: 0;
		z-index: 9999;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #05060a;
		font-family: 'DM Mono', monospace;
		cursor: crosshair;
	}
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.fallback {
		position: absolute;
		inset: 0;
		z-index: 40;
	}
	.fallback img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.9) brightness(0.7);
	}
	.fallback-msg {
		position: absolute;
		left: 3%;
		bottom: 6%;
		color: #cfd6e4;
		font-size: 14px;
		letter-spacing: 0.12em;
	}
	.badge {
		position: absolute;
		left: 3%;
		top: 5.5%;
		z-index: 20;
		pointer-events: none;
		animation: fx-fade 0.5s ease;
	}
	.badge-top {
		font-size: 11px;
		letter-spacing: 0.2em;
		color: #a78bfa;
	}
	.tag {
		padding: 2px 6px;
		border: 1px solid rgba(167, 139, 250, 0.5);
		border-radius: 4px;
	}
	.title {
		font-size: clamp(20px, 2.4vw, 40px);
		font-weight: 500;
		color: #fff;
		margin-top: 7px;
		text-shadow: 0 2px 16px rgba(0, 0, 0, 0.7);
	}
	@keyframes fx-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.err {
		position: absolute;
		left: 3%;
		bottom: 5%;
		z-index: 30;
		color: #ff6b6b;
		font-size: 13px;
		max-width: 60%;
	}

	.panel {
		position: absolute;
		top: 18px;
		right: 18px;
		z-index: 50;
		width: 288px;
		max-height: calc(100% - 36px);
		overflow-y: auto;
		border-radius: 12px;
		background: rgba(8, 11, 18, 0.82);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(16px);
		box-shadow: 0 14px 50px rgba(0, 0, 0, 0.5);
		color: #cfd6e4;
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
		cursor: grab;
		background: rgba(12, 16, 26, 0.96);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}
	.phdr-l {
		display: flex;
		align-items: center;
		gap: 7px;
		letter-spacing: 0.14em;
		color: #fff;
		font-weight: 500;
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
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
	.presets {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.preset {
		display: flex;
		flex-direction: column;
		gap: 2px;
		align-items: flex-start;
		padding: 7px 9px;
		border-radius: 8px;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		font-size: 12px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
		color: #cfd6e4;
		transition: all 0.15s;
	}
	.preset.on {
		border-color: #a78bfa;
		background: rgba(167, 139, 250, 0.16);
		color: #fff;
	}
	.pnum {
		font-size: 9px;
		letter-spacing: 0.14em;
		color: #6b7488;
	}
	.preset.on .pnum {
		color: #a78bfa;
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
		font-size: 10px;
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
	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 7px 10px;
		margin-bottom: 12px;
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.stat span {
		color: #6b7488;
		letter-spacing: 0.1em;
	}
	.stat b {
		color: #a78bfa;
		font-size: 15px;
		font-weight: 500;
	}
	.actions {
		display: flex;
		gap: 7px;
		margin-bottom: 4px;
	}
	.btn-primary,
	.btn-ghost {
		flex: 1;
		padding: 8px 0;
		border-radius: 8px;
		font-family: inherit;
		font-size: 11px;
		letter-spacing: 0.06em;
		cursor: pointer;
	}
	.btn-primary {
		border: none;
		background: #a78bfa;
		color: #1b1033;
		font-weight: 500;
	}
	.btn-ghost {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.04);
		color: #cfd6e4;
	}
	.tgl {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 0;
		cursor: pointer;
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
		position: absolute;
		top: 18px;
		right: 18px;
		z-index: 50;
		padding: 7px 12px;
		border-radius: 999px;
		background: rgba(8, 11, 18, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #9aa3b4;
		font-size: 11px;
		letter-spacing: 0.12em;
		cursor: pointer;
		font-family: inherit;
		backdrop-filter: blur(10px);
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
