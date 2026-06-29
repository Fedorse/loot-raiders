# Handoff — WebGPU Atmosphere Engine (WGSL)

Прототип «Лаборатория WebGPU». Описывает **только WebGPU-движок** (`webgpu-lab.js`) и его обёртку (`Лаборатория WebGPU.dc.html`). Парный WebGL2-вариант — отдельный handoff.

Целевой стек: **Svelte 5 (runes)**, движок как `.ts`-модуль в `src/lib/.../webgpu/`, инстанс в `{@attach}`, динамический `import()`.

---

## 1. Обзор
Полноэкранный шейдерный «живой фон» на **WebGPU/WGSL**: фотокадр + процедурная атмосфера + пост-обработка, всё на GPU. Один `<canvas>` с контекстом `webgpu`.
- **7 сцен** (7 фоновых картинок), переключение с шейдерным переходом.
- **Пресет** = картинка + набор эффектов + значения параметров (§8).
- **Эффекты**: цветокор, оптика (chroma/barrel/bloom/dof/heat/poster), плёнка (grain/scan), RGB-глитч, атмосфера (fog/godrays), частицы (7 типов), движение кадра (kenburns/parallax), ripple-симуляция, пост (tonemap/flare/halation/sharpen/crt/dither/edge/zoomblur).
- **Переходы**: fade / wipe / dissolve / glitch-cut / pixel-morph.

**Границы:** пост-эффект над фото, не 3D-сцена; глубина псевдо (по яркости). Нет звука. Движок не держит свой rAF — `tick(dt)` зовётся снаружи. UI — задача обёртки.

---

## 2. Ключевые решения (дорого менять)
| Решение | Почему | Последствие |
|---|---|---|
| Raw WebGPU, без библиотек | Контроль, нет зависимостей | Свой мини-фреймворк (пайплайны, bind-группы, проходы) |
| **Частицы = инстансные квады** (`draw(6, count)`) | В WebGPU нет `gl_PointSize` (point-list рисует 1px) | Размер/форма задаётся в вершинном шейдере, 2 пайплайна (additive/alpha) |
| Uniform-ы как `array<vec4<f32>, N>` | Гарантирует совпадение layout JS↔WGSL без alignment-сюрпризов | На JS пишется плоский Float32Array (4 float/слот) |
| Bind-группы пересоздаются каждый кадр | Текстуры (сцена/предыдущая/ripple/bloom/dof) меняются | Дёшево на этом масштабе; можно кэшировать позже |
| Цели рендера `rgba8unorm`, swapchain `bgra8unorm` (preferred) | 8-бит, без HDR | composite-пайплайн отдельным форматом |
| `layout:'auto'` у пайплайнов | Меньше кода | Bind-группы должны точно совпадать с биндингами шейдера |
| Async init (`requestAdapter/Device`) | Природа WebGPU | `createEngine` возвращает Promise — обёртка должна await |
| `tick(dt)` снаружи | Ложится в `{@attach}`/SSR | start/stop/таймстеп — на обёртке |

---

## 3. Параметры на кадр (что движок ждёт каждый `tick`)
Управление через методы (`setToggles/setParams/setGlitch/setMouse/setTransition/setActive`). Внутри пишется в uniform-буферы.

### 3a. Публичные входы (выставляет обёртка)
| Вход | Тип | Диапазон | Дефолт | За что |
|---|---|---|---|---|
| `state.toggles[*]` | bool→f32 0/1 | — | все `false` | Включение эффектов (имена §8) |
| `params.intensity` | f32 | 0…~1.5 | 0.8 | Множитель числа частиц |
| `params.fogAmt` | f32 | 0…0.95 | 0.6 | Плотность тумана |
| `params.grainAmt` | f32 | 0…0.18 | 0.08 | Сила зерна |
| `params.bloomAmt` | f32 | 0…1.5 | 0.7 | Сила свечения |
| `params.dofAmt` | f32 | 0…1 | 0.3 | Сила DOF |
| `params.exposure` | f32 | ~0.5…2 | 1.0 | Экспозиция перед ACES |
| `params.zoomAmt` | f32 | 0…1 | 0.5 | Сила zoom-блюра |
| `state.wind` | f32 | ~0…0.5 | 0.15 | Снос частиц |
| `state.glitch` | f32 | 0…~1 | 0 | Амплитуда глитч-всплеска (затухание в обёртке) |
| `state.mouse` | [x,y] | 0…1 | [0.5,0.5] | Курсор (y вверх) |
| `transMode` | int | 0…4 | 0 | Режим перехода (§8) |
| `transDur` | f32, c | ≥0.1 | 0.8 | Длительность перехода |
| `dt` (арг tick) | f32, c | >0 | — | Шаг времени |

**Нормализация (панель→движок), как в обёртке:** `intensity=p/100`, `fogAmt=p/100*0.95`, `grainAmt=p/100*0.18`, `bloomAmt=p/100*1.5`, `dofAmt=p/100`, `exposure=p/100`, `zoomAmt=p/100`. Глитч: при срабатывании `glitch=strength/100+0.15`, затем затухает `~*3/сек`.

### 3b. Uniform-буферы (WGSL `array<vec4<f32>>`, слот.компонента)
**Scene** (7 vec4 = 28 float): `0`(time, canA, imgATo, imgAFrom) · `1`(mouse.x, mouse.y, ripTexel.x, ripTexel.y) · `2`(trans, transMode, fogAmt, —) · `3`(fGrade,fWarm,fCool,fSepia) · `4`(fMono,fInvert,fChroma,fBarrel) · `5`(fHeat,fPoster,fFog,fGodrays) · `6`(fParallax,fRipple,fKenburns,—).
**Composite** (7 vec4): `0`(time, glitch, grainAmt, bloomAmt) · `1`(dofAmt, exposure, zoomAmt, —) · `2`(texelF.x, texelF.y, —, —) · `3`(fBloom,fDof,fVignette,fScan) · `4`(fGrain,fTonemap,fFlare,fHalation) · `5`(fSharpen,fCrt,fDither,fEdge) · `6`(fZoomblur,—,—,—).
**Particle** (2 vec4): `0`(time, wind, type, —) · `1`(round, resX, resY, dpr).
**Blur** (2 vec4): `0`(dir.x, dir.y, texel.x, texel.y) · `1`(bright, —, —, —).
**Ripple** (2 vec4): `0`(texel.x, texel.y, injPos.x, injPos.y) · `1`(injAmt, damp, —, —).

Текстуры/сэмплеры в bind-группах: Scene — `samp, texCur, texPrev, texRip`; Composite — `samp, texScene, texBloom, texDof`; Blur/Ripple — `samp, tex`; Particle — только uniform.

---

## 4. Публичный API
Точка входа **async**: `await window.WebGPULab.createEngine(canvas)` — принимает только `canvas`. (Для Svelte расширить — §10.)
```
const engine = await createEngine(canvasEl); // requestAdapter/Device, ctx.configure, пайплайны, цели, ResizeObserver, первый resize
engine.loadTexture(key, url);                 // ключ→картинка (async fetch+createImageBitmap; до загрузки заглушка)
engine.setActive(key);                        // сменить сцену (переход, если уже была активная)
engine.setTransition(modeIdx, durSec);
engine.setToggles({...});                     // ПОЛНЫЙ объект флагов (replace)
engine.setParams({...});                      // merge в state.params
engine.setGlitch(0..1);
engine.setMouse(x01, y01);                    // y вверх
engine.tick(dt);                              // ресайз-чек → шаг перехода → render()
engine.transitioning();                       // bool
engine.dispose();                             // СЕЙЧАС: только ro.disconnect()  ← неполно, §7/§10
engine.device, engine.state, engine.backend;  // ('webgpu')
```
`createEngine` бросает `'no webgpu'` / `'no adapter'`, если API недоступен. Нет `start/stop` (rAF — снаружи), `resize` не экспортирован (авто в `tick()` + ResizeObserver).

---

## 5. Контракт ассетов
- **7 картинок**. Ключи/файлы:

  | idx/key | файл |
  |---|---|
  | t0 | uploads/fon.jpeg |
  | t1 | uploads/fon3.jpeg |
  | t2 | uploads/fon%208.jpeg |
  | t3 | uploads/fon5.jpeg |
  | t4 | uploads/fon4.jpeg |
  | t5 | uploads/particls-tuman.jpeg |
  | t6 | uploads/fon2.jpeg |

- Формат: любой для `createImageBitmap`. Аспект любой — `cover` в шейдере.
- Загрузка: `fetch(url) → blob → createImageBitmap → copyExternalImageToTexture` в текстуру `rgba8unorm`. До загрузки — 1×1 заглушка `#14141a`. Ошибка → `console.error('tex load failed', url)`.
- Требования: CORS для `fetch` (свой origin/статика — ок). Прелоад желателен. Большие фото грузятся как есть (память).

---

## 6. Браузерные API и этап вызова (SSR)
**При импорте модуля (top-level):** только `window.WebGPULab = { createEngine }`. В Node/SSR бросит. → заменить на `export`. Остальной top-level — строки WGSL. `document` не используется.
**Внутри `createEngine` (async):** `navigator.gpu.requestAdapter/requestDevice`, `navigator.gpu.getPreferredCanvasFormat`, `canvas.getContext('webgpu')`, `ctx.configure`, `window.devicePixelRatio`, `new ResizeObserver(...).observe(canvas)`, `canvas.getBoundingClientRect`.
**Внутри `loadTexture`:** `fetch`, `createImageBitmap`.
**Не вызывается:** `requestAnimationFrame`, `performance.now`, `addEventListener`, `localStorage`. `dt`/курсор приходят аргументами. → SSR-safe при (а) убранном top-level `window.*` → `export`, (б) вызове только в браузере (после `await import()` в `{@attach}`/`onMount`).

---

## 7. Жизненный цикл ресурсов
**Один раз (createEngine):** device, context.configure; 5 модулей + пайплайны (scene, blur, ripple, composite, 2× particle add/alpha); сэмплер; 5 uniform-буферов (`GPUBufferUsage.UNIFORM|COPY_DST`); ResizeObserver; ripple-цели `ripA/ripB` (фикс. 256×144, очищены в 0.5); первый `resize()`.
**На `resize()`:** `.destroy()` и пересоздание `sceneTex`(W×H) + `bloomA/B`, `dofA/B`(половина). Ripple-цели **не** пересоздаются. Текстуры сцен — не трогаются.
**Текстуры сцен:** создаются в `loadTexture`, живут до конца, **не удаляются**.
**Каждый кадр:** пересоздаются bind-группы (scene/particle/blur/composite) + новый `getCurrentTexture()` swapchain view.
**`dispose()` сейчас:** только `ro.disconnect()`. НЕ делает `.destroy()` для текстур/целей/буферов, не `device.destroy()`. → **утечка при ремаунте.** Расширить (§10).

---

## 8. Пресеты как данные
`idx` — ключ текстуры (`t{idx}`). `fx` — включённые тоглы. Параметры — в **панельной** шкале (0–100/мс), нормализуются по §3a.
```json
[
  { "name":"Плотина",       "idx":0, "fx":["grade","tonemap","vignette","bloom","godrays","dust","grain","kenburns"],
    "p":{"intensity":55,"fogAmt":0,"grainAmt":25,"bloomAmt":45,"dofAmt":15,"glitchMs":4000,"strength":30,"exposure":108,"zoomAmt":50} },
  { "name":"Тоннель",       "idx":1, "fx":["grade","warm","tonemap","vignette","bloom","halation","embers","grain","kenburns"],
    "p":{"intensity":80,"fogAmt":25,"grainAmt":35,"bloomAmt":65,"dofAmt":10,"glitchMs":4000,"strength":40,"exposure":110,"zoomAmt":50} },
  { "name":"Ночной лес",    "idx":2, "fx":["grade","cool","tonemap","vignette","bloom","fog","rain","grain","kenburns"],
    "p":{"intensity":90,"fogAmt":45,"grainAmt":35,"bloomAmt":40,"dofAmt":25,"glitchMs":5000,"strength":35,"exposure":100,"zoomAmt":50} },
  { "name":"Красный туман", "idx":3, "fx":["grade","tonemap","vignette","fog","embers","ash","glitch","grain","kenburns"],
    "p":{"intensity":75,"fogAmt":70,"grainAmt":45,"bloomAmt":50,"dofAmt":15,"glitchMs":3200,"strength":55,"exposure":104,"zoomAmt":50} },
  { "name":"Ночные руины",  "idx":4, "fx":["grade","cool","tonemap","vignette","bloom","fireflies","grain","kenburns"],
    "p":{"intensity":60,"fogAmt":30,"grainAmt":30,"bloomAmt":75,"dofAmt":18,"glitchMs":5000,"strength":35,"exposure":106,"zoomAmt":50} },
  { "name":"Вулкан",        "idx":5, "fx":["grade","warm","tonemap","vignette","bloom","halation","heat","embers","ash","kenburns"],
    "p":{"intensity":105,"fogAmt":45,"grainAmt":35,"bloomAmt":75,"dofAmt":12,"glitchMs":4000,"strength":45,"exposure":110,"zoomAmt":50} },
  { "name":"Закат",         "idx":6, "fx":["grade","warm","tonemap","vignette","bloom","halation","godrays","dust","grain","kenburns"],
    "p":{"intensity":50,"fogAmt":0,"grainAmt":50,"bloomAmt":60,"dofAmt":30,"glitchMs":5000,"strength":28,"exposure":108,"zoomAmt":50} }
]
```
**Все тогл-ключи:** `grade, warm, cool, sepia, mono, invert, chroma, barrel, bloom, heat, poster, dof, grain, scan, glitch, fog, godrays, embers, ash, snow, rain, fireflies, sparks, dust, parallax, kenburns, tonemap, flare, halation, sharpen, crt, dither, edge, zoomblur, ripple`.
**Частицы** (индекс типа): `embers(0), ash(1), snow(2), rain(3), fireflies(4), sparks(5), dust(6)`; `COUNTS=[3000,2500,4000,5000,500,600,3000]`, аддитив `[+,–,–,–,+,+,+]`, форма `ROUND=[1,1,1,0,1,1,1]` (rain — штрих).
**Переходы** (`transMode`): `0=fade, 1=wipe, 2=dissolve, 3=glitch-cut, 4=pixel-morph`. Дефолт обёртки — `2`.

---

## 9. Перф-ручки
- **DPR-кап** `min(devicePixelRatio,1.5)` — хардкод. Главный рычаг.
- **Частицы** — каждый тип = `draw(6, count*intensity)` инстансами; тяжёлые rain(5000)/snow(4000)/dust/embers(3000).
- **bloom/dof** — по 2 прохода (H+V) на полу-разрешении, только если тогл включён.
- **ripple** — 1 проход 256×144/кадр при `ripple`.
- **Дорогие фрагмент-ветки**: zoomblur(8), edge(8), flare(12) — только когда включены.
- **Bind-группы пересоздаются каждый кадр** — при экстремальной оптимизации кэшировать.
- Слабый GPU: dpr↓, отключить bloom/dof/ripple/edge/zoomblur, урезать COUNTS.

---

## 10. Ограничения / хардкоды / TODO
- **Нет WebGPU → throw** (`no webgpu`/`no adapter`). Обёртка ловит и показывает фолбэк-экран (в прототипе — состояние `gpuError`).
- **8-бит, без HDR** — bloom/tonemap по clamp 0..1.
- **Глубина псевдо** (по яркости) для parallax.
- **Хардкоды в WGSL:** цвет тумана (красно-тёплый, не зависит от сцены — в дневных пресетах fog off), позиция солнца godrays `(0.5,1.05)`, пороги bloom, коэффициенты chroma/heat/kenburns/grain.
- **Переход не 3-сторонний:** смена сцены посреди перехода прыгает prevTex на текущий.
- **Частицы:** смена count рехэширует распределение (поп); нет коллизий.
- **Глитч-планировщик + затухание** — в обёртке, не в движке.
- **`dispose()` неполный** (§7) — течёт.
- **Bind-группы каждый кадр** — небольшой overhead.
- Ориентация текстур завязана на `vUv.y` в вершинном шейдере (без flipY на загрузке) — при замене ассетов проверить, не перевёрнут ли кадр.

### Что в движке НЕ трогать
Весь WGSL, `render()`, `doBlur()`, `simRipple()`, раскладку uniform-слотов, `resize()`, загрузку текстур, частичные пайплайны, константы частиц. Это ядро, framework-независимо.

### Что переписать на стороне обёртки (Svelte)
1. **ES/TS-модуль:** убрать IIFE + `window.WebGPULab=…` → `export async function createEngine(...)`.
2. **Async-инициализация:** `await import()` + `await createEngine()` в `{@attach}`; обработать отсутствие WebGPU (фолбэк-UI).
3. **Гонка маунта:** если компонент размонтировали, пока шёл await — сразу `dispose()` (флаг `_disposed` в прототипе).
4. **Цикл:** rAF→`tick(dt)` в обёртке; cap dt ~0.1с; отмена в cleanup.
5. **Глитч-планировщик + затухание** — в обёртку.
6. **Pointer-листенеры** — в обёртку: `setMouse(x01, 1-y01)`.
7. **Нормализация панель→движок** — в обёртке или в `setParams`.
8. **Пресеты** — типизированный const/JSON (выше).
9. **`dispose()` расширить:** `.destroy()` для всех текстур сцен и целей (scene/bloom/dof/ripple), uniform-буферов; при желании `device.destroy()`; отменить rAF и снять листенеры.
10. **(Желательно) опции:** `createEngine(canvas, { dpr?, images?, rippleRes? })`.

### Скелет интеграции
```
// webgpu/engine.ts -> export async function createEngine(canvas, opts?) { ... }
// Component.svelte
function attach(node) {                       // {@attach attach}
  let engine, raf, last = performance.now(), dead = false;
  (async () => {
    if (!navigator.gpu) { showFallback(); return; }
    const { createEngine } = await import('$lib/.../webgpu/engine');
    engine = await createEngine(node, { images: SCENE_URLS });
    if (dead) { engine.dispose(); return; }
    applyPreset(engine, PRESETS[3]);
    const loop = (t) => { const dt = Math.min(0.1,(t-last)/1000); last=t; engine.tick(dt); raf=requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
  })();
  return () => { dead = true; cancelAnimationFrame(raf); engine?.dispose(); };
}
```
