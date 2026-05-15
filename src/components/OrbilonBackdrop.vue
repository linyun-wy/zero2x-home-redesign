<template>
  <canvas
    ref="canvas"
    class="orbilon-backdrop"
    aria-hidden="true"
  />
</template>

<script lang="ts">
import Vue from 'vue';

type Particle = {
  sx: number;
  sy: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  tw: number;
  layer: number;
};

/** 入场静止时长（秒），之后星场与轨道再开始运动 */
const ANIM_DELAY_SEC = 5;
/** 入场静止期：画面不变，仅用较低频调度（ms）避免 60fps 空转 */
const STATIC_POLL_MS = 250;
/** 画布内部分辨率上限（物理像素倍率），压低填充像素量 */
const ORBILON_MAX_DRAW_DPR = 1.25;

export default Vue.extend({
  name: 'OrbilonBackdrop',
  props: {
    /** 离屏或不需要动画时为 true，停止调度（RAF / 静止期定时器） */
    paused: { type: Boolean, default: false },
  },
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      raf: 0 as number,
      w: 0,
      h: 0,
      dpr: 1,
      particles: [] as Particle[],
      rings: [] as { cx: number; cy: number; rx: number; ry: number; rot: number; drift: number; a: number }[],
      start: 0,
      ro: null as ResizeObserver | null,
      /** 静止期 setTimeout id；与 raf 互斥 */
      staticTimer: 0 as number,
    };
  },
  mounted() {
    const c = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = c.getContext('2d', { alpha: false });
    this.start = performance.now();
    this.dpr = Math.min(
      Math.min(window.devicePixelRatio || 1, 2),
      ORBILON_MAX_DRAW_DPR,
    );
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onDocVisibility);
    const root = this.$el.parentElement;
    if (root && typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.onResize());
      this.ro.observe(root);
    }
    this.$nextTick(() => {
      this.onResize();
      this.loop();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onDocVisibility);
    if (this.ro) this.ro.disconnect();
    this.clearSchedule();
  },
  watch: {
    paused(val: boolean) {
      this.clearSchedule();
      if (val) {
        return;
      }
      /* 每次区块回到视口：重新从静止 5s 再运动 */
      this.start = performance.now();
      this.loop();
    },
  },
  methods: {
    clearSchedule() {
      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
      if (this.staticTimer) {
        clearTimeout(this.staticTimer);
        this.staticTimer = 0;
      }
    },
    onDocVisibility() {
      if (typeof document === 'undefined' || document.hidden) {
        this.clearSchedule();
        return;
      }
      /* 不重置 start：切回标签页时从原时间线继续（含静止 5s 逻辑） */
      if (!this.paused) {
        this.loop();
      }
    },
    onResize() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const p = this.$el.parentElement;
      if (!canvas || !p) return;
      const rw = p.clientWidth || 800;
      const rh = p.clientHeight || 600;
      const layoutDpr = Math.min(window.devicePixelRatio || 1, 2);
      const drawDpr = Math.min(layoutDpr, ORBILON_MAX_DRAW_DPR);
      this.dpr = drawDpr;
      const w = Math.max(1, Math.floor(rw * drawDpr));
      const h = Math.max(1, Math.floor(rh * drawDpr));
      if (w === this.w && h === this.h) return;
      this.w = w;
      this.h = h;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${rw}px`;
      canvas.style.height = `${rh}px`;

      const pr: Particle[] = [];
      /* 再降密度 + 上限，减轻每帧 arc/gradient */
      const n = Math.min(200, Math.floor((rw * rh) / 6500));
      for (let i = 0; i < n; i++) {
        const roll = Math.random();
        /* 原 layer2≈58%；现为 ≈29%，多出的份额并入 layer1 */
        const layer = roll < 0.14 ? 0 : roll < 0.71 ? 1 : 2;
        const big = layer === 0;
        const r = (
          big
            ? Math.random() * 4.2 + 1.45
            : layer === 1
              ? Math.random() * 2.35 + 0.85
              : Math.random() * 1.05 + 0.48
        ) * drawDpr;
        pr.push({
          sx: Math.random() * w,
          sy: Math.random() * h,
          r,
          vx: (Math.random() - 0.5) * (big ? 0.045 : 0.085) * drawDpr,
          vy: (Math.random() - 0.5) * (big ? 0.04 : 0.075) * drawDpr,
          a: (big ? 0.38 : 0.14) + Math.random() * (big ? 0.48 : 0.52),
          tw: Math.random() * Math.PI * 2,
          layer,
        });
      }
      this.particles = pr;

      /**
       * 主椭圆：扁长（rx ≫ ry），微倾后上下缘超出画布，轨线通向画外更有纵深；
       * 避免 rx≈ry 时像正圆。
       */
      const cx = w * 0.48;
      const cy = h * 0.5;
      this.rings = [
        {
          cx,
          cy,
          rx: w * 0.9,
          ry: h * 0.1,
          rot: -0.36,
          drift: 0.000068,
          a: 0.22,
        },
      ];
      if (!this.paused) {
        this.clearSchedule();
        this.loop();
      }
    },
    scheduleNextFrame() {
      if (this.paused) return;
      const tSec = (performance.now() - this.start) * 0.001;
      const tAnim = Math.max(0, tSec - ANIM_DELAY_SEC);
      if (tAnim <= 0) {
        const remainMs = (ANIM_DELAY_SEC - tSec) * 1000;
        const delay =
          remainMs <= 0 ? STATIC_POLL_MS : Math.min(STATIC_POLL_MS, Math.max(40, remainMs));
        this.staticTimer = window.setTimeout(() => {
          this.staticTimer = 0;
          this.loop();
        }, delay);
      } else {
        this.raf = requestAnimationFrame(() => {
          this.raf = 0;
          this.loop();
        });
      }
    },
    loop() {
      this.clearSchedule();
      if (this.paused) {
        return;
      }
      const ctx = this.ctx;
      if (!ctx || this.w < 2) {
        if (!this.paused) this.scheduleNextFrame();
        return;
      }
      const tSec = (performance.now() - this.start) * 0.001;
      const tAnim = Math.max(0, tSec - ANIM_DELAY_SEC);
      const w = this.w;
      const h = this.h;
      const dpr = this.dpr;
      const ox = w * 0.5 + Math.sin(tAnim * 0.07) * w * 0.028;
      const oy = h * 0.44 + Math.cos(tAnim * 0.055) * h * 0.022;
      const fieldSpin = tAnim * 0.000165;

      ctx.fillStyle = '#02040c';
      ctx.fillRect(0, 0, w, h);

      /** 主椭圆轨道 */
      for (const ring of this.rings) {
        if (tAnim > 0) ring.rot += ring.drift;
        ctx.save();
        ctx.translate(ring.cx, ring.cy);
        ctx.rotate(ring.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(70, 130, 255, ${ring.a})`;
        ctx.lineWidth = 1.05 * dpr;
        ctx.shadowColor = 'rgba(60, 140, 255, 0.45)';
        ctx.shadowBlur = 12 * dpr;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(160, 200, 255, ${ring.a * 0.32})`;
        ctx.lineWidth = 0.42 * dpr;
        ctx.stroke();
        ctx.restore();
      }

      /** 星点：前 ANIM_DELAY_SEC 秒静止，之后绕场心慢旋 + 漂移 */
      for (const p of this.particles) {
        if (tAnim > 0) {
          p.sx += p.vx;
          p.sy += p.vy;
          p.tw += 0.018 + p.layer * 0.006;
        }
        if (p.sx < -40) p.sx = w + 40;
        if (p.sx > w + 40) p.sx = -40;
        if (p.sy < -40) p.sy = h + 40;
        if (p.sy > h + 40) p.sy = -40;

        const spin = fieldSpin * (0.72 + p.layer * 0.62) * (0.94 + 0.06 * Math.sin(tAnim * 0.28 + p.tw));
        const dx = p.sx - ox;
        const dy = p.sy - oy;
        const c = Math.cos(spin);
        const s = Math.sin(spin);
        let px = ox + dx * c - dy * s;
        let py = oy + dx * s + dy * c;
        const par = 0.012 * Math.sin(tAnim * 0.19 + p.tw * 1.7);
        px += (dx * c - dy * s) * par * (0.35 - p.layer * 0.08);
        py += (dx * s + dy * c) * par * (0.35 - p.layer * 0.08);

        const tw = 0.58 + 0.42 * Math.sin(p.tw + tAnim * 0.35);
        const alpha = p.a * tw;
        const isBig = p.layer === 0 || p.r > 1.85 * dpr;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        if (isBig) {
          const g = ctx.createRadialGradient(px - p.r * 0.25, py - p.r * 0.25, 0, px, py, p.r * 2.6);
          g.addColorStop(0, `rgba(210, 235, 255, ${alpha})`);
          g.addColorStop(0.35, `rgba(100, 160, 255, ${alpha * 0.5})`);
          g.addColorStop(1, 'rgba(40, 90, 200, 0)');
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = `rgba(175, 210, 255, ${alpha * 0.92})`;
        }
        ctx.fill();
      }

      if (!this.paused) this.scheduleNextFrame();
    },
  },
});
</script>

<style scoped>
.orbilon-backdrop {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
