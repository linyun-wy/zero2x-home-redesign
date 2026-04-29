<template>
  <section class="hero-section relative overflow-hidden text-white">
    <!-- 背景字符矩阵 -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <CharacterGrid />
    </div>

    <!-- 渐变遮罩 + 网格线 -->
    <div class="absolute inset-0 pointer-events-none grid-lines-dark" style="z-index:1;"></div>
    <div class="absolute inset-0 pointer-events-none hero-gradient-veil" style="z-index:2;"></div>

    <!-- 内容区域 -->
    <div class="relative w-full max-w-7xl mx-auto px-8 flex flex-col justify-center hero-inner" style="z-index:10;">

      <!-- 品牌色小标签 -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <div class="brand-dot"></div>
        <span class="text-micro" style="color:var(--brand-blue-400);letter-spacing:0.3em;">{{ lang === 'zh' ? 'AI 驱动科研平台' : 'AI-POWERED RESEARCH PLATFORM' }}</span>
      </div>

      <!-- zero2x 主logo文字 + 仅作用于 logo 范围的扫描高光 -->
      <div class="zero2x-wrapper" style="margin-bottom:12px;">
        <div class="zero2x-fill"></div>
        <span class="zero2x-text">zero2x</span>
        <!-- 细扫描线在字形之上（非整块背景渐变） -->
        <div class="zero2x-scan-line" aria-hidden="true" />
      </div>

      <!-- 中英文 tagline -->
      <div class="hero-taglines">
        <p class="tagline-primary">{{ t('hero.tagline') }}</p>
        <p class="tagline-secondary">{{ t('hero.tagline2') }}</p>
      </div>

      <!-- 品牌色数据指标（磨砂底避免与矩阵糊在一起） -->
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-val">200<span style="color:var(--brand-blue-400);">+</span></span>
          <span class="hero-stat-label">{{ lang === 'zh' ? 'AI 工具' : 'AI TOOLS' }}</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-val">4<span style="color:var(--brand-blue-400);">×</span></span>
          <span class="hero-stat-label">{{ lang === 'zh' ? '科研加速' : 'RESEARCH SPEED' }}</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-val">021</span>
          <span class="hero-stat-label">{{ lang === 'zh' ? '科学基础模型' : 'SCIENCE MODEL' }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import CharacterGrid from '../../components/CharacterGrid.vue';
import { langStore, t } from '../../lang/index';

export default Vue.extend({
  name: 'HomeZero2x',
  components: { CharacterGrid },
  computed: {
    lang() { return langStore.lang; },
  },
  methods: {
    t(key: string) { return t(key); },
  },
});
</script>

<style scoped>
.hero-section {
  background: #0a0c10;
  /* 「zero2x 理念」区块高度约 400px */
  min-height: 400px;
  max-height: min(520px, 72vh);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hero-inner {
  padding-top: 28px;
  padding-bottom: 32px;
  flex: 1;
  justify-content: center;
}

.hero-gradient-veil {
  background: linear-gradient(
    135deg,
    rgba(5, 12, 26, 0.92) 0%,
    rgba(10, 18, 46, 0.84) 48%,
    rgba(5, 12, 26, 0.93) 100%
  );
}

/* zero2x 反色 wrapper — 宽度紧贴文字，不撑满 */
.zero2x-wrapper {
  position: relative;
  display: inline-block;
  overflow: hidden;
  cursor: crosshair;
  line-height: 1;
  width: fit-content;
  align-self: flex-start;
  isolation: isolate;
}

/* 背景填充层：从底部上滑（默认完全藏在下方，避免底部露出一像素蓝边） */
.zero2x-fill {
  position: absolute;
  inset: 0;
  background: #2E4FFF;
  transform: translateY(calc(100% + 3px));
  transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.zero2x-wrapper:hover .zero2x-fill {
  transform: translateY(0);
}

/* 横穿字形的扫描线：品牌蓝（不再用白光芯），叠在字形之上 */
.zero2x-scan-line {
  position: absolute;
  left: -3%;
  width: 106%;
  height: 2px;
  top: -18%;
  z-index: 4;
  pointer-events: none;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(46, 79, 255, 0.15) 10%,
    rgba(74, 104, 255, 0.92) 42%,
    var(--brand-blue-400) 50%,
    rgba(74, 104, 255, 0.92) 58%,
    rgba(46, 79, 255, 0.15) 90%,
    transparent 100%
  );
  box-shadow:
    0 0 10px rgba(46, 79, 255, 0.85),
    0 0 22px rgba(46, 79, 255, 0.5);
  mix-blend-mode: normal;
  opacity: 0.92;
  animation: zero2x-line-sweep 3.2s cubic-bezier(0.42, 0.08, 0.58, 0.92) infinite;
}

@keyframes zero2x-line-sweep {
  0% {
    top: -22%;
    opacity: 0;
  }
  7% {
    opacity: 1;
  }
  93% {
    opacity: 1;
  }
  100% {
    top: 112%;
    opacity: 0;
  }
}

/* zero2x 文字（位于填充之上、扫描线之下） */
.zero2x-text {
  display: inline-block;
  font-size: clamp(38px, 7vw, 96px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  animation: glow-breathe 4s ease-in-out infinite;
  line-height: 1;
  white-space: nowrap;
  position: relative;
  z-index: 2;
  padding: 0 8px;
  transition: color 500ms ease, text-shadow 500ms ease;
}

/* hover 时文字变深色（反色），停止光晕动画 */
.zero2x-wrapper:hover .zero2x-text {
  color: #ffffff;
  animation-play-state: paused;
  text-shadow: none;
}

.hero-taglines {
  max-width: 42rem;
}

.tagline-primary {
  font-size: clamp(17px, 2.1vw, 22px);
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
  line-height: 1.45;
  letter-spacing: -0.01em;
  animation: fade-in-up 0.8s var(--ease-out) 0.3s both;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.55);
}

.tagline-secondary {
  font-size: clamp(14px, 1.85vw, 18px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
  line-height: 1.55;
  font-family: 'JetBrains Mono', monospace;
  animation: fade-in-up 0.8s var(--ease-out) 0.5s both;
  text-shadow:
    0 2px 24px rgba(0, 0, 0, 0.85),
    0 1px 3px rgba(0, 0, 0, 0.9);
}

/* 品牌色数据指标：磨砂底（无描边） */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 22px;
  padding: 14px 22px;
  align-self: flex-start;
  background: rgba(5, 10, 22, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: none;
  border-radius: 6px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.38);
  animation: fade-in-up 0.8s var(--ease-out) 0.7s both;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 28px 0 0;
}

.hero-stat:first-child { padding-left: 0; }

.hero-stat-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(17px, 2.4vw, 24px);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.45);
}

.hero-stat-label {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.35;
}

.hero-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 28px 0 0;
  flex-shrink: 0;
  align-self: stretch;
}
</style>
