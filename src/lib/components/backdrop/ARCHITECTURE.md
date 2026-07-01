# Living Background — architecture

The Living Background is a full-screen WebGPU backdrop: a photographic scene with procedural
atmosphere (fog, particles, godrays), camera moves (parallax, Ken Burns), transitions, and a
post-processing stack. This doc explains how the pieces fit so the engine stays understandable and
extensible after a gap. It travels with the engine — when `engine.js` is hand-synced into the
Studio repo (per [ADR 0001](../../../../docs/adr/0001-extract-living-background-studio.md)), copy
this file too.

> **Current state vs target.** ADR 0001 splits this into a standalone Studio repo (the engine's
> evolving home) and a pruned game consumer. That split has not happened yet — everything below
> still lives in `src/lib/components/backdrop/` inside the game. The four-layer shape described here
> is both today's module boundary and the target: the engine core and the pure module are already
> de-gamed; only the wrapper (`living-background.svelte`) and editor (`debug-studio.svelte`) still
> carry game coupling, which the extraction removes.

## The four layers

```
┌─────────────────────────────────────────────────────────────┐
│ 4. Studio editor        debug-studio.svelte                  │  Svelte, dev/editor only
│    drag image · toggle effects · sliders · copy config       │
├─────────────────────────────────────────────────────────────┤
│ 3. <Backdrop> wrapper   living-background.svelte             │  Svelte
│    canvas lifecycle · rAF loop · glitch scheduler ·          │
│    visibility · reduced-motion · static fallback             │
├─────────────────────────────────────────────────────────────┤
│ 2. look → engine        profile.ts + scenes.ts               │  pure TS, headless
│    normalizeParams · togglesFromFx · ALL_TOGGLE_KEYS         │  ← the single test seam
├─────────────────────────────────────────────────────────────┤
│ 1. engine core          engine.js + engine.d.ts              │  vanilla WebGPU, framework-agnostic
│    WGSL monolith · pipelines · uniform packing · render()    │
└─────────────────────────────────────────────────────────────┘
```

**1. Engine core (`engine.js`, typed by `engine.d.ts`).** Framework-agnostic vanilla WebGPU. No
DOM framework, no game imports. It owns the device, pipelines, render targets, texture loading, the
WGSL shaders, and the per-frame `render()`. Public API (see `engine.d.ts`):

| Method                                     | Purpose                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| `createEngine(canvas)` → `Promise<Engine>` | Async: requests adapter/device, builds pipelines.                                    |
| `loadTexture(key, url)`                    | Fetch + decode an image into a GPU texture under `key`.                              |
| `setActive(key)`                           | Make `key` the current scene; from the 2nd call on it cross-fades from the previous. |
| `setTransition(modeIdx, durSec)`           | Transition style (0 fade · 1 wipe · 2 dissolve · 3 glitch · 4 pixels) + duration.    |
| `setMouse(x, y)`                           | Normalized cursor for parallax / ripple injection.                                   |
| `setToggles(toggles)`                      | **Replace** the full toggle object (not merge).                                      |
| `setParams(params)`                        | Merge engine-scale numeric params.                                                   |
| `setGlitch(v)`                             | Glitch amplitude 0..1 (driven by the wrapper, see below).                            |
| `transitioning()`                          | `true` while a cross-fade is in progress.                                            |
| `tick(dt)`                                 | Advance time by `dt` seconds and render one frame.                                   |
| `dispose()`                                | Tear down observers, textures, buffers, device.                                      |

The engine is **uniform-driven**: every effect is a `if(flag > 0.5)` branch in WGSL, gated by a flag
the CPU packs into a fixed uniform slot each frame. There is one set of pipelines; effects are never
recompiled. The trade-off is the extensibility ceiling (last section).

**2. look → engine module (`profile.ts` + `scenes.ts`).** Pure TypeScript, no DOM/engine imports,
runs headless under vite-node — this is the **single test seam** (`scripts/backdrop-sim.ts`,
`pnpm bg`). It translates a _look_ (author-facing config) into _engine_ inputs:

- `normalizeParams(PanelParams)` → `EngineParams` — maps panel scale (0–100 / ms) to engine scale
  using fixed multipliers (e.g. `bloomAmt/100*1.5`, `fogAmt/100*0.95`).
- `togglesFromFx(fx[])` → full `Record<ToggleKey, boolean>` — expands the enabled list into the
  complete toggle object the engine expects (every other key `false`).
- `ALL_TOGGLE_KEYS` / `ToggleKey` / `SceneDef` — the config vocabulary (next section).
- `resolveProfile(env)` — decides animate-with-engine vs static-image floor.
- `resolveSceneId(status)` / `STATUS_SCENE` — **game-only** phase→scene binding; this does _not_
  port to the Studio lib (see boundary section).

**3. `<Backdrop>` wrapper (`living-background.svelte`).** The Svelte bridge that owns the
imperative lifecycle so consumers never touch WebGPU:

- mounts the `<canvas>`, lazily `import()`s and `await`s `createEngine` (keeps the engine out of the
  main bundle),
- runs the `requestAnimationFrame` loop and calls `tick(dt)`,
- schedules the **periodic glitch** wrapper-side (an accumulator fires `setGlitch`, then decays the
  amplitude each frame) — this is timing/decay, not a uniform, so it lives in the config under
  `glitch`, apart from `params`,
- cancels the loop on tab-hidden (`visibilitychange`) to spare GPU/battery,
- falls back to a static `<img>` when WebGPU is absent or `prefers-reduced-motion` is set,
- caps `dt` so a long stall can't jump the scene forward.

Today this wrapper reads game phase via `getGameContext()`. The de-gamed target is
`<Backdrop config active />` — the host passes a look and an active id; the wrapper owns everything
else.

**4. Studio editor (`debug-studio.svelte`).** Author-facing tuning UI: scene/preset picker, effect
toggles grouped by category, parameter sliders, transition + dim + glitch controls, and **copy
config** (exports a `SceneDef` JSON in panel scale, ready to paste into `scenes.ts`). Currently a
dev-only in-game panel gated by `import.meta.env.DEV`; the target is a standalone SvelteKit editor.

## Config shape (the "look")

A look is a `SceneDef` (`scenes.ts`). It is author-facing **panel scale** — the same shape the
editor exports and a consumer pastes back, with no recalculation until apply time.

```ts
interface SceneDef {
	id: SceneId; // game: closed union · lib: widened to `string`
	image: string; // background image URL
	fx: ToggleKey[]; // enabled effects (expanded by togglesFromFx)
	params: PanelParams; // intensity/fog/grain/bloom/dof/exposure/zoom, 0–100
	transition: { mode: number; dur: number }; // mode 0..4, duration seconds
	dim: number; // 0..1 backdrop dimming overlay
	glitch: { intervalMs: number; strength: number }; // wrapper-side scheduler, NOT a uniform
}
```

Two scales exist, and the boundary between them is deliberate:

- **Panel scale** (`PanelParams`, 0–100 / ms) — what the author tunes and what the config stores.
- **Engine scale** (`EngineParams`, normalized multipliers) — what `setParams` consumes.

`normalizeParams` is the only crossing point. Keeping the config in panel scale means _copy config_
round-trips losslessly (panel → JSON → panel) and a saved look survives re-import unchanged.

`ALL_TOGGLE_KEYS` is the closed list of effect names (36 today), grouped by category in the editor:
color, optics, film, atmosphere, particles, camera, post, simulation, glitch.

## The engine → consumer boundary

The rule from ADR 0001 is **"widen in the lib, narrow in the consumer."**

- The **engine** knows nothing about the game. It takes a full toggle object and engine-scale params
  and renders. `setToggles` replaces the whole object; `setParams` merges.
- The **pure module** is the translation layer: panel→engine numbers, fx-list→toggle-object. A good
  test asserts this external behavior (inputs are configs/params; outputs are normalized params,
  toggle objects, re-serialized configs) — never the WGSL.
- The **wrapper** owns canvas lifecycle, the rAF loop, the wrapper-side glitch scheduler,
  visibility, reduced-motion, and the static fallback. In the lib it has **no game imports**; the
  host drives scene selection via the `active` prop.
- **Phase-binding stays game-side.** `SceneId` (closed union), `STATUS_SCENE`, and `resolveSceneId`
  are the game's concern. The Studio lib widens `id` to a free `string` and drops these, so any
  consumer picks its own ids — and the game's existing exported JSON still validates against the lib
  unchanged.
- `createEngine` is **async** (adapter/device request); the wrapper awaits it during mount.

## How to add an effect

Under the current monolith, an effect is wired by hand across four places. Concrete steps:

### 1. Add the WGSL branch

Pick the right shader for _when_ the effect runs (see render pass order below):

- **Scene-space** (color grade, atmosphere, camera/UV warps, transitions) → `SCENE_WGSL`, runs on
  the base image before composite.
- **Post / full-frame** (vignette, grain, tonemap, CRT, sharpen, edge, zoom blur, bloom/dof mix) →
  `COMP_WGSL`, runs on the composited frame.
- **A new particle type** → add a `ty == N` branch in `PART_WGSL` and a row to the `COUNTS` /
  `ADDITIVE` / `ROUND` / `PT` arrays in `engine.js`.

Gate the branch on a flag read from a uniform slot, e.g. `if(fMyEffect > 0.5){ … }`.

### 2. Claim a fixed uniform slot

Flags and numeric params live at fixed indices in a `Float32Array` (CPU) that maps onto an
`array<vec4<f32>, N>` (WGSL). You must wire **both ends** to the same index:

- **WGSL**: read it, e.g. `let fMyEffect = U_.d[6].w;` (a free lane).
- **JS `render()`**: write it, e.g. `fScene[27] = tf('myeffect');` (the matching index).

Current slot layout (each `vec4` = 4 floats; `fScene[k]` ↔ `U_.d[k>>2][k&3]`):

```
ubScene (7 vec4, fScene[0..27]):
  d[0] time, canvasAspect(W/H), curImgAspect, prevImgAspect
  d[1] mouse.x, mouse.y, ripTexel.x(1/RW), ripTexel.y(1/RH)
  d[2] trans, transMode, fogAmt, —
  d[3] grade, warm, cool, sepia          ← toggle flags
  d[4] mono, invert, chroma, barrel
  d[5] heat, poster, fog, godrays
  d[6] parallax, ripple, kenburns, [FREE: fScene[27]]

ubComp (7 vec4, fComp[0..27]):
  d[0] time, glitch, grainAmt, bloomAmt
  d[1] dofAmt, exposure, zoomAmt, —
  d[2] texelF.x(1/W), texelF.y(1/H), tonemapMode, focusMode
  d[3] bloom, focus, vignette, scan      ← toggle flags
  d[4] grain, tonemap, flare, halation
  d[5] sharpen, crt, dither, edge
  d[6] zoomblur, vhs, vhsAmt, [FREE]
```

The composite pass binds an extra texture beyond scene/bloom/dof: the depth map at `@binding(5)`
(same texture the scene pass reads for parallax), sampled only by the focus family's depth mode.

Use a `[FREE]` lane if one is left. If none remain, you must grow the array: bump the `array<vec4,N>`
length in the WGSL `struct U`, the `Float32Array(28)` size, and the `buf(7)` allocation together —
all three must stay in lockstep (see ceiling below).

### 3. Add the `ALL_TOGGLE_KEYS` entry

Append the new key to `ALL_TOGGLE_KEYS` in `scenes.ts`. This extends the `ToggleKey` union;
`togglesFromFx` then includes it automatically (defaults `false`). The engine reads it via
`tf('myeffect')`.

### 4. Wire the studio control

Add the toggle to its category group in `debug-studio.svelte`. If the effect has a **numeric**
parameter, also: add a field to `PanelParams`, a line to `normalizeParams`, plumb it through
`setParams`/`EngineParams`, and add a slider.

## Extensibility ceiling & deferred refactor

The monolith was ported **as-is**; these limits are known and accepted for now (ADR 0001):

- **Fixed-size uniform buffers.** `ubScene`/`ubComp` are exactly 7 `vec4` (28 floats) each. Toggle
  flags and params occupy hardcoded lanes; only a few `[FREE]` pad lanes remain. Past those, every
  new uniform requires growing `array<vec4,N>` in WGSL, the `Float32Array`, and the `buf(n)`
  allocation in lockstep — easy to desync.
- **Closed toggle union.** `ALL_TOGGLE_KEYS` is a closed const tuple and the engine reads each flag
  by hardcoded name into a fixed slot. There is no effect registry — every effect is a hand-wired
  branch in three or four files.
- **Hardcoded WGSL constants.** Some looks are baked into the shaders rather than exposed as
  params (see the inline comments in `engine.js`): the fog tint gradient, the godrays sun position,
  the per-type particle counts. Acceptable now; candidates for parameterization later.

**Deferred refactor:** an **effect-descriptor + dynamic uniform-packing** model — effects declare
their uniforms, WGSL snippet, and editor control as data, and the engine packs buffers and assembles
shaders automatically, removing the fixed-slot/closed-union ceiling. Deliberately **not** built yet;
it waits until a concrete new effect actually demands it, rather than speculatively. The current
hand-wired monolith is fine for the 35 shipped effects.
