<template>
  <section style="background:#f4f5f7;position:relative;overflow:hidden;">
    <div class="absolute inset-0 pointer-events-none grid-lines" style="z-index:0;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:64px 40px;position:relative;z-index:1;">

      <div style="margin-bottom:56px;">
        <span class="text-micro" style="color:#2e4fff;display:block;margin-bottom:16px;letter-spacing:0.3em;">
          <ScrambleText text="06 / ACCELERATING_RESEARCH" />
        </span>
        <h2 class="cases-heading">{{ lang === 'zh' ? '加速科研案例' : 'RESEARCH CASES' }}</h2>
      </div>

      <div style="position:relative;min-height:360px;">
        <transition name="slide-case">
          <div
            v-for="(c, i) in cases"
            :key="c.titleZh"
            v-show="currentIndex === i"
            class="case-layout"
          >
            <!-- 文字 -->
            <div class="case-text">
              <span class="text-micro" style="color:rgba(0,0,0,0.35);display:block;margin-bottom:16px;">CASE_{{ String(i+1).padStart(2,'0') }}</span>
              <h3 class="case-title">{{ lang === 'zh' ? c.titleZh : c.titleEn }}</h3>
              <p class="case-desc">{{ lang === 'zh' ? c.descZh : c.descEn }}</p>

              <div class="case-stats">
                <div v-for="(s, si) in c.stats" :key="si" class="stat-block">
                  <div class="stat-val">{{ s.value }}</div>
                  <span class="text-micro" style="color:rgba(0,0,0,0.4);">{{ s.label }}</span>
                </div>
              </div>

              <button class="case-cta">
                {{ lang === 'zh' ? '探索案例细节' : 'EXPLORE CASE' }}
                <span style="margin-left:8px;">→</span>
              </button>
            </div>

            <!-- 图片 -->
            <div class="case-visual">
              <div class="case-frame">
                <div class="case-frame-label text-micro">
                  <span>IMG_{{ String(i+1).padStart(3,'0') }}</span>
                  <span style="color:rgba(0,0,0,0.25);">PREVIEW</span>
                </div>
                <div class="case-frame-inner">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore } from '../../lang/index';
import ScrambleText from '../../components/ScrambleText.vue';

export default Vue.extend({
  name: 'HomeCases',
  components: { ScrambleText },
  data() {
    return {
      currentIndex: 0,
      cases: [
        {
          titleZh: '大数据驱动的造山带结构与地壳生长分析',
          titleEn: 'Big Data–Powered Analysis of Orogenic Architecture and Crustal Growth',
          descZh: '王涛教授与GeoGPT的合作旨在通过构建前沿的大数据平台和人工智能驱动的研究工具，打破这一瓶颈，彻底改变岩浆岩数据的管理与应用模式。',
          descEn: "Professor Wang Tao's collaboration with GeoGPT aims to break this bottleneck by building a cutting-edge big data platform and AI-driven research tools, revolutionizing how igneous rock data is managed.",
          stats: [{ value: '15,202', label: 'Data Points' }, { value: '10×', label: 'Speed Up' }],
        },
        {
          titleZh: '基因组序列的精准变异分析',
          titleEn: 'Accurate Variant Analysis of Genomic Sequences',
          descZh: '通过Genos基础模型，研究团队实现了对海量基因组数据的毫秒级检索与比对，显著提升了致病基因挖掘的准确率。',
          descEn: 'Using the Genos foundation model, the research team achieved millisecond-level retrieval and alignment of massive genomic data, significantly improving the accuracy of pathogenic gene mining.',
          stats: [{ value: '99.8%', label: 'Accuracy' }, { value: '<50ms', label: 'Query Time' }],
        },
      ],
    };
  },
  computed: {
    lang() { return langStore.lang; },
  },
  methods: {
    next() { this.currentIndex = (this.currentIndex + 1) % this.cases.length; },
    prev() { this.currentIndex = (this.currentIndex - 1 + this.cases.length) % this.cases.length; },
  },
});
</script>

<style scoped>
.cases-heading {
  font-size: clamp(30px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0a0c10;
  margin: 0;
  text-transform: uppercase;
  line-height: 1;
}

.nav-arrow {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(0,0,0,0.15);
  background: none;
  cursor: crosshair;
  font-size: 14px;
  color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.nav-arrow:hover { background: #0a0c10; color: #fff; }

.case-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

@media (max-width: 768px) {
  .case-layout { grid-template-columns: 1fr; }
}

.case-title {
  font-size: clamp(20px, 3vw, 32px);
  font-weight: 800;
  color: #0a0c10;
  margin: 0 0 20px;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.case-desc {
  font-size: 14px;
  color: rgba(0,0,0,0.6);
  line-height: 1.75;
  margin: 0 0 32px;
}

.case-stats {
  display: flex;
  gap: 40px;
  padding: 24px 0;
  border-top: 1px solid rgba(0,0,0,0.07);
  border-bottom: 1px solid rgba(0,0,0,0.07);
  margin-bottom: 32px;
}

.stat-block { display: flex; flex-direction: column; gap: 6px; }

.stat-val {
  font-size: 28px;
  font-weight: 900;
  color: var(--brand-blue-600);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.03em;
}

.case-cta {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: none;
  border: 1px solid rgba(0,0,0,0.15);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0a0c10;
  cursor: crosshair;
  transition: background 0.25s, color 0.25s, border-color 0.25s;
}

.case-cta:hover { background: #0a0c10; color: #fff; border-color: #0a0c10; }

.case-visual { height: 100%; }

.case-frame {
  width: 100%;
  aspect-ratio: 4/3;
  border: 1px solid rgba(46, 79, 255, 0.15);
  background: #fff;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.case-frame:hover {
  border-color: var(--brand-blue-300);
  box-shadow: 0 4px 20px rgba(46, 79, 255, 0.08);
}

.case-frame-label {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(0,0,0,0.07);
  color: rgba(0,0,0,0.4);
}

.case-frame-inner {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.02);
}

.slide-case-enter-active, .slide-case-leave-active {
  transition: opacity 0.4s ease;
}
.slide-case-enter, .slide-case-leave-to { opacity: 0; }
</style>
