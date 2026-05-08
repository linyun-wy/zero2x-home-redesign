<template>
  <!-- 字符颗粒仅在「zero2x」字形区域内生成；跟随鼠标位置即时重绘 -->
  <div class="ascii-grain-root absolute inset-0 overflow-hidden pointer-events-none select-none" ref="root">
    <div class="ascii-grain-stage">
      <pre class="ascii-grain-pre" :style="preStyle">{{ gridText }}</pre>
    </div>
    <div class="ascii-grain-vignette" aria-hidden="true" />
    <div class="ascii-grain-shimmer" aria-hidden="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const CELL_W = 6;
const CELL_H = 12;

/** 字标轮廓（Canvas 蒙版） */
const LOGO_TEXT = 'zero2x';

/** 蒙版区域内仅循环使用这些字符，形成「zero2x」氛围矩阵 */
const LOGO_GRAIN = 'zero2x';

export default Vue.extend({
  name: 'AsciiGrainBackdrop',
  data() {
    return {
      gridText: '',
      cols: 0,
      rows: 0,
      maskBits: null as Uint8Array | null,
      rafId: null as number | null,
      tick: 0,
      /** 相对于 ascii-grain-root 的坐标，null 表示尚未移入该区域 */
      mouseLocalX: null as number | null,
      mouseLocalY: null as number | null,
      logoAnchorCol: 0,
      logoAnchorRow: 0,
      pendingRebuildMask: false,
    };
  },
  computed: {
    preStyle(): Record<string, string> {
      return {
        fontSize: '11px',
        lineHeight: `${CELL_H}px`,
        letterSpacing: '0',
        color: 'rgba(200, 214, 242, 0.58)',
        textShadow:
          '0 0 2px rgba(46, 79, 255, 0.35), 0 0 8px rgba(46, 79, 255, 0.12)',
      };
    },
  },
  mounted() {
    this.layout();
    window.addEventListener('resize', this.layout);
    window.addEventListener('mousemove', this.onMove);
    this.loop();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.layout);
    window.removeEventListener('mousemove', this.onMove);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  },
  methods: {
    layout() {
      const el = this.$refs.root as HTMLElement | undefined;
      if (!el) return;
      const wPx = Math.max(1, el.clientWidth);
      const hPx = Math.max(1, el.clientHeight);
      this.cols = Math.floor(wPx / CELL_W);
      this.rows = Math.floor(hPx / CELL_H);
      this.buildLogoMaskAndGrid();
    },

    scheduleRebuildMask() {
      if (this.pendingRebuildMask) return;
      this.pendingRebuildMask = true;
      requestAnimationFrame(() => {
        this.pendingRebuildMask = false;
        this.buildLogoMaskAndGrid();
      });
    },

    /** Canvas 绘制字标 → 栅格采样 → maskBits；仅在字形内置随机颗粒 */
    buildLogoMaskAndGrid() {
      if (this.cols < 8 || this.rows < 4) {
        this.maskBits = null;
        this.gridText = '';
        return;
      }

      if (this.mouseLocalX === null || this.mouseLocalY === null) {
        this.maskBits = null;
        this.gridText = '';
        return;
      }

      const canvasW = this.cols * CELL_W;
      const canvasH = this.rows * CELL_H;
      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      let size = Math.floor(Math.min(canvasH * 0.52, canvasW / 5.5));
      size = Math.min(size, Math.floor(canvasH * 0.58));
      size = Math.max(14, Math.min(size, 280));
      while (size >= 12) {
        ctx.font =
          '900 ' +
          String(size) +
          'px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
        if (ctx.measureText(LOGO_TEXT).width <= canvasW * 0.88) break;
        size -= 2;
      }
      if (size < 12) size = 12;
      ctx.font =
        '900 ' +
        String(size) +
        'px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif';

      const tw = ctx.measureText(LOGO_TEXT).width;
      const pad = Math.max(8, size * 0.28);
      let ax = this.mouseLocalX;
      let ay = this.mouseLocalY;
      ax = Math.max(tw / 2 + pad, Math.min(canvasW - tw / 2 - pad, ax));
      ay = Math.max(size * 0.62 + pad, Math.min(canvasH - size * 0.62 - pad, ay));

      ctx.fillText(LOGO_TEXT, ax, ay);

      this.logoAnchorCol = Math.floor(ax / CELL_W);
      this.logoAnchorRow = Math.floor(ay / CELL_H);

      const img = ctx.getImageData(0, 0, canvasW, canvasH);
      const data = img.data;

      const lumAt = (px: number, py: number) => {
        const x = Math.max(0, Math.min(canvasW - 1, Math.floor(px)));
        const y = Math.max(0, Math.min(canvasH - 1, Math.floor(py)));
        const j = (y * canvasW + x) * 4;
        return (data[j] + data[j + 1] + data[j + 2]) / 3 / 255;
      };

      const threshold = 0.14;
      const mask = new Uint8Array(this.cols * this.rows);
      const patLen = LOGO_GRAIN.length;

      let grid = '';
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const cx = c * CELL_W + CELL_W * 0.5;
          const cy = r * CELL_H + CELL_H * 0.5;
          const L =
            (lumAt(cx - 0.8, cy) +
              lumAt(cx + 0.8, cy) +
              lumAt(cx, cy - 0.8) +
              lumAt(cx, cy + 0.8) +
              lumAt(cx, cy)) /
            5;

          const idx = r * this.cols + c;
          if (L > threshold) {
            mask[idx] = 1;
            grid += LOGO_GRAIN[idx % patLen];
          } else {
            mask[idx] = 0;
            grid += ' ';
          }
        }
        grid += '\n';
      }

      this.maskBits = mask;
      this.gridText = grid;
    },

    onMove(e: MouseEvent) {
      const el = this.$refs.root as HTMLElement | undefined;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      this.mouseLocalX = x;
      this.mouseLocalY = y;
      this.scheduleRebuildMask();
    },

    loop() {
      this.tick++;
      if (this.tick % 2 === 0) this.scatter();
      this.rafId = requestAnimationFrame(this.loop);
    },

    scatter() {
      if (!this.maskBits || this.cols === 0 || this.rows === 0) return;
      const mx = this.mouseLocalX ?? -1e6;
      const my = this.mouseLocalY ?? -1e6;
      const mc = Math.floor(mx / CELL_W);
      const mr = Math.floor(my / CELL_H);

      let lines = this.gridText.split('\n').slice(0, this.rows);
      while (lines.length < this.rows) lines.push('');

      const gLen = LOGO_GRAIN.length;
      const cx = this.logoAnchorCol;
      const cy = this.logoAnchorRow;

      for (let r = 0; r < this.rows; r++) {
        const padded = lines[r].padEnd(this.cols, ' ');
        let out = '';
        for (let c = 0; c < this.cols; c++) {
          const idx = r * this.cols + c;
          if (!this.maskBits[idx]) {
            out += ' ';
            continue;
          }

          const ch = padded[c];
          const dMouse = Math.hypot(c - mc, r - mr);
          const dCenter = Math.hypot(c - cx, r - cy);
          const wave =
            0.9 +
            0.1 * Math.sin(Date.now() * 0.0014 + dCenter * 0.06);

          if (dMouse < 12 && Math.random() > 0.42) {
            out += LOGO_GRAIN[(Math.random() * gLen) | 0];
          } else if (Math.random() > wave) {
            out += LOGO_GRAIN[(Math.random() * gLen) | 0];
          } else if (Math.random() > 0.996) {
            out += LOGO_GRAIN[(Math.random() * gLen) | 0];
          } else {
            out += ch;
          }
        }
        lines[r] = out;
      }
      this.gridText = lines.join('\n');
    },
  },
});
</script>

<style scoped>
.ascii-grain-root {
  z-index: 0;
}

.ascii-grain-stage {
  position: absolute;
  inset: -2%;
  animation: ascii-bloom 3.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes ascii-bloom {
  0% {
    clip-path: inset(48% 48% 48% 48%);
    opacity: 0.15;
    filter: brightness(0.55);
  }
  100% {
    clip-path: inset(0% 0% 0% 0%);
    opacity: 1;
    filter: brightness(1);
  }
}

.ascii-grain-pre {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  white-space: pre;
  overflow: hidden;
  font-family: var(--font-mono, 'JetBrains Mono', 'SF Mono', ui-monospace, monospace);
  font-weight: 500;
}

.ascii-grain-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 75% 65% at 50% 42%,
    rgba(46, 79, 255, 0.06) 0%,
    transparent 55%
  );
  mix-blend-mode: screen;
  opacity: 0.55;
  pointer-events: none;
}

.ascii-grain-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    118deg,
    transparent 35%,
    rgba(255, 255, 255, 0.045) 50%,
    transparent 65%
  );
  background-size: 180% 180%;
  animation: ascii-shimmer 18s linear infinite;
  mix-blend-mode: overlay;
  pointer-events: none;
  opacity: 0.45;
}

@keyframes ascii-shimmer {
  0% {
    background-position: 80% 20%;
  }
  100% {
    background-position: -80% 80%;
  }
}
</style>
