/*
  Лаборатория WebGPU — ЛОГИКА ПАНЕЛИ (референс для переписи на Svelte 5).

  ВАЖНО: это НЕ самостоятельный модуль. Класс живёт в рантайме прототипа и
  наследует `DCLogic` (даёт this.state / this.setState / lifecycle, как у React
  class-компонента, плюс this.<refName>El для ref="{{ refName }}"). `renderVals()`
  возвращает значения/хендлеры, которые шаблон (lab-markup.html) подставляет в {{ }}.

  ОТЛИЧИЯ ОТ WebGL-логики:
   - boot() АСИНХРОННЫЙ: `await window.WebGPULab.createEngine(canvas)`.
   - есть проверка `navigator.gpu` и состояние gpuError -> фолбэк-экран.
   - флаг this._disposed: если компонент размонтировали, пока шёл await,
     движок сразу dispose() (гонка инициализации).
   - акцент #a78bfa.

  Что переносить в Svelte:
    - state -> $state(...); DEFAULT_FX/TEX/PRESETS/TRANS -> const/данные(+типы)
    - boot -> {@attach}/$effect: dynamic import, await createEngine, loadTexture x7,
              setActive, rAF-цикл, хоткеи; обработать недоступность WebGPU
    - pushToEngine -> $effect (toggles/params/transition в движок)
    - renderVals -> в Svelte не нужен (берёшь из $state / {#each})
  Нормализация панель->движок — в pushToEngine(). Планировщик глитча — в rAF-цикле.
*/

class Component extends DCLogic {
  DEFAULT_FX() {
    return {
      grade:false, warm:false, cool:false, sepia:false, mono:false, invert:false,
      vignette:false, chroma:false, barrel:false, bloom:false, heat:false, poster:false, dof:false,
      grain:false, scan:false, glitch:false,
      fog:false, godrays:false,
      embers:false, ash:false, snow:false, rain:false, fireflies:false, sparks:false, dust:false,
      parallax:false, kenburns:false,
      tonemap:false, flare:false, halation:false, sharpen:false, crt:false, dither:false, edge:false, zoomblur:false,
      ripple:false,
    };
  }
  TEX() { return ['uploads/fon.jpeg','uploads/fon3.jpeg','uploads/fon%208.jpeg','uploads/fon5.jpeg','uploads/fon4.jpeg','uploads/particls-tuman.jpeg','uploads/fon2.jpeg']; }
  PRESETS() {
    return [
      { n:'Плотина',      idx:0, fx:['grade','tonemap','vignette','bloom','godrays','dust','grain','kenburns'],                  p:{intensity:55,fogAmt:0,grainAmt:25,bloomAmt:45,dofAmt:15,glitchMs:4000,strength:30,exposure:108,zoomAmt:50} },
      { n:'Тоннель',      idx:1, fx:['grade','warm','tonemap','vignette','bloom','halation','embers','grain','kenburns'],        p:{intensity:80,fogAmt:25,grainAmt:35,bloomAmt:65,dofAmt:10,glitchMs:4000,strength:40,exposure:110,zoomAmt:50} },
      { n:'Ночной лес',   idx:2, fx:['grade','cool','tonemap','vignette','bloom','fog','rain','grain','kenburns'],               p:{intensity:90,fogAmt:45,grainAmt:35,bloomAmt:40,dofAmt:25,glitchMs:5000,strength:35,exposure:100,zoomAmt:50} },
      { n:'Красный туман',idx:3, fx:['grade','tonemap','vignette','fog','embers','ash','glitch','grain','kenburns'],             p:{intensity:75,fogAmt:70,grainAmt:45,bloomAmt:50,dofAmt:15,glitchMs:3200,strength:55,exposure:104,zoomAmt:50} },
      { n:'Ночные руины', idx:4, fx:['grade','cool','tonemap','vignette','bloom','fireflies','grain','kenburns'],                p:{intensity:60,fogAmt:30,grainAmt:30,bloomAmt:75,dofAmt:18,glitchMs:5000,strength:35,exposure:106,zoomAmt:50} },
      { n:'Вулкан',       idx:5, fx:['grade','warm','tonemap','vignette','bloom','halation','heat','embers','ash','kenburns'],   p:{intensity:105,fogAmt:45,grainAmt:35,bloomAmt:75,dofAmt:12,glitchMs:4000,strength:45,exposure:110,zoomAmt:50} },
      { n:'Закат',        idx:6, fx:['grade','warm','tonemap','vignette','bloom','halation','godrays','dust','grain','kenburns'], p:{intensity:50,fogAmt:0,grainAmt:50,bloomAmt:60,dofAmt:30,glitchMs:5000,strength:28,exposure:108,zoomAmt:50} },
    ];
  }
  allFalse() { const o = this.DEFAULT_FX(); Object.keys(o).forEach(k => o[k] = false); return o; }
  fxFromPreset(i) { const fx = this.allFalse(); this.PRESETS()[i].fx.forEach(k => fx[k] = true); return fx; }

  state = { showPanel:true, preset:3, frameIndex:3, fx:null, fps:60, glitching:false, gpuError:false,
            glitchMs:3200, strength:55, intensity:75, fogAmt:70, grainAmt:45, bloomAmt:50, dofAmt:15,
            transMode:2, transDur:800, exposure:104, zoomAmt:50 };
  TRANS() { return ['Fade','Wipe','Раствор','Глитч','Пиксели']; }

  componentDidMount() {
    this.setState({ fx: this.fxFromPreset(3) });
    this._glitch = 0; this._gAcc = 0; this._gNext = 3;
    this._last = performance.now(); this._fpsT = this._last; this._frames = 0;
    this._disposed = false;
    this.boot();
    this.onKey = (e) => {
      if (e.key === '`') { e.preventDefault(); this.setState(s => ({ showPanel: !s.showPanel })); }
      else if (e.key.toLowerCase() === 'g') this.fireGlitch();
      else if (e.key >= '1' && e.key <= '7') this.applyPreset(Number(e.key) - 1);
    };
    window.addEventListener('keydown', this.onKey);
  }
  componentWillUnmount() {
    this._disposed = true;
    cancelAnimationFrame(this.raf); window.removeEventListener('keydown', this.onKey);
    if (this.engine) this.engine.dispose();
  }

  async boot() {
    if (!window.WebGPULab || !this.glcanvasEl) { this._bootT = setTimeout(() => this.boot(), 60); return; }
    if (!navigator.gpu) { this.setState({ gpuError: true }); return; }
    try {
      this.engine = await window.WebGPULab.createEngine(this.glcanvasEl);
      if (this._disposed) { this.engine.dispose(); return; }
      this.TEX().forEach((url, i) => this.engine.loadTexture('t' + i, url));
      this.engine.setActive('t' + this.state.frameIndex);
      this.pushToEngine();
      this.loop = (now) => {
        let dt = (now - this._last) / 1000; this._last = now; if (dt > 0.1) dt = 0.1;
        this._frames++;
        if (now - this._fpsT >= 500) { const fps = Math.round(this._frames * 1000 / (now - this._fpsT)); this._frames = 0; this._fpsT = now; if (fps !== this.state.fps) this.setState({ fps }); }
        const fx = this.state.fx || {};
        if (fx.glitch) {
          this._gAcc += dt;
          if (this._gAcc >= this._gNext) { this._gAcc = 0; this._gNext = Math.max(0.4, (this.state.glitchMs / 1000) * (0.7 + Math.random() * 0.6)); this.fireGlitch(); }
        }
        if (this._glitch > 0) { this._glitch = Math.max(0, this._glitch - dt * 3.0); }
        if (this.engine) { this.engine.setGlitch(this._glitch); this.engine.tick(dt); }
        const gl = !!this._glitch && this._glitch > 0.05;
        if (gl !== this.state.glitching) this.setState({ glitching: gl });
        this.raf = requestAnimationFrame(this.loop);
      };
      this.raf = requestAnimationFrame(this.loop);
    } catch (err) { console.error('webgpu boot failed', err); this.setState({ gpuError: true }); }
  }

  pushToEngine() {
    if (!this.engine) return;
    const s = this.state;
    this.engine.setToggles(s.fx || this.allFalse());
    this.engine.setParams({
      intensity: s.intensity / 100,
      fogAmt: s.fogAmt / 100 * 0.95,
      grainAmt: s.grainAmt / 100 * 0.18,
      bloomAmt: s.bloomAmt / 100 * 1.5,
      dofAmt: s.dofAmt / 100,
      exposure: s.exposure / 100,
      zoomAmt: s.zoomAmt / 100,
    });
    this.engine.setTransition(s.transMode, s.transDur / 1000);
  }
  componentDidUpdate() { this.pushToEngine(); }

  toggleFx(key) { this.setState(s => ({ fx: { ...s.fx, [key]: !s.fx[key] } })); }
  clearAll() { this.setState({ fx: this.allFalse(), preset: -1 }); }
  applyPreset(i) {
    const pr = this.PRESETS()[i];
    const fx = this.allFalse(); pr.fx.forEach(k => fx[k] = true);
    this._gAcc = 0;
    if (this.engine) this.engine.setActive('t' + pr.idx);
    if (this.badgeEl) { this.badgeEl.style.animation = 'none'; void this.badgeEl.offsetWidth; this.badgeEl.style.animation = 'fx-fade 0.5s ease'; }
    this.setState({ preset: i, frameIndex: pr.idx, fx, ...pr.p });
  }
  fireGlitch() { this._glitch = Math.min(1, this.state.strength / 100 + 0.15); }

  onMove(e) {
    if (!this.engine) return;
    const r = e.currentTarget.getBoundingClientRect();
    this.engine.setMouse((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  }
  startDrag(e) {
    const panel = this.panelEl; if (!panel) return;
    const r = panel.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    panel.style.right = 'auto';
    const move = (ev) => { panel.style.left = (ev.clientX - ox) + 'px'; panel.style.top = (ev.clientY - oy) + 'px'; };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  }

  renderVals() {
    const s = this.state, fx = s.fx || this.allFalse(); const num = (e) => Number(e.target.value);
    const sw = (on) => on ? '#a78bfa' : 'rgba(255,255,255,0.14)';
    const knob = (on) => on ? 'translateX(14px)' : 'translateX(0)';
    const lc = (on) => on ? '#fff' : '#9aa3b4';
    const mk = (key, label) => ({ label, toggle:()=>this.toggleFx(key), sw:sw(fx[key]), knob:knob(fx[key]), labelColor:lc(fx[key]) });
    const groups = [
      { title:'ЦВЕТ', items:[mk('grade','Кинокор'), mk('warm','Тёплый'), mk('cool','Холодный'), mk('sepia','Сепия'), mk('mono','Ч/Б'), mk('invert','Инверсия')] },
      { title:'ОПТИКА (шейдер)', items:[mk('vignette','Виньетка'), mk('chroma','Хром. аберрация'), mk('barrel','Дисторсия'), mk('bloom','Свечение (bloom)'), mk('heat','Тепловое марево'), mk('poster','Постеризация'), mk('dof','Глубина резкости')] },
      { title:'ПЛЁНКА', items:[mk('grain','Зерно'), mk('scan','Сканлайны')] },
      { title:'ГЛИТЧ', items:[mk('glitch','RGB-глитч')] },
      { title:'АТМОСФЕРА', items:[mk('fog','Объёмный туман'), mk('godrays','Объёмный свет')] },
      { title:'ПОСТ-ОБРАБОТКА', items:[mk('tonemap','Тонмаппинг ACES'), mk('flare','Анаморф. блики'), mk('halation','Halation'), mk('sharpen','Резкость'), mk('crt','CRT-маска'), mk('dither','Дизеринг'), mk('edge','Контур'), mk('zoomblur','Zoom-блюр')] },
      { title:'СИМУЛЯЦИЯ (GPU)', items:[mk('ripple','Рябь / жидкость')] },
      { title:'ЧАСТИЦЫ (GPU)', items:[mk('embers','Угли'), mk('ash','Пепел'), mk('snow','Снег'), mk('rain','Дождь'), mk('fireflies','Светлячки'), mk('sparks','Искры'), mk('dust','Пыль')] },
      { title:'ДВИЖЕНИЕ КАДРА', items:[mk('kenburns','Дыхание кадра'), mk('parallax','Depth-параллакс')] },
    ];
    const trans = this.TRANS().map((label, i) => {
      const on = i === s.transMode;
      return { label, click: () => this.setState({ transMode: i }),
        style: 'padding:6px 4px; border-radius:7px; cursor:pointer; font-family:inherit; font-size:10px; text-align:center; transition:all .15s; ' + (on ? 'border:1px solid #a78bfa; background:rgba(167,139,250,0.16); color:#fff;' : 'border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.03); color:#9aa3b4;') };
    });
    const activeCount = Object.values(fx).filter(Boolean).length;
    const PCOUNT = { embers:3000, ash:2500, snow:4000, rain:5000, fireflies:500, sparks:600, dust:3000 };
    let pc = 0; Object.keys(PCOUNT).forEach(k => { if (fx[k]) pc += Math.round(PCOUNT[k] * s.intensity / 100); });
    const baseBtn = 'display:flex; flex-direction:column; gap:2px; align-items:flex-start; padding:7px 9px; border-radius:8px; cursor:pointer; font-family:inherit; text-align:left; transition:all .15s;';
    const presets = this.PRESETS().map((pr, i) => {
      const on = i === s.preset;
      return { num: String(i + 1).padStart(2, '0'), name: pr.n, click: () => this.applyPreset(i),
        numColor: on ? '#a78bfa' : '#6b7488',
        style: baseBtn + (on ? 'border:1px solid #a78bfa; background:rgba(167,139,250,0.16); color:#fff;' : 'border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.03); color:#cfd6e4;') };
    });
    const cur = this.PRESETS()[s.preset] || null;
    return {
      glcanvas:(el)=>{this.glcanvasEl=el;}, panel:(el)=>{this.panelEl=el;}, badge:(el)=>{this.badgeEl=el;},
      gpuError: s.gpuError,
      frameNum: String(s.frameIndex + 1).padStart(2, '0'),
      frameName: cur ? cur.n : 'Свободный режим',
      showPanel: s.showPanel, panelHidden: !s.showPanel,
      glitchMs: s.glitchMs, strength: s.strength, intensity: s.intensity, fogAmt: s.fogAmt, grainAmt: s.grainAmt, bloomAmt: s.bloomAmt, dofAmt: s.dofAmt,
      exposure: s.exposure, zoomAmt: s.zoomAmt, transDur: s.transDur, transDurLabel: (s.transDur/1000).toFixed(1)+'с', trans,
      fps: s.fps, fpsColor: s.fps>=50?'#5fd38a':s.fps>=30?'#a78bfa':'#ff5a6a',
      stateDot: s.glitching?'#ff3b5c':'#5fd38a',
      activeCount: activeCount, particleCount: pc >= 1000 ? (pc/1000).toFixed(1)+'k' : String(pc),
      intervalLabel: (s.glitchMs/1000).toFixed(1)+'с',
      groups, presets,
      onMove:(e)=>this.onMove(e), startDrag:(e)=>this.startDrag(e),
      togglePanel:()=>this.setState(p=>({showPanel:!p.showPanel})),
      fire:()=>this.fireGlitch(), clearAll:()=>this.clearAll(),
      setGlitchMs:(e)=>this.setState({glitchMs:num(e)}), setStrength:(e)=>this.setState({strength:num(e)}),
      setIntensity:(e)=>this.setState({intensity:num(e)}), setFog:(e)=>this.setState({fogAmt:num(e)}),
      setGrain:(e)=>this.setState({grainAmt:num(e)}), setBloom:(e)=>this.setState({bloomAmt:num(e)}), setDof:(e)=>this.setState({dofAmt:num(e)}),
      setExposure:(e)=>this.setState({exposure:num(e)}), setZoom:(e)=>this.setState({zoomAmt:num(e)}), setTransDur:(e)=>this.setState({transDur:num(e)}),
    };
  }
}
