<template>
  <canvas
    ref="canvas"
    class="hero-sdf-dot-matrix"
    aria-hidden="true"
  />
</template>

<script lang="ts">
import Vue from 'vue';

/** 与 drawFrame 中双团 gooey 合成一致，用于着色权重 */
const METABALL_GOOEY_P = 0.87;

/** 与首页 CharacterGrid 一致 */
const CHARS = '0123456789ABCDEF#$@%&*+=/\\:;.<>[]{}|^~?';

type Vec2 = { x: number; y: number };
type RGB = { r: number; g: number; b: number };

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mixRgb(a: RGB, b: RGB, t: number): RGB {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

/** 略提速，贴近参考里 Scene Speed 的舒展节奏 */
function waterTime(t: number): number {
  return t * 1.48 + Math.sin(t * 0.3) * 0.045 + Math.sin(t * 0.13) * 0.055;
}

function waterWarp(p: Vec2, ti: number): Vec2 {
  const tw = waterTime(ti);
  return {
    x: p.x + Math.sin(p.y * 1.15 + tw * 0.42) * 0.005 + Math.sin(p.y * 2.15 - tw * 0.26) * 0.002,
    y: p.y + Math.cos(p.x * 1.02 - tw * 0.38) * 0.0045 + Math.cos(p.x * 1.92 + tw * 0.22) * 0.0018,
  };
}

function ball(p: Vec2, c: Vec2, r: number): number {
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  const d2 = dx * dx + dy * dy;
  return (r * r) / Math.max(d2, 1e-5);
}

/** Metaball soft-union：p∈(0,1) 时在重叠区抬高场值，颈部更宽、更易读出「水滴拉长再断」 */
function metaballGooey(a: number, b: number, p: number): number {
  return Math.pow(Math.pow(Math.max(a, 0), p) + Math.pow(Math.max(b, 0), p), 1 / p);
}

/**
 * 水滩形态：id=0 为「多圆簇」——若干强度接近的偏心球在等值线上读出多枚圆钮；
 * id=1 为异形双核 + 不对称鼓包。卫星距 base 须够远才会在 f=0.68 上外凸。
 */
function puddleCluster(pw: Vec2, base: Vec2, ang: number, sep: number, r1: number, r2: number, tw: number, id: number): number {
  const ox = Math.cos(ang) * sep;
  const oy = Math.sin(ang) * sep;
  let f = 0;

  if (id === 0) {
    /* 左团：三枚主钮错开 + 外圈 3 枚小圆 */
    f += ball(pw, { x: base.x + ox * 0.92, y: base.y + oy * 0.88 }, r1 * 0.64);
    f += ball(pw, { x: base.x - ox * 0.55, y: base.y - oy * 0.52 }, r2 * 0.61);
    const aHub = ang + 0.92 + 0.035 * Math.sin(tw * 0.075);
    const dHub = 0.32 + sep * 0.55;
    f += ball(pw, { x: base.x + Math.cos(aHub) * dHub, y: base.y + Math.sin(aHub) * dHub }, r1 * 0.57);

    const beads = [
      { da: 0.38, dist: 0.37, k: 0.56, ph: 0.0 },
      { da: 1.58, dist: 0.34, k: 0.52, ph: 0.55 },
      { da: -0.9, dist: 0.4, k: 0.5, ph: 1.05 },
    ];
    for (let i = 0; i < beads.length; i++) {
      const b = beads[i]!;
      const w = 0.016 * Math.sin(tw * 0.09 + b.ph);
      const a = ang + b.da + 0.04 * Math.sin(tw * 0.07 + i * 0.7);
      const d = b.dist + w;
      const rad = (i % 2 === 0 ? r1 : r2) * b.k;
      f += ball(pw, { x: base.x + Math.cos(a) * d, y: base.y + Math.sin(a) * d }, rad);
    }
    return f;
  }

  /* 右团：强异形双核 + 错落鼓包（刻意不镜像左团） */
  f += ball(pw, { x: base.x + ox * 1.02, y: base.y + oy * 0.92 }, r1 * 0.58);
  f += ball(pw, { x: base.x - ox * 0.62, y: base.y - oy * 0.78 }, r2 * 0.56);

  const ik = id * 1.71;
  const a1 = ang + 0.42 + Math.sin(tw * 0.088 + ik) * 0.15;
  const d1 = 0.33 + Math.sin(tw * 0.1 + ik * 0.7) * 0.022;
  f += ball(pw, { x: base.x + Math.cos(a1) * d1, y: base.y + Math.sin(a1) * d1 }, r1 * 0.54);

  const a2 = ang + Math.PI - 0.45 + Math.cos(tw * 0.072 + ik) * 0.14;
  const d2 = 0.26 + Math.cos(tw * 0.098 + ik) * 0.02;
  f += ball(pw, { x: base.x + Math.cos(a2) * d2, y: base.y + Math.sin(a2) * d2 }, r1 * 0.5);

  const a3 = ang + Math.PI * 0.52 + Math.sin(tw * 0.078 + ik * 1.3) * 0.17;
  const d3 = 0.29 + Math.sin(tw * 0.065 + ik) * 0.016;
  f += ball(pw, { x: base.x + Math.cos(a3) * d3, y: base.y + Math.sin(a3) * d3 }, r1 * 0.53);

  const a4 = ang - Math.PI * 0.48 + 0.32 + Math.cos(tw * 0.074 + ik * 1.1) * 0.16;
  const d4 = 0.2 + Math.cos(tw * 0.085 + ik) * 0.016;
  f += ball(pw, { x: base.x + Math.cos(a4) * d4, y: base.y + Math.sin(a4) * d4 }, r2 * 0.72);

  const a5 = ang + 2.5 + Math.sin(tw * 0.07 + ik) * 0.1;
  const d5 = 0.41 + Math.sin(tw * 0.082 + ik * 0.5) * 0.014;
  f += ball(pw, { x: base.x + Math.cos(a5) * d5, y: base.y + Math.sin(a5) * d5 }, r1 * 0.41);

  return f;
}

function fieldAutoSplit(pc: Vec2, t: number): { f1: number; f2: number } {
  const tw = waterTime(t);
  /*
   * 单主轴聚散 + smoothstep^2：靠近与分开都更圆融，像两滴液面张力融合/拉断。
   * 少量 tide 错开纵移，避免完全刚性；融合时减弱 warp，轮廓更稳、桥更清楚。
   */
  const flowMaturity = smoothstep(2.2, 10.5, t);
  const theta = tw * 0.118 + 0.36 * Math.sin(tw * 0.055);
  let u = 0.5 + 0.5 * Math.sin(theta);
  const sepLock = mix(0.988, 0, flowMaturity);
  u = Math.max(u, sepLock);
  let spreadGap = smoothstep(0.06, 0.95, u);
  spreadGap = spreadGap * spreadGap * (3 - 2 * spreadGap);

  const tide = 0.5 + 0.5 * Math.cos(theta * 1.05 + 0.92);
  let spreadY = mix(spreadGap, smoothstep(0.08, 0.92, tide), 0.11);

  const warpRelax = mix(0.48, 1, spreadGap);
  const pw0 = waterWarp(pc, t);
  const pw = {
    x: pc.x + (pw0.x - pc.x) * warpRelax,
    y: pc.y + (pw0.y - pc.y) * warpRelax,
  };

  const gapX = mix(0.11, 1.15, spreadGap);

  const wanderAx = Math.sin(tw * 0.17 + 0.4) * 0.042 + Math.cos(tw * 0.1) * 0.026;
  const wanderAy = Math.cos(tw * 0.14 + 0.2) * 0.038 + Math.sin(tw * 0.088) * 0.024;
  const drift2x = Math.sin(tw * 0.13 + 2.05) * 0.046 + Math.cos(tw * 0.079 + 0.4) * 0.028;
  const drift2y = Math.cos(tw * 0.1 + 0.55) * 0.04 + Math.sin(tw * 0.072 + 1.2) * 0.026;

  const c1 = { x: 0.7 + wanderAx, y: 0.08 + wanderAy };
  const yMerge = 0.012;
  const yApart = -0.32;
  let c2 = {
    x: c1.x + gapX + drift2x,
    y: c1.y + mix(yMerge, yApart, spreadY) + drift2y + Math.sin(tw * 0.11) * 0.02 * spreadY,
  };
  const ang1 = tw * 0.11 + 0.7 + Math.sin(tw * 0.14) * 0.18;
  const ang2 = tw * 0.098 + 2.0 + Math.cos(tw * 0.13) * 0.17;
  const sep1 = 0.098 + Math.sin(tw * 0.12) * 0.01;
  const sep2 = 0.086 + Math.cos(tw * 0.11) * 0.009;
  const f1 = puddleCluster(pw, c1, ang1, sep1, 0.4, 0.29, tw, 0);
  const f2 = puddleCluster(pw, c2, ang2, sep2, 0.31, 0.23, tw, 1);
  return { f1, f2 };
}

function fieldMouse(pc: Vec2, t: number, mouseNdc: Vec2): number {
  const tw = waterTime(t);
  const pw = waterWarp(pc, t);
  const drift = { x: Math.sin(tw * 0.16) * 0.0075, y: Math.cos(tw * 0.14) * 0.007 };
  const c = { x: mouseNdc.x + drift.x, y: mouseNdc.y + drift.y };
  const sep = 0.038 + Math.sin(tw * 0.18) * 0.004;
  const ang = tw * 0.14 + Math.sin(tw * 0.11) * 0.16;
  const ox = Math.cos(ang) * sep;
  const oy = Math.sin(ang) * sep;
  return ball(pw, { x: c.x + ox, y: c.y + oy }, 0.13) + ball(pw, { x: c.x - ox * 0.65, y: c.y - oy * 0.65 }, 0.095);
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function bgSample(uv: Vec2): RGB {
  const icy: RGB = { r: 0.882, g: 0.914, b: 0.961 };
  const lav: RGB = { r: 0.902, g: 0.894, b: 0.949 };
  const g = uv.y * 0.62 + (1 - uv.x) * 0.14 + uv.x * 0.08;
  return mixRgb(icy, lav, clamp(g, 0, 1));
}

function colorDroplet(Fb: number, bgPage: RGB): RGB {
  const corn: RGB = { r: 0.545, g: 0.639, b: 0.89 };
  const cornMid: RGB = { r: 0.5, g: 0.6, b: 0.87 };
  const cornDeep: RGB = { r: 0.46, g: 0.56, b: 0.84 };
  const cyanS: RGB = { r: 0.25, g: 0.78, b: 0.9 };
  const violS: RGB = { r: 0.47, g: 0.45, b: 0.91 };
  const edge = smoothstep(0.78, 1.06, Fb);
  const body = smoothstep(0.88, 2.1, Fb);
  const core = smoothstep(1.15, 4.0, Fb);
  const cornEdge = mixRgb(cornDeep, bgPage, 0.07);
  let c = { ...bgPage };
  c = mixRgb(c, cornEdge, edge * 0.52);
  c = mixRgb(c, corn, body * 0.46);
  c = mixRgb(c, cornMid, body * 0.4);
  c = mixRgb(c, cyanS, body * 0.22);
  c = mixRgb(c, violS, smoothstep(1.0, 2.35, Fb) * 0.18);
  c = mixRgb(c, mixRgb(corn, violS, 0.28), core * 0.22);
  return c;
}

function colMouseOnly(Fm: number, bgPage: RGB): RGB {
  const corn: RGB = { r: 0.545, g: 0.639, b: 0.89 };
  const cornMid: RGB = { r: 0.5, g: 0.6, b: 0.87 };
  const cornDeep: RGB = { r: 0.46, g: 0.56, b: 0.84 };
  const cyanS: RGB = { r: 0.25, g: 0.78, b: 0.9 };
  const violS: RGB = { r: 0.47, g: 0.45, b: 0.91 };
  const mEdge = smoothstep(0.78, 1.06, Fm);
  const mBody = smoothstep(0.88, 2.1, Fm);
  const mCore = smoothstep(1.15, 4.0, Fm);
  const cornEdge = mixRgb(cornDeep, bgPage, 0.07);
  let c = { ...bgPage };
  c = mixRgb(c, cornEdge, mEdge * 0.52);
  c = mixRgb(c, corn, mBody * 0.44);
  c = mixRgb(c, cornMid, mBody * 0.4);
  c = mixRgb(c, cyanS, mBody * 0.22);
  c = mixRgb(c, violS, smoothstep(1.0, 2.35, Fm) * 0.18);
  c = mixRgb(c, mixRgb(corn, violS, 0.28), mCore * 0.2);
  return c;
}

function pixelToNdc(px: number, py: number, w: number, h: number): Vec2 {
  const glY = h - py;
  return {
    x: (px / w) * 2 - 1,
    y: (glY / h) * 2 - 1,
  };
}

function applyNdcAspect(pc: Vec2, w: number, h: number): Vec2 {
  return { x: pc.x * (w / h), y: pc.y };
}

function initialChar(cx: number, cy: number): string {
  const u = ((cx * 73856093) ^ (cy * 19349663)) >>> 0;
  return CHARS[u % CHARS.length]!;
}

/** 每格独立的翻转概率（略不同，避免齐步走） */
function flipProbability(cx: number, cy: number): number {
  const h = ((cx * 73856093) ^ (cy * 19349663) ^ (cx * cy * 47)) >>> 0;
  return 0.00045 + (h % 800) / 2850000;
}

export default Vue.extend({
  name: 'HeroSdfDotMatrix',
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      raf: 0 as number,
      start: 0 as number,
      mouseX: 0.02,
      mouseY: 0.5,
      mouseSmoothX: 0.02,
      mouseSmoothY: 0.5,
      mouseLive: 0,
      resizeObs: null as ResizeObserver | null,
      reduceMotion: false,
      width: 0,
      height: 0,
      dpr: 1,
      /** 栅格键 `${cx},${cy}` → 当前字符；仅气泡内格子参与，帧末修剪 */
      charCells: {} as Record<string, string>,
    };
  },
  mounted() {
    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.onResize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    const roEl = this.$el.parentElement;
    if (roEl && typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(() => this.onResize());
      this.resizeObs.observe(roEl);
    }
    if (!this.reduceMotion) {
      this.start = performance.now();
      this.loop();
    } else {
      this.drawStatic();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.resizeObs) this.resizeObs.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
  },
  methods: {
    onResize() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * this.dpr));
      const h = Math.max(1, Math.floor(rect.height * this.dpr));
      if (canvas.width === w && canvas.height === h && this.width === w && this.height === h) return;
      canvas.width = w;
      canvas.height = h;
      this.width = w;
      this.height = h;
      this.charCells = {};
      if (this.reduceMotion) this.drawStatic();
    },

    onMouseMove(ev: MouseEvent) {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      this.mouseX = (ev.clientX - r.left) / r.width;
      this.mouseY = 1.0 - (ev.clientY - r.top) / r.height;
      this.mouseX = Math.min(1, Math.max(0, this.mouseX));
      this.mouseY = Math.min(1, Math.max(0, this.mouseY));
      this.mouseLive = 1;
    },

    drawStatic() {
      const t = 2.6 * 0.82;
      this.mouseSmoothX = this.mouseX;
      this.mouseSmoothY = this.mouseY;
      this.drawFrame(t);
    },

    loop() {
      const t = (performance.now() - this.start) * 0.00205;
      this.mouseSmoothX += (this.mouseX - this.mouseSmoothX) * 0.085;
      this.mouseSmoothY += (this.mouseY - this.mouseSmoothY) * 0.085;
      this.drawFrame(t);
      this.raf = requestAnimationFrame(() => this.loop());
    },

    drawFrame(t: number) {
      const ctx = this.ctx;
      if (!ctx || this.width < 2 || this.height < 2) return;
      const w = this.width;
      const h = this.height;
      const dpr = this.dpr;
      const mobile = typeof window !== 'undefined' && window.innerWidth < 900 ? 1 : 0;

      const charPitchX = 7 * dpr;
      const charPitchY = 15 * dpr;
      const fontPx = Math.round(13 * dpr);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `700 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;

      const mouseNdcRaw: Vec2 = {
        x: this.mouseSmoothX * 2 - 1,
        y: this.mouseSmoothY * 2 - 1,
      };
      const mouseNdc: Vec2 = { x: mouseNdcRaw.x * (w / h), y: mouseNdcRaw.y };

      const activeKeys = new Set<string>();

      for (let cy = 0; (cy + 1) * charPitchY < h; cy++) {
        for (let cx = 0; (cx + 1) * charPitchX < w; cx++) {
          const px = (cx + 0.5) * charPitchX;
          const py = (cy + 0.5) * charPitchY;
          const uv: Vec2 = { x: px / w, y: py / h };
          let pc = pixelToNdc(px, py, w, h);
          pc = applyNdcAspect(pc, w, h);

          const { f1: f1a, f2: f2a } = fieldAutoSplit(pc, t);
          const fa = metaballGooey(f1a, f2a, METABALL_GOOEY_P);
          const fm = fieldMouse(pc, t, mouseNdc) * this.mouseLive;
          const f = fa + fm;

          if (f < 0.68) continue;

          const fieldMask = smoothstep(0.76, 0.98, f);
          if (fieldMask < 0.02) continue;

          let edgeFade = smoothstep(0.06, 0.42, uv.x);
          if (mobile > 0.5) {
            edgeFade *= 1.0 - smoothstep(0.28, 0.9, uv.y);
          }

          const bgPage = bgSample(uv);
          const col1 = colorDroplet(f1a, bgPage);
          const col2 = colorDroplet(f2a, bgPage);
          const ww = smoothstep(0.08, 0.92, f2a / Math.max(fa, 1e-5));
          let colAuto = mixRgb(col1, col2, ww);
          const tie = smoothstep(0.48, 0.9, 1.0 - Math.abs(f1a - f2a) / Math.max(fa, 1e-5));
          colAuto = mixRgb(colAuto, { r: colAuto.r * 0.96, g: colAuto.g * 0.97, b: colAuto.b * 0.99 }, tie * 0.16);

          let colM = colMouseOnly(fm, bgPage);
          const share = smoothstep(0.06, 0.78, fm / Math.max(f, 1e-5));
          const merge = smoothstep(0.18, 0.85, Math.min(fa, fm) / Math.max(Math.max(fa, fm), 0.06));
          let col = mixRgb(colAuto, colM, share);
          col = mixRgb(col, mixRgb(colAuto, colM, 0.5), merge * 0.28);

          let edgeSoft = smoothstep(0.84, 1.0, f);
          col = mixRgb(bgPage, col, edgeSoft);
          const rim = 1.0 - smoothstep(0.78, 1.25, f);
          const rimCol: RGB = { r: 0.5, g: 0.62, b: 0.88 };
          col = mixRgb(col, mixRgb(rimCol, bgPage, 0.35), rim * 0.06);

          let alpha = fieldMask * edgeFade * (0.88 + 0.16 * smoothstep(0.88, 1.45, f));
          alpha = Math.min(1, alpha * 1.05);

          const key = `${cx},${cy}`;
          activeKeys.add(key);
          let ch = this.charCells[key];
          if (ch === undefined) {
            ch = initialChar(cx, cy);
            this.charCells[key] = ch;
          }
          if (f > 0.7 && Math.random() < flipProbability(cx, cy)) {
            let ni = Math.floor(Math.random() * CHARS.length);
            let next = CHARS[ni]!;
            if (next === ch && CHARS.length > 1) {
              ni = (ni + 1 + ((cx ^ cy) % (CHARS.length - 1))) % CHARS.length;
              next = CHARS[ni]!;
            }
            ch = next;
            this.charCells[key] = ch;
          }

          ctx.fillStyle = `rgba(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(
            col.b * 255,
          )},${alpha.toFixed(3)})`;
          ctx.fillText(ch, px, py);
        }
      }

      for (const k of Object.keys(this.charCells)) {
        if (!activeKeys.has(k)) {
          delete this.charCells[k];
        }
      }
    },
  },
});
</script>

<style scoped>
.hero-sdf-dot-matrix {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
