<template>
  <div class="lab-genos">
    <section class="genos-hero" :style="heroFlowStyle" @mousemove="onHeroMouseMove">
      <div class="genos-hero-blobs" aria-hidden="true">
        <HeroSdfDotMatrix />
      </div>
      <div class="genos-hero-inner">
        <div class="genos-hero-brand">
          <img
            class="genos-hero-logo"
            src="/o2x-lab-logo.png"
            alt="02X Lab"
            width="133"
            height="24"
            loading="eager"
            decoding="async"
          />
          <p class="genos-hero-tagline">{{ t('labPage.heroTagline') }}</p>
        </div>
        <p class="genos-hero-desc">{{ t('labPage.heroDesc') }}</p>
        <div class="genos-actions">
          <button type="button" class="genos-btn genos-btn--cta" @click="scrollToPortalSections">
            {{ lang === 'zh' ? '立即体验' : 'Start now' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="genos-cta-icon">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <div id="portal-lab-sections" class="lab-portal-sections">
      <div class="lab-portal-inner">
        <p class="lab-portal-lead">{{ t('labPage.sectionsLead') }}</p>
        <div class="lab-portal-grid">
          <article class="lab-portal-card">
            <h2 class="lab-portal-card-title">{{ t('labPage.toolsetTitle') }}</h2>
            <p class="lab-portal-card-body">{{ t('labPage.toolsetBody') }}</p>
          </article>
          <article class="lab-portal-card">
            <h2 class="lab-portal-card-title">{{ t('labPage.vibeTitle') }}</h2>
            <p class="lab-portal-card-body">{{ t('labPage.vibeBody') }}</p>
          </article>
          <article class="lab-portal-card">
            <h2 class="lab-portal-card-title">{{ t('labPage.builderTitle') }}</h2>
            <p class="lab-portal-card-body">{{ t('labPage.builderBody') }}</p>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore, t } from '../lang/index';
import HeroSdfDotMatrix from '../components/HeroSdfDotMatrix.vue';

export default Vue.extend({
  name: 'LabGenosView',
  components: { HeroSdfDotMatrix },
  data() {
    return {
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
  },
  methods: {
    t(key: string) {
      return t(key);
    },
    scrollToPortalSections() {
      const el = document.getElementById('portal-lab-sections');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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

.genos-hero-brand {
  margin: 0 0 20px;
  max-width: 760px;
}

.genos-hero-logo {
  display: block;
  width: auto;
  height: auto;
  max-width: min(100%, 300px);
  max-height: 72px;
  object-fit: contain;
  object-position: left center;
}

.genos-hero-tagline {
  margin: 14px 0 0;
  font-size: clamp(17px, 2.2vw, 22px);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: #071942;
  text-align: left;
  font-family: var(--font-display, 'Plus Jakarta Sans', 'Noto Sans SC', sans-serif);
}

.genos-hero-desc {
  margin: 0 0 28px;
  max-width: 760px;
  min-height: 0;
  font-size: clamp(15px, 1.85vw, 19px);
  font-weight: 500;
  line-height: 1.65;
  color: #0a0c10;
  text-align: left;
}

@media (max-width: 640px) {
  .genos-hero-desc {
    min-height: 0;
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
  .genos-hero-brand,
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

/* 页面下方：三大功能（无 Tab） */
.lab-portal-sections {
  scroll-margin-top: 72px;
  background: #fff;
  padding: 64px 24px 100px;
  border-top: 1px solid rgba(7, 25, 66, 0.06);
}

.lab-portal-inner {
  max-width: 1320px;
  margin: 0 auto;
  box-sizing: border-box;
}

.lab-portal-lead {
  margin: 0 0 36px;
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: #071942;
  text-align: center;
}

.lab-portal-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 992px) {
  .lab-portal-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.lab-portal-card {
  margin: 0;
  padding: 28px 24px 32px;
  background: #f8fafd;
  border: 1px solid rgba(46, 79, 255, 0.12);
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.lab-portal-card:hover {
  border-color: rgba(46, 79, 255, 0.28);
  box-shadow: 0 10px 36px rgba(7, 25, 66, 0.06);
}

.lab-portal-card-title {
  margin: 0 0 14px;
  font-size: clamp(17px, 1.5vw, 20px);
  font-weight: 800;
  line-height: 1.3;
  color: #071942;
}

.lab-portal-card-body {
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: #3d3d44;
}
</style>
