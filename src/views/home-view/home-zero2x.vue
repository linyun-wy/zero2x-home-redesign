<template>
  <section
    class="hero-section relative text-white"
    :class="{ 'section-out-of-view': !sectionAnimActive }"
  >
    <!-- 背景字符矩阵 -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <CharacterGrid />
    </div>

    <!-- 渐变遮罩 + 网格线 -->
    <div class="absolute inset-0 pointer-events-none grid-lines-dark" style="z-index:1;"></div>

    <MatrixSpectralLayer
      class="absolute inset-0 pointer-events-none"
      style="z-index:2;"
      :paused="!sectionAnimActive"
    />

    <div class="absolute inset-0 pointer-events-none hero-gradient-veil" style="z-index:3;"></div>

    <!-- 内容区域（水平居中） -->
    <div class="relative w-full max-w-7xl mx-auto px-8 flex flex-col items-center justify-center hero-inner" style="z-index:10;">

      <!-- logo 与灯光同宽：光条在字上方留空，梯形光向下渐隐（品牌蓝） -->
      <div class="hero-intro">
        <div class="hero-logo-stack">
          <div class="hero-lamp" aria-hidden="true">
            <div class="hero-lamp__shade-wrap" aria-hidden="true">
              <div class="hero-lamp__shade"></div>
            </div>
            <div class="hero-lamp__beam-shell">
              <div class="hero-lamp__beam"></div>
            </div>
            <div class="hero-lamp__bar-soft"></div>
            <div class="hero-lamp__bar"></div>
          </div>
          <div class="zero2x-wrapper hero-logo-reveal">
            <span class="zero2x-text">zero2x</span>
            <div class="zero2x-scan-line" aria-hidden="true"></div>
          </div>
        </div>
      </div>

      <!-- 中英文 tagline（暂时隐藏）
      <div class="hero-taglines">
        <p class="tagline-primary">{{ t('hero.tagline') }}</p>
        <p class="tagline-secondary">{{ t('hero.tagline2') }}</p>
      </div>
      -->

      <!-- 品牌色数据指标（暂时隐藏）
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
      -->
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import CharacterGrid from '../../components/CharacterGrid.vue';
import MatrixSpectralLayer from '../../components/MatrixSpectralLayer.vue';
import { langStore, t } from '../../lang/index';
import sectionViewportActive from '../../mixins/sectionViewportActive';

export default Vue.extend({
  name: 'HomeZero2x',
  mixins: [sectionViewportActive],
  components: { CharacterGrid, MatrixSpectralLayer },
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
  /* 方案 B：午夜钢蓝竖直渐变，取代纯黑底 */
  background: linear-gradient(180deg, #1b2438 0%, #101620 100%);
  min-height: 430px;
  max-height: min(520px, 72vh);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: visible;
}

/* 区块离屏：暂停无限 CSS 动画（CharacterGrid 自有 IO 停 RAF，彩光在组件内一并暂停） */
.hero-section.section-out-of-view .hero-lamp__beam-shell,
.hero-section.section-out-of-view .hero-lamp__bar-soft,
.hero-section.section-out-of-view .hero-lamp__bar,
.hero-section.section-out-of-view .zero2x-scan-line,
.hero-section.section-out-of-view .zero2x-text {
  animation-play-state: paused !important;
}

.hero-inner {
  padding-top: 28px;
  padding-bottom: 32px;
  flex: 1;
  justify-content: center;
}

.hero-intro {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* 与 zero2x 同宽：灯光锚在字列正上方 */
.hero-logo-stack {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.hero-lamp {
  position: absolute;
  left: 0;
  right: 0;
  /* 光条下缘距文字顶 60px（条高 4px） */
  top: calc(-60px - 4px);
  bottom: auto;
  /* 弥散区约为原先两倍高，便于光束向下延展 */
  height: clamp(11rem, 28vw, 15rem);
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

/* 裁切宽度 = 灯带宽；内层可模糊，外缘被裁成柔和边界（不会像硬方块） */
.hero-lamp__shade-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: clamp(-2.85rem, -7vw, -1.65rem);
  height: clamp(2rem, 6vw, 2.85rem);
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.55) 6%, #000 14%, #000 86%, rgba(0, 0, 0, 0.55) 94%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.55) 6%, #000 14%, #000 86%, rgba(0, 0, 0, 0.55) 94%, transparent 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.hero-lamp__shade {
  position: absolute;
  left: -5%;
  right: -5%;
  top: -18px;
  height: calc(100% + 36px);
  width: auto;
  background:
    radial-gradient(ellipse 125% 95% at 50% 102%, rgba(2, 4, 10, 0.46) 0%, rgba(3, 6, 12, 0.12) 48%, transparent 72%),
    linear-gradient(
      180deg,
      rgba(6, 9, 16, 0) 0%,
      rgba(6, 9, 16, 0.05) 35%,
      rgba(4, 7, 13, 0.16) 62%,
      rgba(3, 5, 11, 0.32) 84%,
      rgba(2, 3, 9, 0.38) 100%
    );
  filter: blur(8px);
  opacity: 0.95;
}

/*
 * 外层：clip + 横向 mask（无 blur，避免 WebKit 上 mask+blur 同元素导致整块不显示）
 * 外壳加宽约 2× logo 宽，clip-path 顶点落在壳内，避免 mask 按窄盒裁掉「外张的底角」
 * 顶边 25%～75% = 中间一半壳宽 = logo 宽；底边 0～100% = 约为顶边两倍
 */
.hero-lamp__beam-shell {
  position: absolute;
  left: -50%;
  right: -50%;
  top: 4px;
  transform-origin: 50% 0%;
  z-index: 0;
  height: calc(100% + clamp(1.35rem, 4.6vw, 2.6rem));
  clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
  /* 两侧更长的渐变带 + 缓坡，腰线光雾更足 */
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.18) 7%,
    rgba(0, 0, 0, 0.48) 15%,
    rgba(0, 0, 0, 0.82) 24%,
    #000 32%,
    #000 68%,
    rgba(0, 0, 0, 0.82) 76%,
    rgba(0, 0, 0, 0.48) 85%,
    rgba(0, 0, 0, 0.18) 93%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.18) 7%,
    rgba(0, 0, 0, 0.48) 15%,
    rgba(0, 0, 0, 0.82) 24%,
    #000 32%,
    #000 68%,
    rgba(0, 0, 0, 0.82) 76%,
    rgba(0, 0, 0, 0.48) 85%,
    rgba(0, 0, 0, 0.18) 93%,
    transparent 100%
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  pointer-events: none;
  animation: hero-lamp-beam-in 1.72s cubic-bezier(0.33, 1, 0.32, 1) 0.22s both;
}

.hero-lamp__beam {
  position: absolute;
  left: -14%;
  right: -14%;
  top: 0;
  height: 100%;
  transform-origin: 50% 0%;
  background: linear-gradient(
    180deg,
    rgb(46, 79, 255) 0%,
    rgba(46, 79, 255, 0.78) 6%,
    rgba(46, 79, 255, 0.42) 28%,
    rgba(46, 79, 255, 0.14) 56%,
    rgba(46, 79, 255, 0) 100%
  );
  filter: blur(22px);
  mix-blend-mode: screen;
}

/* 光晕略收：少往上溢蓝，仍保条两侧晕光 */
.hero-lamp__bar-soft {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 18px;
  transform: translateY(-22%);
  transform-origin: 50% 50%;
  z-index: 0;
  background: var(--brand-blue-600);
  filter: blur(5px);
  mix-blend-mode: screen;
  opacity: 0.78;
  border-radius: 0;
  animation: hero-lamp-bar-soft-in 1.72s cubic-bezier(0.33, 1, 0.32, 1) 0.22s both;
}

/* 纯色荧光条；阴影主要向下，减弱灯带正上方的蓝色光晕 */
.hero-lamp__bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  width: 100%;
  margin: 0 auto;
  z-index: 2;
  transform-origin: center;
  border-radius: 0;
  background: var(--brand-blue-500);
  box-shadow:
    0 2px 10px rgba(46, 79, 255, 0.42),
    0 4px 18px rgba(46, 79, 255, 0.3),
    0 8px 28px rgba(46, 79, 255, 0.18);
  mix-blend-mode: screen;
  animation: hero-lamp-bar-in 1.72s cubic-bezier(0.33, 1, 0.32, 1) 0.22s both;
}

@keyframes hero-lamp-beam-in {
  from {
    opacity: 0;
    /* 顶边与条同宽，自中心线横向拉开；纵向同步延伸 */
    transform: scale(0.004, 0.38);
  }
  18% {
    opacity: 0.45;
  }
  to {
    opacity: 1;
    transform: scale(1, 1);
  }
}

@keyframes hero-lamp-bar-soft-in {
  from {
    opacity: 0.22;
    transform: translateY(-40%) scaleX(0.004);
  }
  18% {
    opacity: 0.55;
  }
  to {
    opacity: 0.95;
    transform: translateY(-40%) scaleX(1);
  }
}

@keyframes hero-lamp-bar-in {
  from {
    opacity: 0.4;
    transform: scaleX(0.004);
  }
  18% {
    opacity: 0.72;
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.hero-logo-reveal {
  animation: hero-logo-reveal 0.8s cubic-bezier(0.42, 0, 0.58, 1) 1.05s both;
}

@keyframes hero-logo-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hero-gradient-veil {
  /* 减薄罩层，让矩阵与彩光更透气（方案 B） */
  background: linear-gradient(
    135deg,
    rgba(5, 12, 26, 0.40) 0%,
    rgba(10, 18, 46, 0.36) 48%,
    rgba(5, 12, 26, 0.40) 100%
  );
}

/* zero2x：宽度紧贴文字；垂向 shadow 需可见，故不用 overflow:hidden 裁切 */
.zero2x-wrapper {
  position: relative;
  display: inline-block;
  overflow: visible;
  line-height: 1;
  width: fit-content;
  isolation: isolate;
  z-index: 1;
}

/* 横穿字形的扫描线：品牌蓝，叠在字形之上；在 logo 入场后再开始循环 */
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
    0 0 8px rgba(46, 79, 255, 0.72),
    0 0 18px rgba(46, 79, 255, 0.42);
  mix-blend-mode: normal;
  opacity: 0.94;
  animation: zero2x-line-sweep 3.2s cubic-bezier(0.42, 0.08, 0.58, 0.92) 1.85s infinite backwards;
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

/* zero2x：375 锚定约 4rem、1920 顶到 6rem，中间随视口宽度线性插值，无 640 断点跳跃 */
.zero2x-text {
  display: inline-block;
  font-size: clamp(
    3.625rem,
    calc(4rem + (100vw - 23.4375rem) * 32 / 1545),
    6rem
  );
  font-weight: 900;
  letter-spacing: -0.045em;
  color: #ffffff;
  font-family: var(--font-display, 'Plus Jakarta Sans', 'Noto Sans SC', sans-serif);
  /* 顶光约 1.94s 收束：阴影略晚起势、更短促渐显；蓝光呼吸再晚半拍 */
  animation:
    zero2x-drop-reveal 0.48s cubic-bezier(0.33, 1, 0.32, 1) 1.72s forwards,
    zero2x-blue-pulse 4s ease-in-out 2.08s infinite;
  line-height: 1;
  white-space: nowrap;
  position: relative;
  z-index: 2;
  padding: 0 8px;
}

@keyframes zero2x-drop-reveal {
  from {
    filter: brightness(1.03) drop-shadow(0 0 0 transparent);
  }
  to {
    filter:
      brightness(1.03)
      drop-shadow(0 4px 6px rgba(0, 0, 0, 0.45))
      drop-shadow(0 10px 16px rgba(0, 0, 0, 0.38))
      drop-shadow(0 18px 28px rgba(0, 0, 0, 0.28))
      drop-shadow(0 26px 44px rgba(0, 0, 0, 0.16));
  }
}

@keyframes zero2x-blue-pulse {
  0%,
  100% {
    text-shadow:
      0 1px 0 rgba(255, 255, 255, 0.1),
      0 8px 26px rgba(46, 79, 255, 0.2),
      0 14px 38px rgba(46, 79, 255, 0.08);
  }
  50% {
    text-shadow:
      0 1px 0 rgba(255, 255, 255, 0.14),
      0 10px 30px rgba(46, 79, 255, 0.32),
      0 18px 44px rgba(46, 79, 255, 0.12);
  }
}

.hero-taglines {
  max-width: 42rem;
  text-align: center;
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
  align-self: center;
  background: rgba(5, 10, 22, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none;
  border-radius: 6px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.38);
  animation: fade-in-up 0.8s var(--ease-out) 0.7s both;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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

/* 移动端/窄视口：布局与内边距；字号由上方全局流体公式连续缩放，不在此处改 font-size */
@media (max-width: 640px) {
  .hero-logo-stack {
    max-width: min(100%, calc(100vw - 16px));
    margin: 0 auto;
  }

  .zero2x-text {
    padding: 0 3px;
  }

  .hero-lamp {
    top: calc(-50px - 4px);
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
  }

  .hero-section {
    min-height: min(560px, 72vh);
    max-height: min(780px, 90vh);
  }

  .hero-inner {
    padding-left: max(12px, env(safe-area-inset-left, 0px));
    padding-right: max(12px, env(safe-area-inset-right, 0px));
    padding-top: 36px;
    padding-bottom: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-lamp__beam-shell,
  .hero-lamp__bar-soft,
  .hero-lamp__bar {
    animation: none !important;
  }

  .hero-lamp__beam-shell {
    opacity: 1 !important;
    transform: scale(1, 1) !important;
  }

  .hero-lamp__bar-soft {
    opacity: 0.95 !important;
    transform: translateY(-40%) scaleX(1) !important;
  }

  .hero-lamp__bar {
    opacity: 1 !important;
    transform: scaleX(1) !important;
  }

  .hero-logo-reveal {
    animation: none !important;
    opacity: 1;
    transform: none;
  }

  .zero2x-scan-line {
    animation-delay: 0.05s !important;
  }

  .zero2x-text {
    animation: none !important;
    filter:
      brightness(1.03)
      drop-shadow(0 4px 6px rgba(0, 0, 0, 0.45))
      drop-shadow(0 12px 20px rgba(0, 0, 0, 0.3)) !important;
    text-shadow:
      0 1px 0 rgba(255, 255, 255, 0.1),
      0 8px 26px rgba(46, 79, 255, 0.22) !important;
  }
}
</style>
