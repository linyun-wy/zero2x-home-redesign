<template>
  <section style="background:#fff;position:relative;overflow:hidden;">
    <div class="absolute inset-0 pointer-events-none grid-lines" style="z-index:0;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:64px 40px;position:relative;z-index:1;">

      <div style="margin-bottom:56px;">
        <span class="text-micro" style="color:#2e4fff;display:block;margin-bottom:16px;letter-spacing:0.3em;">
          <ScrambleText text="05 / PHILOSOPHY" />
        </span>
        <h2 class="values-heading">{{ lang === 'zh' ? 'zero2x 价值' : 'OUR VALUES' }}</h2>
      </div>

      <!-- 三列价值卡片：hover 与首屏一致的深蓝底 + 代码矩阵 -->
      <div class="values-grid">
        <div
          v-for="(v, i) in values"
          :key="i"
          class="value-card"
          :class="{ 'value-card--center': i === 1 }"
        >
          <div class="value-card-matrix-layer" aria-hidden="true">
            <CharacterGrid />
            <div class="value-card-hover-veil"></div>
          </div>
          <div class="value-card-body">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
              <div class="value-icon">
                <span v-html="v.icon"></span>
              </div>
              <span class="text-micro value-card-index">0{{ i + 1 }}</span>
            </div>
            <h3 class="value-title">{{ lang === 'zh' ? v.titleCn : v.titleEn }}</h3>
            <p class="value-desc">{{ lang === 'zh' ? v.descCn : v.descEn }}</p>
            <div class="value-bar"></div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore } from '../../lang/index';
import ScrambleText from '../../components/ScrambleText.vue';
import CharacterGrid from '../../components/CharacterGrid.vue';

export default Vue.extend({
  name: 'HomeNanhu',
  components: { ScrambleText, CharacterGrid },
  computed: {
    lang() { return langStore.lang; },
  },
  data() {
    return {
      values: [
        {
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
          titleCn: 'AI驱动，加速科研进程',
          titleEn: 'AI-DRIVEN RESEARCH',
          descCn: '提供的AI工具与算法能显著加速研究进程。',
          descEn: 'The AI tools and algorithms provided can significantly accelerate your research process.',
        },
        {
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
          titleCn: '促进跨学科合作',
          titleEn: 'INTERDISCIPLINARY COLLABORATION',
          descCn: '提供易于使用的社区与交流空间，与来自不同领域的专家开展合作。',
          descEn: 'An easy-to-use community space for collaboration with experts and researchers from various fields.',
        },
        {
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
          titleCn: '推动开放科学',
          titleEn: 'OPEN SCIENCE',
          descCn: '注重开放科学与资源共享，支持全球研究者交流与分享最新研究成果。',
          descEn: 'Emphasizing open science and resource sharing for global researchers to exchange findings.',
        },
      ],
    };
  },
});
</script>

<style scoped>
.values-heading {
  font-size: clamp(32px, 5vw, 60px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0a0c10;
  margin: 0;
  text-transform: uppercase;
  line-height: 1;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .values-grid { grid-template-columns: 1fr; }
  .value-card--center { transform: none !important; }
}

.value-card {
  padding: 40px 32px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.35s var(--ease-spring),
    box-shadow 0.35s ease;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

/* 与首屏 CharacterGrid + hero-gradient-veil 同系的悬浮层（取代纯色黑底） */
.value-card-matrix-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.value-card-hover-veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  /* 对齐 home-zero2x.vue .hero-gradient-veil */
  background: linear-gradient(
    135deg,
    rgba(5, 12, 26, 0.92) 0%,
    rgba(10, 18, 46, 0.84) 48%,
    rgba(5, 12, 26, 0.93) 100%
  );
  pointer-events: none;
}

.value-card-body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.value-card:hover .value-card-matrix-layer {
  opacity: 1;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(10, 18, 46, 0.28);
  z-index: 2;
}

.value-card:last-child { border-right: none; }

.value-card--center {
  background: var(--brand-blue-100);
  border-right-color: rgba(46, 79, 255, 0.15);
}

.value-card:hover .value-title { color: #fff; }
.value-card:hover .value-desc { color: rgba(255, 255, 255, 0.58); }
.value-card:hover .value-icon {
  color: #7cb3ff;
  border-color: rgba(46, 79, 255, 0.55);
  background: rgba(46, 79, 255, 0.12);
}
.value-card:hover .value-bar { background: var(--brand-blue-400); width: 100%; }

.value-card-index {
  color: rgba(0, 0, 0, 0.3);
  transition: color 0.3s ease;
}

.value-card:hover .value-card-index {
  color: rgba(255, 255, 255, 0.35);
}

.value-icon {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.5);
  transition: color 0.3s, border-color 0.3s;
}

.value-title {
  font-size: 18px;
  font-weight: 800;
  color: #0a0c10;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  transition: color 0.3s;
  line-height: 1.3;
}

.value-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.58);
  line-height: 1.65;
  margin: 0;
  flex: 1;
  transition: color 0.3s;
}

.value-bar {
  height: 2px;
  background: var(--brand-blue-200);
  margin-top: 32px;
  width: 40%;
  transition: width 0.5s var(--ease-spring), background 0.3s;
}

/* 中间卡片的蓝色进度条默认更宽 */
.value-card--center .value-bar {
  background: var(--brand-blue-400);
  width: 70%;
}
</style>
