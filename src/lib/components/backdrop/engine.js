/* eslint-disable */
// @ts-nocheck
// WebGPU effects engine (WGSL) — scene compositor + GPU particles + ripple sim + transitions + post-FX.
// Frozen vendor core ported from the /webgpu-lab prototype: WGSL, render(), doBlur(), simRipple(),
// the pipelines, the uniform-slot layout, resize() and texture loading are unchanged. Only the module
// boundary (IIFE + window global → ES export) and dispose() were adapted. Typed via ./engine.d.ts.

  // ---- shared WGSL helpers ----
  const HELP = `
  fn hash11(p0:f32)->f32{ var p=fract(p0*0.1031); p=p*(p+33.33); p=p*(p+p); return fract(p); }
  fn hash21(p0:vec2<f32>)->f32{ var p=fract(p0*vec2<f32>(123.34,456.21)); p=p+dot(p,p+45.32); return fract(p.x*p.y); }
  fn vnoise(p:vec2<f32>)->f32{ let i=floor(p); let f=fract(p); let a=hash21(i); let b=hash21(i+vec2<f32>(1.0,0.0)); let c=hash21(i+vec2<f32>(0.0,1.0)); let d=hash21(i+vec2<f32>(1.0,1.0)); let u=f*f*(3.0-2.0*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
  fn fbm(p0:vec2<f32>)->f32{ var p=p0; var v=0.0; var a=0.5; for(var i=0;i<5;i=i+1){ v=v+a*vnoise(p); p=p*2.02+vec2<f32>(11.3,7.7); a=a*0.5; } return v; }
  fn modf2(a:f32,b:f32)->f32{ return a-b*floor(a/b); }
  fn lum(c:vec3<f32>)->f32{ return dot(c,vec3<f32>(0.299,0.587,0.114)); }
  `;

  // fullscreen triangle
  const VS_FULL = `
  struct VO { @builtin(position) pos:vec4<f32>, @location(0) uv:vec2<f32> };
  @vertex fn vs(@builtin(vertex_index) vi:u32)->VO {
    var o:VO;
    let x = f32((vi << 1u) & 2u);
    let y = f32(vi & 2u);
    let p = vec2<f32>(x, y);            // 0..2
    o.pos = vec4<f32>(p*2.0-1.0, 0.0, 1.0);
    o.uv = vec2<f32>(p.x, 1.0 - p.y);   // texcoord, y down (0 top)
    return o;
  }`;

  // ---- SCENE ----
  const SCENE_WGSL = `
  struct U { d: array<vec4<f32>, 7> };
  @group(0) @binding(0) var<uniform> U_:U;
  @group(0) @binding(1) var samp:sampler;
  @group(0) @binding(2) var texCur:texture_2d<f32>;
  @group(0) @binding(3) var texPrev:texture_2d<f32>;
  @group(0) @binding(4) var texRip:texture_2d<f32>;
  ${HELP}
  fn cover(imgA:f32, canA:f32, uv:vec2<f32>)->vec2<f32>{
    var b=uv;
    if(canA>imgA){ b.y=(uv.y-0.5)*(imgA/canA)+0.5; } else { b.x=(uv.x-0.5)*(canA/imgA)+0.5; }
    return b;
  }
  fn sampleScene(tex:texture_2d<f32>, imgA:f32, canA:f32, fChroma:f32, off:vec2<f32>, uv:vec2<f32>)->vec3<f32>{
    var b = cover(imgA,canA,uv) + off;
    if(fChroma>0.5){
      let dir=(uv-0.5); let amt=0.004+0.006*dot(dir,dir)*6.0;
      return vec3<f32>(textureSample(tex,samp,b+dir*amt).r, textureSample(tex,samp,b).g, textureSample(tex,samp,b-dir*amt).b);
    }
    return textureSample(tex,samp,b).rgb;
  }
  struct VO { @builtin(position) pos:vec4<f32>, @location(0) uv:vec2<f32> };
  @fragment fn fs(in:VO)->@location(0) vec4<f32>{
    let time=U_.d[0].x; let canA=U_.d[0].y; let imgATo=U_.d[0].z; let imgAFrom=U_.d[0].w;
    let mouse=vec2<f32>(U_.d[1].x,U_.d[1].y); let ripTexel=vec2<f32>(U_.d[1].z,U_.d[1].w);
    let trans=U_.d[2].x; let transMode=U_.d[2].y; let fogAmt=U_.d[2].z;
    let fGrade=U_.d[3].x; let fWarm=U_.d[3].y; let fCool=U_.d[3].z; let fSepia=U_.d[3].w;
    let fMono=U_.d[4].x; let fInvert=U_.d[4].y; let fChroma=U_.d[4].z; let fBarrel=U_.d[4].w;
    let fHeat=U_.d[5].x; let fPoster=U_.d[5].y; let fFog=U_.d[5].z; let fGodrays=U_.d[5].w;
    let fParallax=U_.d[6].x; let fRipple=U_.d[6].y; let fKenburns=U_.d[6].z;

    var uv=in.uv;
    if(fBarrel>0.5){ let cc=uv-0.5; let r2=dot(cc,cc); uv=0.5+cc*(1.0+0.18*r2); }
    var off=vec2<f32>(0.0,0.0);
    if(fParallax>0.5){ let l0=lum(textureSample(texCur,samp,uv).rgb); off=off+(mouse-0.5)*0.05*clamp(1.0-l0,0.0,1.0); }
    if(fHeat>0.5){ let band=smoothstep(0.0,0.7,1.0-uv.y); off=off+vec2<f32>((fbm(vec2<f32>(uv.x*8.0,uv.y*5.0-time*0.6))-0.5)*0.012,(fbm(vec2<f32>(uv.y*7.0+time*0.5,uv.x*6.0))-0.5)*0.02)*band; }
    if(fRipple>0.5){ let hL=textureSample(texRip,samp,uv-vec2<f32>(ripTexel.x,0.0)).r; let hR=textureSample(texRip,samp,uv+vec2<f32>(ripTexel.x,0.0)).r; let hU=textureSample(texRip,samp,uv-vec2<f32>(0.0,ripTexel.y)).r; let hD=textureSample(texRip,samp,uv+vec2<f32>(0.0,ripTexel.y)).r; off=off+vec2<f32>(hR-hL,hD-hU)*0.9; }
    var suv=uv;
    if(fKenburns>0.5){ let z=1.0+0.05*(0.5+0.5*sin(time*0.05)); let pan=vec2<f32>(sin(time*0.045)*0.018,cos(time*0.037)*0.014); suv=(uv-0.5)/z+0.5+pan; }

    var uvTo=suv; var uvFrom=suv; var m:f32;
    if(trans>=0.999){ m=1.0; }
    else {
      let md=i32(transMode+0.5);
      if(md==0){ m=trans; }
      else if(md==1){ let w=0.09; m=clamp((trans*(1.0+w)-uv.x)/w,0.0,1.0); }
      else if(md==2){ let n=fbm(uv*5.0); m=smoothstep(n-0.05,n+0.05,trans); }
      else if(md==3){ let row=floor(uv.y*24.0); let rt=hash11(row*1.7); m=step(rt,trans); let env=1.0-abs(trans*2.0-1.0); let sh=(hash11(row+floor(time*22.0))-0.5)*0.10*env; uvTo.x=uvTo.x+sh; uvFrom.x=uvFrom.x+sh*0.5; }
      else { let cell=mix(2.0,90.0,sin(trans*3.14159)); let px=(floor(suv*cell)+0.5)/cell; uvTo=px; uvFrom=px; m=trans; }
    }
    let colTo=sampleScene(texCur,imgATo,canA,fChroma,off,uvTo);
    let colFrom=sampleScene(texPrev,imgAFrom,canA,fChroma,off,uvFrom);
    var col=mix(colFrom,colTo,m);
    if(fFog>0.5){ let h=smoothstep(0.05,0.85,1.0-uv.y); let f=pow(clamp(fbm(vec2<f32>(uv.x*3.0+time*0.05,uv.y*2.2-time*0.03)),0.0,1.0),1.4); let fogCol=mix(vec3<f32>(0.62,0.30,0.26),vec3<f32>(0.78,0.66,0.62),uv.y); col=mix(col,fogCol,clamp(f*h*fogAmt,0.0,0.85)); }
    if(fGodrays>0.5){ let sun=vec2<f32>(0.5,1.05); let d=uv-sun; let ang=atan2(d.x,-d.y); let rays=pow(clamp(fbm(vec2<f32>(ang*6.0,length(d)*2.0-time*0.1)),0.0,1.0),2.0); col=col+vec3<f32>(1.0,0.85,0.6)*rays*smoothstep(1.2,0.1,length(d))*0.28; }
    if(fGrade>0.5){ col=(col-0.5)*1.12+0.5; let l=lum(col); col=mix(vec3<f32>(l),col,1.18); col=col*1.02; }
    if(fWarm>0.5){ col=col*vec3<f32>(1.10,1.0,0.86); let l=lum(col); col=mix(vec3<f32>(l),col,1.18); }
    if(fCool>0.5){ col=col*vec3<f32>(0.88,0.98,1.14); }
    if(fSepia>0.5){ let l=lum(col); col=mix(col,vec3<f32>(l)*vec3<f32>(1.07,0.86,0.62),0.72); }
    if(fMono>0.5){ col=vec3<f32>(lum(col)); }
    if(fInvert>0.5){ col=vec3<f32>(1.0)-col; }
    if(fPoster>0.5){ col=floor(col*5.0)/5.0; }
    return vec4<f32>(max(col,vec3<f32>(0.0)),1.0);
  }`;

  // ---- PARTICLES (instanced quad) ----
  const PART_WGSL = `
  struct U { d: array<vec4<f32>, 2> };
  @group(0) @binding(0) var<uniform> U_:U;
  fn h11(p0:f32)->f32{ var p=fract(p0*0.1031); p=p*(p+33.33); p=p*(p+p); return fract(p); }
  struct VO { @builtin(position) pos:vec4<f32>, @location(0) uv:vec2<f32>, @location(1) col:vec4<f32>, @location(2) round:f32 };
  @vertex fn vs(@builtin(vertex_index) vi:u32, @builtin(instance_index) ii:u32)->VO {
    let time=U_.d[0].x; let wind=U_.d[0].y; let typef=U_.d[0].z;
    let roundf=U_.d[1].x; let resX=U_.d[1].y; let resY=U_.d[1].z;
    var corners=array<vec2<f32>,6>(vec2<f32>(-1.0,-1.0),vec2<f32>(1.0,-1.0),vec2<f32>(-1.0,1.0),vec2<f32>(-1.0,1.0),vec2<f32>(1.0,-1.0),vec2<f32>(1.0,1.0));
    let c=corners[vi];
    let id=f32(ii);
    let r1=h11(id); let r2=h11(id+11.7); let r3=h11(id+23.3); let r4=h11(id+41.1);
    let ty=i32(typef+0.5); let t=time;
    var pos:vec2<f32>; var size=2.0; var col=vec3<f32>(1.0); var alpha=1.0;
    if(ty==0){ let sp=0.03+r2*0.07; let life=fract(r1+t*sp); pos=vec2<f32>(fract(r3+sin(life*6.28+r1*30.0)*0.04+wind*life*0.25),1.0-life); size=1.5+r4*3.5; col=vec3<f32>(1.0,0.45+0.35*r2,0.12); alpha=(1.0-life)*(0.5+0.5*sin(t*8.0+id))*0.9; }
    else if(ty==1){ let sp=0.02+r2*0.04; let life=fract(r1+t*sp); pos=vec2<f32>(fract(r3+sin(life*4.0+r1*20.0)*0.05+wind*life*0.4),life); size=1.2+r4*2.6; col=vec3<f32>(0.22,0.20,0.19); alpha=0.5+0.4*r2; }
    else if(ty==2){ let sp=0.015+r2*0.03; let life=fract(r1+t*sp); pos=vec2<f32>(fract(r3+sin(life*3.0+r1*16.0)*0.03),life); size=1.5+r4*2.5; col=vec3<f32>(0.93,0.96,1.0); alpha=0.5+0.4*r4; }
    else if(ty==3){ let sp=0.5+r2*0.5; let life=fract(r1+t*sp); pos=vec2<f32>(fract(r3-life*0.06),life); size=4.0+r4*5.0; col=vec3<f32>(0.72,0.80,0.92); alpha=0.18+0.22*r2; }
    else if(ty==4){ let a1=t*(0.2+r2*0.4)+r1*6.28; let a2=t*(0.15+r3*0.3)+r4*6.28; pos=vec2<f32>(fract(r1+sin(a1)*0.06),0.25+r3*0.6+cos(a2)*0.06); size=2.0+r4*2.0; col=vec3<f32>(0.75,1.0,0.45); alpha=(0.2+0.8*max(0.0,sin(t*1.5+id)))*0.9; }
    else if(ty==5){ let sp=0.15+r2*0.25; let life=fract(r1+t*sp); let arc=sin(life*3.14); pos=vec2<f32>(fract(r3+(r1-0.5)*0.4*life),0.85-arc*0.5*r4); size=1.0+r4*2.0; col=vec3<f32>(1.0,0.8,0.4); alpha=(1.0-life)*0.9; }
    else { let sp=0.008+r2*0.02; let life=fract(r1+t*sp); pos=vec2<f32>(fract(r3+sin(t*0.2+r1*10.0)*0.04+wind*0.1),fract(r4+sin(t*0.1+r3*8.0)*0.03)); size=1.0+r4*1.6; col=vec3<f32>(1.0,0.95,0.85); alpha=0.10+0.20*r2; }
    let center=vec2<f32>(pos.x*2.0-1.0, 1.0-pos.y*2.0);
    let half=vec2<f32>(size/resX, size/resY)*2.0;
    var o:VO;
    o.pos=vec4<f32>(center+c*half,0.0,1.0);
    o.uv=c; o.col=vec4<f32>(col,alpha); o.round=roundf;
    return o;
  }
  @fragment fn fs(in:VO)->@location(0) vec4<f32>{
    let d=in.uv;
    var a:f32;
    if(in.round>0.5){ a=smoothstep(1.0,0.0,length(d)); }
    else { a=smoothstep(1.0,0.0,abs(d.x)*3.5)*smoothstep(1.0,0.0,abs(d.y)); }
    return vec4<f32>(in.col.rgb, in.col.a*a);
  }`;

  // ---- BLUR ----
  const BLUR_WGSL = `
  struct U { d: array<vec4<f32>, 2> };
  @group(0) @binding(0) var<uniform> U_:U;
  @group(0) @binding(1) var samp:sampler;
  @group(0) @binding(2) var tex:texture_2d<f32>;
  struct VO { @builtin(position) pos:vec4<f32>, @location(0) uv:vec2<f32> };
  @fragment fn fs(in:VO)->@location(0) vec4<f32>{
    let dir=vec2<f32>(U_.d[0].x,U_.d[0].y); let texel=vec2<f32>(U_.d[0].z,U_.d[0].w); let bright=U_.d[1].x;
    var w=array<f32,5>(0.227,0.194,0.121,0.054,0.016);
    var c=textureSample(tex,samp,in.uv).rgb*w[0];
    for(var i=1;i<5;i=i+1){ let o=dir*texel*f32(i)*1.4; c=c+textureSample(tex,samp,in.uv+o).rgb*w[i]; c=c+textureSample(tex,samp,in.uv-o).rgb*w[i]; }
    if(bright>0.5){ let l=dot(c,vec3<f32>(0.299,0.587,0.114)); c=c*smoothstep(0.55,0.95,l); }
    return vec4<f32>(c,1.0);
  }`;

  // ---- RIPPLE ----
  const RIP_WGSL = `
  struct U { d: array<vec4<f32>, 2> };
  @group(0) @binding(0) var<uniform> U_:U;
  @group(0) @binding(1) var samp:sampler;
  @group(0) @binding(2) var tex:texture_2d<f32>;
  struct VO { @builtin(position) pos:vec4<f32>, @location(0) uv:vec2<f32> };
  @fragment fn fs(in:VO)->@location(0) vec4<f32>{
    let texel=vec2<f32>(U_.d[0].x,U_.d[0].y); let injPos=vec2<f32>(U_.d[0].z,U_.d[0].w); let injAmt=U_.d[1].x; let damp=U_.d[1].y;
    let uv=in.uv;
    let c=textureSample(tex,samp,uv).r-0.5;
    let p=textureSample(tex,samp,uv).g-0.5;
    let l=textureSample(tex,samp,uv-vec2<f32>(texel.x,0.0)).r-0.5;
    let r=textureSample(tex,samp,uv+vec2<f32>(texel.x,0.0)).r-0.5;
    let u=textureSample(tex,samp,uv-vec2<f32>(0.0,texel.y)).r-0.5;
    let dn=textureSample(tex,samp,uv+vec2<f32>(0.0,texel.y)).r-0.5;
    var nx=((l+r+u+dn)*0.5-p)*damp;
    let dist=length(uv-injPos);
    nx=nx+injAmt*exp(-dist*dist*900.0);
    return vec4<f32>(clamp(nx+0.5,0.0,1.0), clamp(c+0.5,0.0,1.0), 0.0, 1.0);
  }`;

  // ---- COMPOSITE ----
  const COMP_WGSL = `
  struct U { d: array<vec4<f32>, 7> };
  @group(0) @binding(0) var<uniform> U_:U;
  @group(0) @binding(1) var samp:sampler;
  @group(0) @binding(2) var texScene:texture_2d<f32>;
  @group(0) @binding(3) var texBloom:texture_2d<f32>;
  @group(0) @binding(4) var texDof:texture_2d<f32>;
  fn h2(p:vec2<f32>)->f32{ return fract(sin(dot(p,vec2<f32>(12.9898,78.233)))*43758.5453); }
  fn lum(c:vec3<f32>)->f32{ return dot(c,vec3<f32>(0.299,0.587,0.114)); }
  fn aces(x:vec3<f32>)->vec3<f32>{ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),vec3<f32>(0.0),vec3<f32>(1.0)); }
  struct VO { @builtin(position) pos:vec4<f32>, @location(0) uv:vec2<f32> };
  @fragment fn fs(in:VO)->@location(0) vec4<f32>{
    let time=U_.d[0].x; let glitch=U_.d[0].y; let grainAmt=U_.d[0].z; let bloomAmt=U_.d[0].w;
    let dofAmt=U_.d[1].x; let exposure=U_.d[1].y; let zoomAmt=U_.d[1].z;
    let texelF=vec2<f32>(U_.d[2].x,U_.d[2].y);
    let fBloom=U_.d[3].x; let fDof=U_.d[3].y; let fVignette=U_.d[3].z; let fScan=U_.d[3].w;
    let fGrain=U_.d[4].x; let fTonemap=U_.d[4].y; let fFlare=U_.d[4].z; let fHalation=U_.d[4].w;
    let fSharpen=U_.d[5].x; let fCrt=U_.d[5].y; let fDither=U_.d[5].z; let fEdge=U_.d[5].w;
    let fZoomblur=U_.d[6].x;
    let uv=in.uv;
    var gsh=vec2<f32>(0.0,0.0); let g=glitch;
    if(g>0.01){ let row=floor(uv.y*48.0); gsh.x=(h2(vec2<f32>(row,floor(time*18.0)))-0.5)*0.06*g; }
    var col:vec3<f32>;
    if(fZoomblur>0.5){ col=vec3<f32>(0.0); for(var i=0;i<8;i=i+1){ let s=1.0-f32(i)*zoomAmt*0.012; col=col+textureSample(texScene,samp,(uv-0.5)*s+0.5+gsh).rgb; } col=col/8.0; }
    else if(g>0.01){ let ca=0.008*g; col=vec3<f32>(textureSample(texScene,samp,uv+vec2<f32>(gsh.x+ca,0.0)).r, textureSample(texScene,samp,uv+gsh).g, textureSample(texScene,samp,uv+vec2<f32>(gsh.x-ca,0.0)).b); }
    else { col=textureSample(texScene,samp,uv).rgb; }
    if(fSharpen>0.5){ let n=(textureSample(texScene,samp,uv+vec2<f32>(texelF.x,0.0)).rgb+textureSample(texScene,samp,uv-vec2<f32>(texelF.x,0.0)).rgb+textureSample(texScene,samp,uv+vec2<f32>(0.0,texelF.y)).rgb+textureSample(texScene,samp,uv-vec2<f32>(0.0,texelF.y)).rgb)*0.25; col=col+(col-n)*0.8; }
    if(fEdge>0.5){ let tl=lum(textureSample(texScene,samp,uv+vec2<f32>(-texelF.x,-texelF.y)).rgb); let tt=lum(textureSample(texScene,samp,uv+vec2<f32>(0.0,-texelF.y)).rgb); let tr=lum(textureSample(texScene,samp,uv+vec2<f32>(texelF.x,-texelF.y)).rgb); let llp=lum(textureSample(texScene,samp,uv+vec2<f32>(-texelF.x,0.0)).rgb); let rr=lum(textureSample(texScene,samp,uv+vec2<f32>(texelF.x,0.0)).rgb); let bl=lum(textureSample(texScene,samp,uv+vec2<f32>(-texelF.x,texelF.y)).rgb); let bb=lum(textureSample(texScene,samp,uv+vec2<f32>(0.0,texelF.y)).rgb); let br=lum(textureSample(texScene,samp,uv+vec2<f32>(texelF.x,texelF.y)).rgb); let gx=tl+2.0*llp+bl-tr-2.0*rr-br; let gy=tl+2.0*tt+tr-bl-2.0*bb-br; let e=clamp(length(vec2<f32>(gx,gy))*1.2,0.0,1.0); col=mix(col,vec3<f32>(0.0),e*0.4)+vec3<f32>(e)*0.35; }
    if(fDof>0.5){ let b=textureSample(texDof,samp,uv).rgb; col=mix(col,b,smoothstep(0.25,0.95,length(uv-0.5))*dofAmt); }
    if(fBloom>0.5){ col=col+textureSample(texBloom,samp,uv).rgb*bloomAmt; }
    if(fFlare>0.5){ var st=vec3<f32>(0.0); for(var i=1;i<=6;i=i+1){ let o=f32(i)*0.022; st=st+textureSample(texBloom,samp,uv+vec2<f32>(o,0.0)).rgb; st=st+textureSample(texBloom,samp,uv-vec2<f32>(o,0.0)).rgb; } col=col+st/12.0*vec3<f32>(0.45,0.7,1.0)*1.3; }
    if(fHalation>0.5){ col=col+textureSample(texBloom,samp,uv).rgb*vec3<f32>(0.55,0.12,0.06)*1.4; }
    if(fTonemap>0.5){ col=aces(col*exposure); }
    if(fScan>0.5){ col=col*(0.92+0.08*sin(uv.y*1600.0)); }
    if(fCrt>0.5){ let cc=uv-0.5; col=col*(1.0-0.16*dot(cc,cc)*2.0); let sub=modf2(in.pos.x,3.0); let mr=select(0.65,1.25,sub<1.0); let mg=select(0.65,1.25,(sub>=1.0&&sub<2.0)); let mb=select(0.65,1.25,sub>=2.0); col=col*vec3<f32>(mr,mg,mb); col=col*(0.9+0.1*sin(uv.y*900.0)); }
    if(fVignette>0.5){ col=col*mix(1.0,smoothstep(1.18,0.35,length((uv-0.5)*vec2<f32>(1.05,1.0))),0.85); }
    if(fGrain>0.5){ col=col+(h2(uv*vec2<f32>(1280.0,720.0)+fract(time))-0.5)*grainAmt; }
    if(fDither>0.5){ let b=h2(floor(in.pos.xy)); col=floor(col*24.0+b)/24.0; }
    return vec4<f32>(col,1.0);
  }
  fn modf2(a:f32,b:f32)->f32{ return a-b*floor(a/b); }`;

  async function createEngine(canvas) {
    if (!navigator.gpu) throw new Error('no webgpu');
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error('no adapter');
    const device = await adapter.requestDevice();
    const ctx = canvas.getContext('webgpu');
    const format = navigator.gpu.getPreferredCanvasFormat();
    ctx.configure({ device, format, alphaMode: 'opaque' });
    const OFF = 'rgba8unorm';

    const mod = (code) => device.createShaderModule({ code });
    const mFull = mod(VS_FULL);
    const mScene = mod(SCENE_WGSL), mPart = mod(PART_WGSL), mBlur = mod(BLUR_WGSL), mRip = mod(RIP_WGSL), mComp = mod(COMP_WGSL);

    function fsPipeline(fragMod, targetFormat, blend) {
      return device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: mFull, entryPoint: 'vs' },
        fragment: { module: fragMod, entryPoint: 'fs', targets: [{ format: targetFormat, blend: blend || undefined }] },
        primitive: { topology: 'triangle-list' },
      });
    }
    const pScene = fsPipeline(mScene, OFF);
    const pBlur = fsPipeline(mBlur, OFF);
    const pRip = fsPipeline(mRip, OFF);
    const pComp = fsPipeline(mComp, format);
    const ADD_BLEND = { color: { srcFactor: 'src-alpha', dstFactor: 'one', operation: 'add' }, alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } };
    const ALPHA_BLEND = { color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }, alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } };
    function partPipeline(blend) {
      return device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: mPart, entryPoint: 'vs' },
        fragment: { module: mPart, entryPoint: 'fs', targets: [{ format: OFF, blend }] },
        primitive: { topology: 'triangle-list' },
      });
    }
    const pPartAdd = partPipeline(ADD_BLEND);
    const pPartAlpha = partPipeline(ALPHA_BLEND);

    const samp = device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge' });

    // uniform buffers
    const buf = (n) => device.createBuffer({ size: n * 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const ubScene = buf(7), ubComp = buf(7), ubPart = buf(2), ubBlur = buf(2), ubRip = buf(2);
    const fScene = new Float32Array(28), fComp = new Float32Array(28), fPart = new Float32Array(8), fBlur = new Float32Array(8), fRip = new Float32Array(8);

    // render targets
    let W = 1, H = 1, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const RW = 256, RH = 144;
    let sceneTex, bloomA, bloomB, dofA, dofB, ripA, ripB;
    function mkTarget(w, h) { return device.createTexture({ size: [w, h], format: OFF, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST }); }
    function destroyT(t) { if (t) t.destroy(); }
    function clearRip(t) {
      const enc = device.createCommandEncoder();
      enc.beginRenderPass({ colorAttachments: [{ view: t.createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0.5, g: 0.5, b: 0, a: 1 } }] }).end();
      device.queue.submit([enc.finish()]);
    }
    function resize() {
      const rc = canvas.getBoundingClientRect();
      W = Math.max(2, Math.round(rc.width * dpr)); H = Math.max(2, Math.round(rc.height * dpr));
      canvas.width = W; canvas.height = H;
      [sceneTex, bloomA, bloomB, dofA, dofB].forEach(destroyT);
      const hw = Math.max(2, W >> 1), hh = Math.max(2, H >> 1);
      sceneTex = mkTarget(W, H); bloomA = mkTarget(hw, hh); bloomB = mkTarget(hw, hh); dofA = mkTarget(hw, hh); dofB = mkTarget(hw, hh);
      if (!ripA) { ripA = mkTarget(RW, RH); ripB = mkTarget(RW, RH); clearRip(ripA); clearRip(ripB); }
    }
    resize();
    const ro = new ResizeObserver(() => resize()); ro.observe(canvas);

    // textures
    const textures = {};
    function placeholderTex() {
      const t = device.createTexture({ size: [1, 1], format: OFF, usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
      device.queue.writeTexture({ texture: t }, new Uint8Array([20, 20, 26, 255]), { bytesPerRow: 4 }, [1, 1]);
      return t;
    }
    function loadTexture(key, url) {
      const e = { tex: placeholderTex(), aspect: 16 / 9 };
      textures[key] = e;
      (async () => {
        try {
          const resp = await fetch(url); const blob = await resp.blob();
          const bmp = await createImageBitmap(blob, { colorSpaceConversion: 'none' });
          e.aspect = bmp.width / bmp.height;
          const t = device.createTexture({ size: [bmp.width, bmp.height], format: OFF, usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
          device.queue.copyExternalImageToTexture({ source: bmp }, { texture: t }, [bmp.width, bmp.height]);
          e.tex = t;
        } catch (err) { console.error('tex load failed', url, err); }
      })();
      return e;
    }

    const COUNTS = [3000, 2500, 4000, 5000, 500, 600, 3000];
    const ADDITIVE = [true, false, false, false, true, true, true];
    const ROUND = [1, 1, 1, 0, 1, 1, 1];
    const PT = ['embers', 'ash', 'snow', 'rain', 'fireflies', 'sparks', 'dust'];

    let curTex = null, prevTex = null, trans = 1.0, transMode = 0, transDur = 0.8;
    const state = { time: 0, mouse: [0.5, 0.5], wind: 0.15, glitch: 0, toggles: {}, params: { intensity: 0.8, fogAmt: 0.6, grainAmt: 0.08, bloomAmt: 0.7, dofAmt: 0.3, exposure: 1.0, zoomAmt: 0.5 } };
    let prevMouse = [0.5, 0.5];
    function tf(k) { return state.toggles[k] ? 1 : 0; }
    function bg(pipeline, entries) { return device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries }); }

    function fullDraw(pass, pipeline, group) { pass.setPipeline(pipeline); pass.setBindGroup(0, group); pass.draw(3); }

    function renderTo(targetView, pipeline, group, clear) {
      const enc = device.createCommandEncoder();
      const pass = enc.beginRenderPass({ colorAttachments: [{ view: targetView, loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } }] });
      fullDraw(pass, pipeline, group); pass.end();
      device.queue.submit([enc.finish()]);
    }

    function doBlur(srcTex, tmp, dst, bright, w, h) {
      // pass 1: src -> tmp (horizontal)
      fBlur[0] = 1; fBlur[1] = 0; fBlur[2] = 1 / w; fBlur[3] = 1 / h; fBlur[4] = bright; device.queue.writeBuffer(ubBlur, 0, fBlur);
      let group = bg(pBlur, [{ binding: 0, resource: { buffer: ubBlur } }, { binding: 1, resource: samp }, { binding: 2, resource: srcTex.createView() }]);
      renderTo(tmp.createView(), pBlur, group, true);
      // pass 2: tmp -> dst (vertical)
      fBlur[0] = 0; fBlur[1] = 1; fBlur[4] = 0; device.queue.writeBuffer(ubBlur, 0, fBlur);
      group = bg(pBlur, [{ binding: 0, resource: { buffer: ubBlur } }, { binding: 1, resource: samp }, { binding: 2, resource: tmp.createView() }]);
      renderTo(dst.createView(), pBlur, group, true);
    }

    function simRipple() {
      const dx = state.mouse[0] - prevMouse[0], dy = state.mouse[1] - prevMouse[1];
      const vel = Math.min(0.4, Math.hypot(dx, dy) * 6.0);
      fRip[0] = 1 / RW; fRip[1] = 1 / RH; fRip[2] = state.mouse[0]; fRip[3] = state.mouse[1]; fRip[4] = vel; fRip[5] = 0.985;
      device.queue.writeBuffer(ubRip, 0, fRip);
      const group = bg(pRip, [{ binding: 0, resource: { buffer: ubRip } }, { binding: 1, resource: samp }, { binding: 2, resource: ripA.createView() }]);
      renderTo(ripB.createView(), pRip, group, true);
      const t = ripA; ripA = ripB; ripB = t;
    }

    function render() {
      const t = state.time;
      if (state.toggles.ripple) simRipple();

      // scene uniforms
      const cur = curTex || { tex: placeholderTex(), aspect: 16 / 9 };
      const prv = prevTex || cur;
      fScene[0] = t; fScene[1] = W / H; fScene[2] = cur.aspect; fScene[3] = prv.aspect;
      fScene[4] = state.mouse[0]; fScene[5] = state.mouse[1]; fScene[6] = 1 / RW; fScene[7] = 1 / RH;
      fScene[8] = trans; fScene[9] = transMode; fScene[10] = state.params.fogAmt; fScene[11] = 0;
      fScene[12] = tf('grade'); fScene[13] = tf('warm'); fScene[14] = tf('cool'); fScene[15] = tf('sepia');
      fScene[16] = tf('mono'); fScene[17] = tf('invert'); fScene[18] = tf('chroma'); fScene[19] = tf('barrel');
      fScene[20] = tf('heat'); fScene[21] = tf('poster'); fScene[22] = tf('fog'); fScene[23] = tf('godrays');
      fScene[24] = tf('parallax'); fScene[25] = tf('ripple'); fScene[26] = tf('kenburns'); fScene[27] = 0;
      device.queue.writeBuffer(ubScene, 0, fScene);
      const sceneGroup = bg(pScene, [
        { binding: 0, resource: { buffer: ubScene } }, { binding: 1, resource: samp },
        { binding: 2, resource: cur.tex.createView() }, { binding: 3, resource: prv.tex.createView() }, { binding: 4, resource: ripA.createView() },
      ]);

      // scene + particles in one pass
      const enc = device.createCommandEncoder();
      const pass = enc.beginRenderPass({ colorAttachments: [{ view: sceneTex.createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } }] });
      pass.setPipeline(pScene); pass.setBindGroup(0, sceneGroup); pass.draw(3);
      // particles
      fPart[1] = state.wind; fPart[5] = W; fPart[6] = H; fPart[7] = dpr;
      for (let i = 0; i < PT.length; i++) {
        if (!state.toggles[PT[i]]) continue;
        fPart[0] = t; fPart[2] = i; fPart[4] = ROUND[i];
        device.queue.writeBuffer(ubPart, 0, fPart);
        const pp = ADDITIVE[i] ? pPartAdd : pPartAlpha;
        const grp = bg(pp, [{ binding: 0, resource: { buffer: ubPart } }]);
        pass.setPipeline(pp); pass.setBindGroup(0, grp);
        pass.draw(6, Math.round(COUNTS[i] * state.params.intensity));
      }
      pass.end();
      device.queue.submit([enc.finish()]);

      // bloom / dof
      const doBloom = state.toggles.bloom || state.toggles.flare || state.toggles.halation;
      const hw = Math.max(2, W >> 1), hh = Math.max(2, H >> 1);
      if (doBloom) doBlur(sceneTex, bloomB, bloomA, 1.0, hw, hh);
      const doDof = state.toggles.dof;
      if (doDof) doBlur(sceneTex, dofB, dofA, 0.0, hw, hh);

      // composite to swapchain
      fComp[0] = t; fComp[1] = state.glitch; fComp[2] = state.params.grainAmt; fComp[3] = state.params.bloomAmt;
      fComp[4] = state.params.dofAmt; fComp[5] = state.params.exposure; fComp[6] = state.params.zoomAmt; fComp[7] = 0;
      fComp[8] = 1 / W; fComp[9] = 1 / H; fComp[10] = 0; fComp[11] = 0;
      fComp[12] = tf('bloom'); fComp[13] = tf('dof'); fComp[14] = tf('vignette'); fComp[15] = tf('scan');
      fComp[16] = tf('grain'); fComp[17] = tf('tonemap'); fComp[18] = tf('flare'); fComp[19] = tf('halation');
      fComp[20] = tf('sharpen'); fComp[21] = tf('crt'); fComp[22] = tf('dither'); fComp[23] = tf('edge');
      fComp[24] = tf('zoomblur'); fComp[25] = 0; fComp[26] = 0; fComp[27] = 0;
      device.queue.writeBuffer(ubComp, 0, fComp);
      const compGroup = bg(pComp, [
        { binding: 0, resource: { buffer: ubComp } }, { binding: 1, resource: samp },
        { binding: 2, resource: sceneTex.createView() },
        { binding: 3, resource: (doBloom ? bloomA : sceneTex).createView() },
        { binding: 4, resource: (doDof ? dofA : sceneTex).createView() },
      ]);
      renderTo(ctx.getCurrentTexture().createView(), pComp, compGroup, true);

      prevMouse[0] = state.mouse[0]; prevMouse[1] = state.mouse[1];
    }

    return {
      device, state, backend: 'webgpu',
      loadTexture,
      setActive(key) { const e = textures[key]; if (!e) return; if (!curTex) { curTex = e; prevTex = e; trans = 1.0; } else if (e !== curTex) { prevTex = curTex; curTex = e; trans = 0.0; } },
      setTransition(modeIdx, durSec) { transMode = modeIdx; transDur = Math.max(0.1, durSec); },
      setMouse(x, y) { state.mouse[0] = x; state.mouse[1] = y; },
      setToggles(t) { state.toggles = t; },
      setParams(p) { Object.assign(state.params, p); },
      setGlitch(v) { state.glitch = v; },
      transitioning() { return trans < 1.0; },
      tick(dt) {
        const rc = canvas.getBoundingClientRect();
        const tw = Math.round(rc.width * dpr), th = Math.round(rc.height * dpr);
        if (tw > 2 && th > 2 && (tw !== W || th !== H)) resize();
        if (trans < 1.0) trans = Math.min(1.0, trans + dt / transDur);
        state.time += dt; render();
      },
      dispose() {
        ro.disconnect();
        for (const k in textures) destroyT(textures[k]?.tex);
        [sceneTex, bloomA, bloomB, dofA, dofB, ripA, ripB].forEach(destroyT);
        [ubScene, ubComp, ubPart, ubBlur, ubRip].forEach((b) => b.destroy());
        device.destroy();
      },
    };
  }

  export { createEngine };
