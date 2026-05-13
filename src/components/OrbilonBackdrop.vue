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

export default Vue.extend({
  name: 'OrbilonBackdrop',
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
    };
  },
  mounted() {
    const c = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = c.getContext('2d', { alpha: false });
    this.start = performance.now();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    window.addEventListener('resize', this.onResize);
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
    if (this.ro) this.ro.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
  },
  methods: {
    onResize() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const p = this.$el.parentElement;
      if (!canvas || !p) return;
      const rw = p.clientWidth || 800;
      const rh = p.clientHeight || 600;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.dpr = dpr;
      const w = Math.max(1, Math.floor(rw * dpr));
      const h = Math.max(1, Math.floor(rh * dpr));
      if (w === this.w && h === this.h) return;
      this.w = w;
      this.h = h;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${rw}px`;
      canvas.style.height = `${rh}px`;

      const pr: Particle[] = [];
      const n = Math.min(380, Math.floor((rw * rh) / 3500));
      for (let i = 0; i < n; i++) {
        const roll = Math.random();
        const layer = roll < 0.14 ? 0 : roll < 0.42 ? 1 : 2;
        const big = layer === 0;
        const r = (
          big
            ? Math.random() * 3.8 + 1.25
            : layer === 1
              ? Math.random() * 2.0 + 0.55
              : Math.random() * 1.15 + 0.32
        ) * dpr;
        pr.push({
          sx: Math.random() * w,
          sy: Math.random() * h,
          r,
          vx: (Math.random() - 0.5) * (big ? 0.045 : 0.085) * dpr,
          vy: (Math.random() - 0.5) * (big ? 0.04 : 0.075) * dpr,
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
    },
    loop() {
      const ctx = this.ctx;
      if (!ctx || this.w < 2) {
        this.raf = requestAnimationFrame(() => this.loop());
        return;
      }
      const t = (performance.now() - this.start) * 0.001;
      const w = this.w;
      const h = this.h;
      const dpr = this.dpr;
      const ox = w * 0.5 + Math.sin(t * 0.07) * w * 0.028;
      const oy = h * 0.44 + Math.cos(t * 0.055) * h * 0.022;
      const fieldSpin = t * 0.000165;

      ctx.fillStyle = '#02040c';
      ctx.fillRect(0, 0, w, h);

      /** 主椭圆轨道 */
      for (const ring of this.rings) {
        ring.rot += ring.drift;
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

      /** 星点：分层绕场心慢旋 + 轻微漂移，近层略大 */
      for (const p of this.particles) {
        p.sx += p.vx;
        p.sy += p.vy;
        p.tw += 0.018 + p.layer * 0.006;
        if (p.sx < -40) p.sx = w + 40;
        if (p.sx > w + 40) p.sx = -40;
        if (p.sy < -40) p.sy = h + 40;
        if (p.sy > h + 40) p.sy = -40;

        const spin = fieldSpin * (0.72 + p.layer * 0.62) * (0.94 + 0.06 * Math.sin(t * 0.28 + p.tw));
        const dx = p.sx - ox;
        const dy = p.sy - oy;
        const c = Math.cos(spin);
        const s = Math.sin(spin);
        let px = ox + dx * c - dy * s;
        let py = oy + dx * s + dy * c;
        const par = 0.012 * Math.sin(t * 0.19 + p.tw * 1.7);
        px += (dx * c - dy * s) * par * (0.35 - p.layer * 0.08);
        py += (dx * s + dy * c) * par * (0.35 - p.layer * 0.08);

        const tw = 0.58 + 0.42 * Math.sin(p.tw + t * 0.35);
        const alpha = p.a * tw;
        const isBig = p.layer === 0 || p.r > 1.75 * dpr;
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

      this.raf = requestAnimationFrame(() => this.loop());
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
