<template>
  <div
    class="character-grid-container absolute inset-0 overflow-hidden pointer-events-none"
    ref="container"
    :class="{ 'character-grid-container--out': !isInView }"
  >
    <!-- 从内向外「绽放」显现 + 光晕追随 logo 区域 -->
    <div class="character-grid-stage" :class="{ 'character-grid-stage--subtle': subtle }">
      <div
        class="character-grid font-mono whitespace-pre select-none"
        :style="gridStyle"
      >
        {{ gridText }}
      </div>
      <div class="matrix-spotlight" aria-hidden="true" />
      <div class="matrix-shimmer" aria-hidden="true" />
    </div>
  </div>
</template>

<script>
/** ~21fps：减轻大段 DOM 文本重排频率 */
const GRID_TICK_MS = 48;

export default {
  name: 'CharacterGrid',
  props: {
    /** 氛围弱模式：降低对比与光晕，不抢了正文与操作动线 */
    subtle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cols: 0,
      rows: 0,
      gridText: '',
      chars: '0123456789ABCDEF#$@%&*+=/\\:;.<>[]{}|^~?',
      mouseX: -1000,
      mouseY: -1000,
      rafId: null,
      tick: 0,
      isInView: true,
      visibilityObserver: null,
      /** ≤480px：首页矩阵字号放大，与 calculateGrid / updateGrid 单元对齐 */
      narrowViewport: false,
    };
  },
  computed: {
    gridStyle() {
      const narrow = this.narrowViewport;
      const fs = narrow ? '16px' : '13px';
      const lh = narrow ? '19px' : '15px';
      if (this.subtle) {
        return {
          display: 'block',
          width: '100%',
          height: '100%',
          fontSize: fs,
          lineHeight: lh,
          color: 'rgba(125, 152, 212, 0.10)',
          opacity: '1',
          textShadow: '0 0 6px rgba(46, 79, 255, 0.03)',
        };
      }
      return {
        display: 'block',
        width: '100%',
        height: '100%',
        fontSize: fs,
        lineHeight: lh,
        color: 'rgba(125, 152, 212, 0.30)',
        opacity: '1',
        textShadow: '0 0 10px rgba(46, 79, 255, 0.08)',
      };
    },
  },
  mounted() {
    this.calculateGrid();
    window.addEventListener('resize', this.calculateGrid);
    window.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('visibilitychange', this.onDocVisibility);
    this.setupVisibilityObserver();
    this.animate();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateGrid);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('visibilitychange', this.onDocVisibility);
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
      this.visibilityObserver = null;
    }
    this.clearGridLoop();
  },
  methods: {
    clearGridLoop() {
      if (this.rafId !== null) {
        clearTimeout(this.rafId);
        this.rafId = null;
      }
    },
    onDocVisibility() {
      if (typeof document === 'undefined' || document.hidden) {
        this.clearGridLoop();
        return;
      }
      if (this.isInView && !this.rafId) {
        this.animate();
      }
    },
    calculateGrid() {
      const container = this.$refs.container;
      if (!container) return;

      this.narrowViewport = typeof window !== 'undefined' && window.innerWidth <= 480;
      const narrow = this.narrowViewport;
      const charWidth = narrow ? 9 : 7;
      const charHeight = narrow ? 19 : 15;

      this.cols = Math.floor(container.clientWidth / charWidth);
      this.rows = Math.floor(container.clientHeight / charHeight);

      this.generateInitialGrid();
    },
    generateInitialGrid() {
      let text = '';
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          text += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        text += '\n';
      }
      this.gridText = text;
    },
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    setupVisibilityObserver() {
      const el = this.$refs.container;
      if (!el || typeof IntersectionObserver === 'undefined') {
        return;
      }
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          const v = entries[0] ? entries[0].isIntersecting : true;
          if (v && !this.isInView) {
            this.isInView = true;
            if (!this.rafId && typeof document !== 'undefined' && !document.hidden) {
              this.animate();
            }
          } else if (!v && this.isInView) {
            this.isInView = false;
            this.clearGridLoop();
          }
        },
        { root: null, threshold: 0, rootMargin: '80px 0px 80px 0px' },
      );
      this.visibilityObserver.observe(el);
    },
    animate() {
      if (!this.isInView || (typeof document !== 'undefined' && document.hidden)) {
        this.clearGridLoop();
        return;
      }
      this.tick++;
      /* 每 3 次调度刷新矩阵，减轻 CPU（视口内仍保持可接受的动感） */
      if (this.tick % 3 === 0) {
        this.updateGrid();
      }
      this.rafId = window.setTimeout(() => {
        this.rafId = null;
        this.animate();
      }, GRID_TICK_MS);
    },
    updateGrid() {
      if (this.cols === 0 || this.rows === 0) return;

      const container = this.$refs.container;
      const rect = container.getBoundingClientRect();
      const relX = this.mouseX - rect.left;
      const relY = this.mouseY - rect.top;

      const narrow = this.narrowViewport;
      const charWidth = narrow ? 9 : 7;
      const charHeight = narrow ? 19 : 15;

      const mouseCol = Math.floor(relX / charWidth);
      const mouseRow = Math.floor(relY / charHeight);

      /* logo 重心大致在左侧偏上（zero2x 标题区域），强化该方向的扰动 */
      const focalCol = Math.floor(this.cols * 0.22);
      const focalRow = Math.floor(this.rows * 0.42);

      let newText = '';
      const gridArray = this.gridText.split('\n');

      for (let r = 0; r < this.rows; r++) {
        let rowStr = gridArray[r] || '';
        let newRow = '';

        for (let c = 0; c < this.cols; c++) {
          const distMouse = Math.sqrt(Math.pow(c - mouseCol, 2) + Math.pow(r - mouseRow, 2));
          const distLogo = Math.sqrt(Math.pow(c - focalCol, 2) + Math.pow(r - focalRow, 2));

          /* 环形波纹：随时间让焦点附近字符更易翻转 */
          const wave =
            0.96 +
            0.04 * Math.sin(Date.now() * 0.0018 - distLogo * 0.09);

          if (distMouse < 9) {
            newRow += this.chars[Math.floor(Math.random() * this.chars.length)];
          } else if (distLogo < 12 && Math.random() > wave) {
            newRow += this.chars[Math.floor(Math.random() * this.chars.length)];
          } else if (Math.random() > 0.9992) {
            newRow += this.chars[Math.floor(Math.random() * this.chars.length)];
          } else {
            newRow += rowStr[c] || ' ';
          }
        }
        newText += newRow + '\n';
      }
      this.gridText = newText;
    },
  },
};
</script>

<style scoped>
.character-grid-container {
  z-index: 1;
}

.character-grid-container--out .matrix-spotlight,
.character-grid-container--out .matrix-shimmer {
  animation-play-state: paused !important;
}

.character-grid-stage {
  position: absolute;
  inset: 0;
  animation: grid-bloom-in 2.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes grid-bloom-in {
  0% {
    clip-path: circle(0% at 22% 46%);
    opacity: 0.25;
    filter: brightness(0.35) saturate(0.7);
  }
  55% {
    opacity: 0.62;
    filter: brightness(0.88) saturate(1.02);
  }
  100% {
    clip-path: circle(160% at 22% 46%);
    opacity: 0.66;
    filter: brightness(0.98) saturate(0.94);
  }
}

/* 数据页等场景：整体再压一档，只做背景氛围 */
.character-grid-stage--subtle {
  animation: grid-bloom-in-subtle 2.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes grid-bloom-in-subtle {
  0% {
    clip-path: circle(0% at 22% 46%);
    opacity: 0.06;
    filter: brightness(1.05) saturate(0.85);
  }
  55% {
    opacity: 0.26;
    filter: brightness(1.04) saturate(0.9);
  }
  100% {
    clip-path: circle(160% at 22% 46%);
    opacity: 0.30;
    filter: brightness(1.02) saturate(0.88);
  }
}

.matrix-spotlight {
  position: absolute;
  inset: -15%;
  pointer-events: none;
  background: radial-gradient(
    ellipse 48% 42% at 22% 46%,
    rgba(120, 145, 255, 0.11) 0%,
    rgba(46, 79, 255, 0.05) 42%,
    transparent 72%
  );
  animation: spotlight-drift 12s ease-in-out infinite alternate;
  mix-blend-mode: screen;
  opacity: 0.5;
}

@keyframes spotlight-drift {
  0% {
    transform: translate(-1.5%, -1%) scale(1);
    opacity: 0.38;
  }
  100% {
    transform: translate(2%, 1.5%) scale(1.06);
    opacity: 0.52;
  }
}

/* 细微扫描高光（斜向移动，非横向分割线） */
.matrix-shimmer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 40%,
    rgba(255, 255, 255, 0.012) 50%,
    transparent 60%
  );
  background-size: 220% 220%;
  animation: shimmer-pass 14s linear infinite;
  mix-blend-mode: overlay;
}

@keyframes shimmer-pass {
  0% {
    background-position: 120% 40%;
  }
  100% {
    background-position: -120% 60%;
  }
}

.character-grid-stage--subtle .matrix-spotlight {
  background: radial-gradient(
    ellipse 48% 42% at 22% 46%,
    rgba(110, 130, 255, 0.05) 0%,
    rgba(46, 79, 255, 0.02) 42%,
    transparent 72%
  );
  animation: spotlight-drift-subtle 12s ease-in-out infinite alternate;
  mix-blend-mode: soft-light;
  opacity: 1;
}

.character-grid-stage--subtle .matrix-shimmer {
  opacity: 0.35;
  background: linear-gradient(
    115deg,
    transparent 40%,
    rgba(255, 255, 255, 0.01) 50%,
    transparent 60%
  );
}

@keyframes spotlight-drift-subtle {
  0% {
    transform: translate(-1.5%, -1%) scale(1);
    opacity: 0.12;
  }
  100% {
    transform: translate(2%, 1.5%) scale(1.06);
    opacity: 0.22;
  }
}

.character-grid {
  letter-spacing: 0;
}
</style>
