<template>
  <canvas
    ref="canvas"
    class="wireframe-sphere"
    :style="canvasStyle"
    aria-hidden="true"
  />
</template>

<script lang="ts">
import Vue from 'vue';

/** Y 轴为极轴（北纬 +Y），与地球经纬网一致 */
function sphereMeridian(λ: number, nSeg: number, R: number): { x: number; y: number; z: number }[] {
  const pts: { x: number; y: number; z: number }[] = [];
  for (let k = 0; k <= nSeg; k++) {
    const lat = -Math.PI / 2 + (k / nSeg) * Math.PI;
    pts.push({
      x: R * Math.cos(lat) * Math.cos(λ),
      y: R * Math.sin(lat),
      z: R * Math.cos(lat) * Math.sin(λ),
    });
  }
  return pts;
}

function sphereParallel(lat: number, nSeg: number, R: number): { x: number; y: number; z: number }[] {
  const cl = Math.cos(lat);
  const sl = Math.sin(lat);
  const pts: { x: number; y: number; z: number }[] = [];
  for (let k = 0; k <= nSeg; k++) {
    const φ = (k / nSeg) * Math.PI * 2;
    pts.push({
      x: R * cl * Math.cos(φ),
      y: R * sl,
      z: R * cl * Math.sin(φ),
    });
  }
  return pts;
}

function rotY(x: number, y: number, z: number, c: number, s: number) {
  return { x: x * c + z * s, y, z: -x * s + z * c };
}

function rotX(x: number, y: number, z: number, c: number, s: number) {
  return { x, y: y * c - z * s, z: y * s + z * c };
}

export default Vue.extend({
  name: 'WireframeSphere',
  props: {
    size: { type: Number, default: 48 },
    color: { type: String, default: 'rgba(118, 180, 255, 0.62)' },
    highlight: { type: String, default: 'rgba(255, 255, 255, 0.92)' },
    lineWidth: { type: Number, default: 1 },
    speed: { type: Number, default: 0.55 },
    meridians: { type: Number, default: 12 },
    parallels: { type: Number, default: 8 },
    /** 球心在画布内所占比例（略小于 1 留出描边与发光，避免贴边「框死」感） */
    fillRatio: { type: Number, default: 0 },
    /** 是否绘制最外层清晰轮廓圆（与投影球径一致） */
    showRim: { type: Boolean, default: true },
    rimColor: { type: String, default: 'rgba(200, 232, 255, 0.72)' },
    /** 为 true 时停止 RAF（用于区块离屏暂停） */
    paused: { type: Boolean, default: false },
    /** 为 false 时只绘制一帧，无自转 RAF（省 CPU） */
    animated: { type: Boolean, default: true },
  },
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      raf: 0 as number,
      angle: 0 as number,
      dpr: 1 as number,
    };
  },
  computed: {
    canvasStyle(): Record<string, string> {
      return { width: `${this.size}px`, height: `${this.size}px` };
    },
  },
  watch: {
    size() {
      this.setupCanvas();
      this.afterResizeRedraw();
    },
    paused(val: boolean) {
      if (this.animated) {
        if (val) {
          if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = 0;
          }
        } else {
          this.loop();
        }
      } else if (!val) {
        this.$nextTick(() => this.paint());
      }
    },
  },
  mounted() {
    const c = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = c.getContext('2d', { alpha: true });
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.setupCanvas();
    if (!this.animated) {
      this.angle = Math.random() * Math.PI * 2;
    }
    if (this.animated) {
      this.loop();
    } else {
      this.paint();
    }
  },
  beforeDestroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
  },
  methods: {
    setupCanvas() {
      const c = this.$refs.canvas as HTMLCanvasElement;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.dpr = dpr;
      const s = Math.max(8, this.size);
      c.width = Math.floor(s * dpr);
      c.height = Math.floor(s * dpr);
    },
    effectiveFillRatio(): number {
      if (this.fillRatio > 0) return Math.min(0.96, this.fillRatio);
      return this.size > 160 ? 0.9 : 0.82;
    },
    project(x: number, y: number, z: number, cx: number, cy: number, scale: number, d: number) {
      const sc = d / (d + z);
      return { x: cx + x * sc * scale, y: cy + y * sc * scale, z, sc };
    },
    /**
     * 透视投影下球面轮廓的屏幕半径：在球面上密采样取投影点到球心的最大距离，
     * 替代固定 scale 画圆，避免白圈与线框球大小/透视不一致。
     */
    computeProjectedSphereRadius(
      spin: number,
      tiltX: number,
      tiltZ: number,
      cx: number,
      cy: number,
      scale: number,
      d: number,
    ): number {
      const golden = (1 + Math.sqrt(5)) / 2;
      let rMax = 0;
      const n = 160;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const inc = Math.acos(1 - 2 * t);
        const az = 2 * Math.PI * golden * i;
        const x = Math.sin(inc) * Math.cos(az);
        const y = Math.cos(inc);
        const z = Math.sin(inc) * Math.sin(az);
        const q = this.transformPoint(x, y, z, spin, tiltX, tiltZ);
        const P = this.project(q.x, q.y, q.z, cx, cy, scale, d);
        const dist = Math.hypot(P.x - cx, P.y - cy);
        if (dist > rMax) rMax = dist;
      }
      return rMax > 0.2 * scale && Number.isFinite(rMax) ? rMax : scale;
    },
    transformPoint(
      x: number,
      y: number,
      z: number,
      spin: number,
      tiltX: number,
      tiltZ: number,
    ): { x: number; y: number; z: number } {
      const c0 = Math.cos(spin);
      const s0 = Math.sin(spin);
      let p = rotY(x, y, z, c0, s0);
      const cx1 = Math.cos(tiltX);
      const sx1 = Math.sin(tiltX);
      p = rotX(p.x, p.y, p.z, cx1, sx1);
      const cz = Math.cos(tiltZ);
      const sz = Math.sin(tiltZ);
      return rotY(p.x, p.y, p.z, cz, sz);
    },
    afterResizeRedraw() {
      if (this.animated) {
        if (!this.paused) {
          if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = 0;
          }
          this.loop();
        }
      } else {
        this.paint();
      }
    },
    loop() {
      if (!this.animated) {
        this.raf = 0;
        return;
      }
      if (this.paused) {
        this.raf = 0;
        return;
      }
      const ctx = this.ctx;
      const c = this.$refs.canvas as HTMLCanvasElement;
      if (!ctx || !c) {
        if (!this.paused) {
          this.raf = requestAnimationFrame(() => this.loop());
        } else {
          this.raf = 0;
        }
        return;
      }
      this.angle += 0.006 * this.speed;
      this.paint();
      this.raf = requestAnimationFrame(() => this.loop());
    },
    /** 单帧绘制（animated=false 或 loop 内调用） */
    paint() {
      const ctx = this.ctx;
      const c = this.$refs.canvas as HTMLCanvasElement;
      if (!ctx || !c) return;
      const w = c.width;
      const h = c.height;
      const cx = w / 2;
      const cy = h / 2;
      const fill = this.effectiveFillRatio();
      /** 为外圈描边 + shadowBlur 预留边距，避免贴 canvas 边缘被裁切 */
      const insetPad = 18 * this.dpr;
      const half = Math.min(w, h) / 2;
      const scale = Math.max(6 * this.dpr, (half - insetPad) * fill);
      const d = 2.5;
      const R = 1;

      /** 自西向东绕 Y 轴（地球自转感）；略俯仰视与 roll 让两极可读 */
      const spin = this.angle;
      const tiltX = 0.34;
      const tiltZ = -0.14;

      ctx.clearRect(0, 0, w, h);

      const mer = Math.max(4, Math.floor(this.meridians));
      const par = Math.max(3, Math.floor(this.parallels));
      const lw = this.lineWidth * this.dpr;
      const nSegM = 48;
      const nSegP = 56;

      const drawPolyline = (pts: { x: number; y: number; z: number }[], front: boolean, closed: boolean) => {
        ctx.strokeStyle = front ? this.color : 'rgba(100, 140, 200, 0.14)';
        ctx.lineWidth = front ? lw : lw * 0.5;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        let first = true;
        for (const p of pts) {
          const q = this.transformPoint(p.x, p.y, p.z, spin, tiltX, tiltZ);
          const P = this.project(q.x, q.y, q.z, cx, cy, scale, d);
          if (first) {
            ctx.moveTo(P.x, P.y);
            first = false;
          } else {
            ctx.lineTo(P.x, P.y);
          }
        }
        if (closed) ctx.closePath();
        ctx.stroke();
      };

      const zAvg = (pts: { x: number; y: number; z: number }[]) => {
        let s = 0;
        for (const p of pts) {
          const q = this.transformPoint(p.x, p.y, p.z, spin, tiltX, tiltZ);
          s += q.z;
        }
        return s / pts.length;
      };

      /** 背面经线 → 赤道附近纬线 → 前面经线（简化层次） */
      const merPts: { pts: { x: number; y: number; z: number }[]; z: number }[] = [];
      for (let mi = 0; mi < mer; mi++) {
        const λ = (mi / mer) * Math.PI * 2;
        const pts = sphereMeridian(λ, nSegM, R);
        merPts.push({ pts, z: zAvg(pts) });
      }
      merPts.sort((a, b) => a.z - b.z);
      for (const { pts, z } of merPts) {
        drawPolyline(pts, z > -0.02, false);
      }

      /** 纬线：跳过两极附近，纬度圈与赤道平行 */
      const parPts: { pts: { x: number; y: number; z: number }[]; z: number }[] = [];
      for (let pi = 1; pi < par; pi++) {
        const lat = ((pi / par) * 2 - 1) * (Math.PI / 2) * 0.92;
        const pts = sphereParallel(lat, nSegP, R);
        parPts.push({ pts, z: zAvg(pts) });
      }
      parPts.sort((a, b) => a.z - b.z);
      for (const { pts, z } of parPts) {
        drawPolyline(pts, z > -0.06, true);
      }

      /** 参考站点式高光：外层柔光 + 内层亮核（略偏右上） */
      const k = { x: scale * 0.34, y: -scale * 0.32 };
      const hx = cx + k.x;
      const hy = cy + k.y;
      const bloom = ctx.createRadialGradient(hx, hy, 0, hx, hy, scale * 0.38);
      bloom.addColorStop(0, 'rgba(200, 228, 255, 0.14)');
      bloom.addColorStop(0.35, 'rgba(120, 175, 240, 0.06)');
      bloom.addColorStop(0.7, 'rgba(80, 140, 220, 0.02)');
      bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(hx, hy, scale * 0.36, 0, Math.PI * 2);
      ctx.fill();

      const hx0 = cx + scale * 0.33;
      const hy0 = cy - scale * 0.3;
      const core = ctx.createRadialGradient(hx0, hy0, 0, hx0, hy0, scale * 0.1);
      core.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      core.addColorStop(0.25, 'rgba(230, 242, 255, 0.28)');
      core.addColorStop(0.55, 'rgba(170, 210, 255, 0.08)');
      core.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(hx0, hy0, scale * 0.095, 0, Math.PI * 2);
      ctx.fill();

      /** 最外层轮廓：半径与当前帧透视下的球面投影包络一致（避免白圈与线框脱节） */
      if (this.showRim) {
        const rimR = this.computeProjectedSphereRadius(spin, tiltX, tiltZ, cx, cy, scale, d);
        const pd = this.dpr;
        const rw = Math.max(1.1 * pd, lw * 1.65);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, rimR, 0, Math.PI * 2);
        ctx.strokeStyle = this.rimColor;
        ctx.lineWidth = rw;
        ctx.shadowColor = 'rgba(140, 200, 255, 0.35)';
        ctx.shadowBlur = 4 * pd;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = Math.max(0.55 * pd, lw * 0.35);
        ctx.stroke();
        ctx.restore();
      }
    },
  },
});
</script>

<style scoped>
.wireframe-sphere {
  display: block;
  vertical-align: middle;
}
</style>
