<template>
  <div class="lab-genos">
    <section class="genos-hero" :style="heroFlowStyle" @mousemove="onHeroMouseMove">
      <div class="genos-hero-blobs" aria-hidden="true">
        <HeroSdfDotMatrix />
      </div>
      <div class="genos-hero-inner">
        <h1 class="genos-hero-title">{{ t('labPage.heroTitle') }}</h1>
        <p class="genos-hero-desc">{{ t('labPage.heroDesc') }}</p>
        <div class="genos-actions">
          <button type="button" class="genos-btn genos-btn--cta" @click="setTab('Vision')">
            {{ lang === 'zh' ? '立即体验' : 'Start now' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="genos-cta-icon">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button type="button" class="genos-btn genos-btn--outline" @click="openMail">
            {{ t('genos.contact') }}
          </button>
        </div>
      </div>
    </section>

    <nav class="genos-nav" aria-label="Genos sections">
      <div class="genos-nav-inner">
        <button
          v-for="item in tabs"
          :key="item"
          type="button"
          class="genos-nav-item"
          :class="{ 'genos-nav-item--active': tab === item }"
          @click="setTab(item)"
        >
          {{ t('genos.' + tabKey(item)) }}
        </button>
      </div>
    </nav>

    <!-- Features -->
    <section v-show="tab === 'Features'" class="genos-panel">
      <h2 class="genos-panel-title">{{ t('genos.featuresTitle') }}</h2>
      <div class="genos-feature-grid">
        <img
          v-for="(src, i) in featureImages"
          :key="i"
          :src="src"
          alt=""
          class="genos-feature-img"
          loading="lazy"
        />
      </div>
    </section>

    <!-- Architecture -->
    <section v-show="tab === 'Architecture'" class="genos-panel genos-panel--split">
      <div class="genos-split-text">
        <h2 class="genos-panel-heading">{{ t('genos.architectureTitle') }}</h2>
        <ul class="genos-list">
          <li>
            <strong>{{ t('genos.architectureOneTitle') }}</strong>
            {{ t('genos.architectureOne') }}
          </li>
          <li>
            <strong>{{ t('genos.architectureTwoTitle') }}</strong>
            {{ t('genos.architectureTwo') }}
          </li>
          <li>
            <strong>{{ t('genos.architectureThreeTitle') }}</strong>
            {{ t('genos.architectureThree') }}
          </li>
        </ul>
      </div>
      <div class="genos-split-media">
        <img class="genos-wire-img" src="/genos/architecture.png" alt="" loading="lazy" />
      </div>
    </section>

    <!-- Benchmarks -->
    <section v-show="tab === 'Benchmarks'" class="genos-panel genos-panel--split">
      <div class="genos-split-text">
        <h2 class="genos-panel-heading">{{ t('genos.benchmarksTitle') }}</h2>
        <ul class="genos-list">
          <li>
            <strong>{{ t('genos.benchmarksOneTitle') }}</strong>
            {{ t('genos.benchmarksOne') }}
            <span class="genos-accent">0.9911</span>
            {{ t('genos.benchmarksOneSum') }}
          </li>
          <li>
            <strong>{{ t('genos.benchmarksTwoTitle') }}</strong>
            {{ t('genos.benchmarksTwo') }}
            <span class="genos-accent">0.9326</span>
            {{ t('genos.benchmarksTwoSum') }}
          </li>
          <li>
            <strong>{{ t('genos.benchmarksThreeTitle') }}</strong>
            {{ t('genos.benchmarksThree') }}
          </li>
        </ul>
      </div>
      <div class="genos-split-media">
        <img class="genos-wire-img" src="/genos/benchmarks.png" alt="" loading="lazy" />
      </div>
    </section>

    <!-- Download / Vision -->
    <section v-show="tab === 'Vision'" class="genos-panel genos-panel--download">
      <div class="genos-download-inner">
        <h2 class="genos-panel-heading">{{ t('genos.modelDownloadTitle') }}</h2>
        <ul class="genos-list genos-list--spaced">
          <li>
            <strong>{{ t('genos.modelDownloadOneTitle') }}</strong>
            {{ t('genos.modelDownloadOne') }}
          </li>
          <li>
            <strong>{{ t('genos.modelDownloadTwoTitle') }}</strong>
            {{ t('genos.modelDownloadTwo') }}
          </li>
          <li>
            <strong>{{ t('genos.modelDownloadThreeTitle') }}</strong>
            {{ t('genos.modelDownloadThree') }}
          </li>
        </ul>
        <p class="genos-mail-line">
          {{ t('genos.modelDownloadEmail') }}
          <button type="button" class="genos-mail-link" @click="copyEmail">genos@zhejianglab.org</button>
          {{ t('genos.modelDownloadEmails') }}
        </p>
        <p class="genos-download-note">{{ t('genos.modelDownloadDes') }}</p>
        <div class="genos-platform-row">
          <a class="genos-platform" href="https://github.com/zhejianglab/Genos" target="_blank" rel="noopener noreferrer">
            <span class="genos-platform-label">GitHub</span>
            <span class="genos-platform-arrow">→</span>
          </a>
          <a
            class="genos-platform"
            href="https://huggingface.co/collections/ZhejiangLab/genos"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="genos-platform-label">Hugging Face</span>
            <span class="genos-platform-arrow">→</span>
          </a>
          <a class="genos-platform" href="https://cloud.stomics.tech/" target="_blank" rel="noopener noreferrer">
            <span class="genos-platform-label">DCS Cloud</span>
            <span class="genos-platform-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore, t } from '../lang/index';
import HeroSdfDotMatrix from '../components/HeroSdfDotMatrix.vue';

type GenosTab = 'Features' | 'Architecture' | 'Benchmarks' | 'Vision';

export default Vue.extend({
  name: 'LabGenosView',
  components: { HeroSdfDotMatrix },
  data() {
    return {
      tab: 'Features' as GenosTab,
      tabs: ['Features', 'Architecture', 'Benchmarks', 'Vision'] as GenosTab[],
      heroReduceMotion: false,
      heroTargetX: 0.82,
      heroTargetY: 0.38,
      heroSmoothX: 0.82,
      heroSmoothY: 0.38,
      heroGlowX: 82,
      heroGlowY: 40,
      heroAccentX: 94,
      heroAccentY: 12,
      heroCoolX: 18,
      heroCoolY: 82,
      heroPurpleX: 26,
      heroPurpleY: 74,
      heroRaf: 0,
    };
  },
  computed: {
    heroFlowStyle(): Record<string, string> {
      return {
        '--hero-glow-x': String(this.heroGlowX),
        '--hero-glow-y': String(this.heroGlowY),
        '--hero-accent-x': String(this.heroAccentX),
        '--hero-accent-y': String(this.heroAccentY),
        '--hero-cool-x': String(this.heroCoolX),
        '--hero-cool-y': String(this.heroCoolY),
        '--hero-purple-x': String(this.heroPurpleX),
        '--hero-purple-y': String(this.heroPurpleY),
      };
    },
    lang() {
      return langStore.lang;
    },
    featureImages(): string[] {
      const zh = ['/genos/featuresx01.png', '/genos/featuresx02.png', '/genos/featuresx03.png', '/genos/featuresx04.png'];
      const en = ['/genos/features1.png', '/genos/features2.png', '/genos/features3.png', '/genos/features4.png'];
      return this.lang === 'zh' ? zh : en;
    },
  },
  methods: {
    t(key: string) {
      return t(key);
    },
    tabKey(tab: GenosTab): string {
      const map: Record<GenosTab, string> = {
        Features: 'features',
        Architecture: 'architecture',
        Benchmarks: 'benchmarks',
        Vision: 'modelDownload',
      };
      return map[tab];
    },
    onHeroMouseMove(ev: MouseEvent) {
      const el = ev.currentTarget as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      this.heroTargetX = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      this.heroTargetY = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
      if (this.heroReduceMotion) {
        const mx = (this.heroTargetX - 0.5) * 18;
        const my = (this.heroTargetY - 0.5) * 12;
        this.heroGlowX = 82 + mx;
        this.heroGlowY = 40 + my;
        this.heroAccentX = 94 + mx * 0.35;
        this.heroAccentY = 12 + my * 0.5;
        this.heroCoolX = 18 - mx * 0.25;
        this.heroCoolY = 82 + my * 0.4;
        this.heroPurpleX = 26 + mx * 0.55;
        this.heroPurpleY = 74 + my * 0.45;
      }
    },
    setTab(tab: GenosTab) {
      this.tab = tab;
    },
    openMail() {
      window.location.href = 'mailto:genos@zhejianglab.org';
    },
    async copyEmail() {
      try {
        await navigator.clipboard.writeText('genos@zhejianglab.org');
      } catch {
        /* ignore */
      }
    },
  },
  mounted() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.heroReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    if (this.heroReduceMotion) return;
    let t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) * 0.00014;
      const fx = Math.sin(t * 0.92) * 2.4;
      const fy = Math.cos(t * 0.68) * 1.7;
      this.heroSmoothX += (this.heroTargetX - this.heroSmoothX) * 0.082;
      this.heroSmoothY += (this.heroTargetY - this.heroSmoothY) * 0.082;
      const mx = (this.heroSmoothX - 0.5) * 17;
      const my = (this.heroSmoothY - 0.5) * 11;
      this.heroGlowX = 82 + mx + fx;
      this.heroGlowY = 40 + my + fy;
      this.heroAccentX = 94 + mx * 0.42 + fx * 0.55;
      this.heroAccentY = 12 + my * 0.55 + fy * 0.45;
      this.heroCoolX = 18 - mx * 0.28 + Math.cos(t * 0.55) * 2.8;
      this.heroCoolY = 82 + my * 0.48 + Math.sin(t * 0.48) * 2.2;
      this.heroPurpleX = 28 + mx * 0.52 + Math.sin(t * 0.4 + 0.8) * 4;
      this.heroPurpleY = 72 + my * 0.5 + Math.cos(t * 0.38) * 3.5;
      this.heroRaf = requestAnimationFrame(loop);
    };
    this.heroRaf = requestAnimationFrame(loop);
  },
  beforeDestroy() {
    if (this.heroRaf) cancelAnimationFrame(this.heroRaf);
  },
});
</script>

<style scoped>
.lab-genos {
  font-family: var(--font-sans, 'Noto Sans SC', sans-serif);
  color: #071942;
  background: #fff;
}

.genos-hero {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 400px;
  max-height: min(520px, 72vh);
  display: flex;
  flex-direction: column;
  --hero-glow-x: 82;
  --hero-glow-y: 40;
  --hero-accent-x: 94;
  --hero-accent-y: 12;
  --hero-cool-x: 18;
  --hero-cool-y: 82;
  --hero-purple-x: 26;
  --hero-purple-y: 74;
  background:
    radial-gradient(ellipse 78% 68% at calc(var(--hero-glow-x) * 1%) calc(var(--hero-glow-y) * 1%), rgba(139, 163, 227, 0.38) 0%, rgba(196, 208, 242, 0.2) 45%, rgba(225, 233, 245, 0) 76%),
    radial-gradient(ellipse 56% 50% at calc(var(--hero-purple-x) * 1%) calc(var(--hero-purple-y) * 1%), rgba(99, 102, 241, 0.14) 0%, rgba(180, 176, 235, 0.08) 48%, rgba(230, 228, 242, 0) 72%),
    radial-gradient(ellipse 62% 56% at calc(var(--hero-accent-x) * 1%) calc(var(--hero-accent-y) * 1%), rgba(34, 211, 238, 0.12) 0%, rgba(200, 234, 246, 0.08) 42%, rgba(225, 233, 245, 0) 68%),
    radial-gradient(ellipse 58% 54% at calc(var(--hero-cool-x) * 1%) calc(var(--hero-cool-y) * 1%), rgba(139, 163, 227, 0.12) 0%, rgba(225, 233, 245, 0) 66%),
    linear-gradient(165deg, #e1e9f5 0%, #e4edf8 38%, #e8e4f3 65%, #ebe7f4 100%);
  background-size: 240% 240%, 220% 220%, 200% 200%, 200% 200%, 100% 100%;
  background-position: 0% 0%, 0% 0%, 100% 0%, 0% 100%, 0% 0%;
  animation: genos-hero-bg 14s ease-in-out infinite alternate;
}

@keyframes genos-hero-bg {
  0%   { background-position: 0% 0%,   18% 12%,   100% 0%,   0% 100%, 0% 0%; }
  50%  { background-position: 35% 25%, 42% 32%,   78% 35%,  12% 78%, 0% 0%; }
  100% { background-position: 65% 45%, 58% 48%,   55% 55%,  22% 68%, 0% 0%; }
}

@media (prefers-reduced-motion: reduce) {
  .genos-hero { animation: none; }
}

.genos-hero-blobs {
  position: absolute;
  top: 0;
  right: 0;
  width: min(92vw, 1180px);
  height: 100%;
  z-index: 0;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    transparent 12%,
    rgba(0, 0, 0, 0.08) 22%,
    rgba(0, 0, 0, 0.45) 38%,
    rgba(0, 0, 0, 0.92) 58%,
    #000 78%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    transparent 12%,
    rgba(0, 0, 0, 0.08) 22%,
    rgba(0, 0, 0, 0.45) 38%,
    rgba(0, 0, 0, 0.92) 58%,
    #000 78%
  );
}

@media (max-width: 900px) {
  .genos-hero-blobs {
    width: 100%;
    height: 52%;
    top: auto;
    bottom: 0;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.2) 18%, rgba(0, 0, 0, 0.88) 48%, #000 72%);
    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.2) 18%, rgba(0, 0, 0, 0.88) 48%, #000 72%);
  }
}

.genos-hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px 40px 32px;
  box-sizing: border-box;
  text-align: left;
}

@media (max-width: 1100px) {
  .genos-hero-inner {
    padding: 28px 24px 32px;
  }
}

.genos-hero-title {
  margin: 0 0 16px;
  max-width: 760px;
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #071942;
  text-align: left;
  font-family: var(--font-display, 'Plus Jakarta Sans', 'Noto Sans SC', sans-serif);
}

.genos-hero-desc {
  margin: 0 0 28px;
  max-width: 760px;
  min-height: calc(1.55em * 5);
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 600;
  line-height: 1.55;
  color: #0a0c10;
  text-align: left;
}

@media (max-width: 640px) {
  .genos-hero-desc {
    min-height: calc(1.55em * 7);
  }
}

.genos-actions {
  display: flex;
  flex-wrap: wrap;
  max-width: 760px;
  gap: 16px 28px;
  justify-content: flex-start;
}

@media (max-width: 1100px) {
  .genos-hero-title,
  .genos-hero-desc,
  .genos-actions {
    max-width: none;
  }
}

.genos-btn {
  min-width: auto;
  height: auto;
  padding: 14px 32px;
  border-radius: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  font-family: inherit;
  cursor: crosshair;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.genos-btn--cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  background: #0a0c10;
  color: #f9faf9;
  text-transform: uppercase;
  transition: background 0.25s;
}

.genos-btn--cta:hover {
  background: #2e4fff;
}

.genos-cta-icon {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.genos-btn--cta:hover .genos-cta-icon {
  transform: translateX(2px);
}

.genos-btn--outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: var(--brand-blue-600, #2e4fff);
  border: 1px solid var(--brand-blue-600, #2e4fff);
}

.genos-btn--outline:hover {
  background: rgba(46, 79, 255, 0.08);
  color: var(--brand-blue-600, #2e4fff);
  border-color: var(--brand-blue-600, #2e4fff);
}

.genos-nav {
  background: #fff;
  box-shadow: 6.86px 2px 10px rgba(7, 16, 48, 0.12);
}

.genos-nav-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  min-height: 48px;
}

@media (max-width: 1100px) {
  .genos-nav-inner {
    padding: 0 24px;
  }
}

.genos-nav-item {
  flex: 1 1 auto;
  min-width: 120px;
  padding: 0 12px;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: #2e2c34;
  cursor: crosshair;
  line-height: 48px;
  position: relative;
  transition: color 0.2s;
}

.genos-nav-item:hover {
  color: #2b59ff;
}

.genos-nav-item--active {
  color: #2b59ff;
}

.genos-nav-item--active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #2b59ff;
}

.genos-panel {
  padding: 72px 24px 100px;
  background: #f8fafd;
}

.genos-panel-title {
  margin: 0 auto 40px;
  max-width: 1100px;
  text-align: center;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.2;
}

.genos-feature-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .genos-feature-grid {
    grid-template-columns: 1fr;
  }
}

.genos-feature-img {
  width: 100%;
  height: auto;
  display: block;
}

.genos-panel--split {
  padding-left: max(24px, calc((100vw - 1200px) / 2 + 24px));
  padding-right: max(24px, calc((100vw - 1200px) / 2 + 24px));
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 48px;
  align-items: center;
}

@media (max-width: 992px) {
  .genos-panel--split {
    grid-template-columns: 1fr;
  }
}

.genos-panel-heading {
  margin: 0 0 24px;
  font-size: clamp(26px, 3.2vw, 40px);
  font-weight: 800;
  line-height: 1.2;
}

.genos-list {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #201f22;
  font-size: 15px;
  line-height: 1.55;
}

.genos-list li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 16px;
}

.genos-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: rgba(7, 25, 66, 0.45);
  font-weight: 700;
}

.genos-list--spaced li {
  margin-bottom: 14px;
}

.genos-accent {
  color: #2b59ff;
  font-weight: 700;
}

.genos-wire-img {
  width: 100%;
  height: auto;
  display: block;
}

.genos-panel--download {
  padding-bottom: 120px;
}

.genos-download-inner {
  max-width: 900px;
  margin: 0 auto;
}

.genos-mail-line {
  margin: 16px 0 12px;
  font-size: 15px;
  line-height: 1.6;
}

.genos-mail-link {
  padding: 0 4px;
  border: none;
  background: none;
  color: #2b59ff;
  font: inherit;
  font-weight: 600;
  cursor: crosshair;
  text-decoration: underline;
}

.genos-download-note {
  margin: 0 0 28px;
  font-size: 14px;
  line-height: 1.65;
  color: #3d3d44;
}

.genos-platform-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.genos-platform {
  flex: 1 1 220px;
  max-width: 320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #071942;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.genos-platform:hover {
  background: linear-gradient(110deg, #598fff 12%, #1d62f1 95%);
  border-color: transparent;
  color: #fff;
  box-shadow: 4px 4px 10px rgba(42, 108, 246, 0.3);
}

.genos-platform-arrow {
  font-weight: 400;
}
</style>
