<template>
  <section
    style="background:#f4f5f7;position:relative;overflow:hidden;"
    :class="{ 'section-out-of-view': !sectionAnimActive }"
  >
    <div class="absolute inset-0 pointer-events-none grid-lines" style="z-index:0;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:100px 40px 120px;position:relative;z-index:1;">
      <div class="haina-layout">

        <!-- 左侧 -->
        <div class="haina-left">
          <span class="text-micro haina-kicker">
            <ScrambleText text="04 / DATA_INFRASTRUCTURE" />
          </span>

          <h2 class="haina-heading">
            <template v-if="lang === 'zh'">
              <SplitReveal text="海纳" :base-delay="0" :stagger="70" />
              <br />
              <SplitReveal text="数据枢纽" :base-delay="120" :stagger="70" />
            </template>
            <template v-else>
              <SplitReveal text="Haina" :base-delay="0" :stagger="55" />
              <br />
              <SplitReveal text="Data Nexus" :base-delay="140" :stagger="55" />
            </template>
          </h2>

          <div class="haina-quote" v-reveal="{ delay: 120, dir: 'left' }">
            <div class="quote-bar"></div>
            <p>
              <template v-if="lang === 'zh'">"以模型为核心组织数据，一切数据Token化"</template>
              <template v-else>"Organize data with models at the core, tokenize all data"</template>
            </p>
          </div>
        </div>

        <!-- 右侧 -->
        <div class="haina-right" v-reveal="{ delay: 180, dir: 'right' }">
          <div class="haina-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid rgba(0,0,0,0.07);">
              <span class="text-micro" style="color:#2e4fff;">DATA_FLOW / ACTIVE</span>
              <div style="display:flex;gap:4px;">
                <div class="haina-eq-bar haina-eq-bar--tall"></div>
                <div class="haina-eq-bar haina-eq-bar--mid"></div>
                <div class="haina-eq-bar haina-eq-bar--max"></div>
              </div>
            </div>
            <div class="haina-text">
              <template v-if="lang === 'zh'">
                <p>以支撑021科学基础模型的语料生产为牵引，探索高质量训练数据生产技术架构。</p>
                <p>打造算力、数据、模型三位一体的人工智能开放创新基础设施，为全球科研工作者提供科技公共产品。</p>
              </template>
              <template v-else>
                <p>Taking the production of corpora supporting the 021 Science Foundation Model as the driving force, exploring high-quality training data production architecture.</p>
                <p>Building an open AI innovation infrastructure integrating computing, data and models — providing global researchers with S&T public goods.</p>
              </template>
            </div>
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
import SplitReveal from '../../components/SplitReveal.vue';
import sectionViewportActive from '../../mixins/sectionViewportActive';
export default Vue.extend({
  name: 'HomeHaina',
  mixins: [sectionViewportActive],
  components: { ScrambleText, SplitReveal },
  computed: {
    lang() { return langStore.lang; },
  },
});
</script>

<style scoped>
.haina-kicker {
  color: #2e4fff;
  display: block;
  margin-bottom: 20px;
  letter-spacing: 0.3em;
}

.haina-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

@media (max-width: 900px) {
  .haina-layout { grid-template-columns: 1fr; gap: 48px; }
}

/* 与 home-models 领域科学模型（.domain-heading）同款阶梯字号 */
.haina-heading {
  font-size: clamp(36px, 4.5vw, 60px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0a0c10;
  margin: 0 0 36px;
  line-height: 1.05;
}

@media (max-width: 640px) {
  .haina-heading {
    font-size: clamp(28px, 8.5vw, 44px);
    line-height: 1.08;
    margin-bottom: 24px;
  }
}

.haina-quote {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.quote-bar {
  width: 3px;
  background: #2e4fff;
  flex-shrink: 0;
  border-radius: 2px;
  /* 与右侧引文块同高，避免比单行字明显更长 */
}

.haina-quote p {
  font-size: 18px;
  font-weight: 600;
  color: #0a0c10;
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
}

.haina-card {
  background: #fff;
  border: 1px solid rgba(46, 79, 255, 0.1);
  padding: 40px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s var(--ease-spring);
  position: relative;
  overflow: hidden;
}

/* 品牌色顶边装饰 */
.haina-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, var(--brand-blue-600), var(--brand-blue-300), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.haina-card:hover {
  border-color: var(--brand-blue-300);
  box-shadow: 0 8px 32px rgba(46, 79, 255, 0.08);
  transform: translateY(-4px);
}

.haina-card:hover::before {
  opacity: 1;
}

.haina-text p {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.62);
  line-height: 1.65;
  margin: 0 0 16px;
}

.haina-text p:last-child { margin: 0; }

.haina-eq-bar {
  width: 4px;
  background: #2e4fff;
  animation: bar 1.2s ease-in-out infinite;
  flex-shrink: 0;
}

.haina-eq-bar--tall {
  height: 12px;
}

.haina-eq-bar--mid {
  height: 8px;
  animation-delay: 0.2s;
}

.haina-eq-bar--max {
  height: 16px;
  animation-delay: 0.4s;
}

.section-out-of-view .haina-eq-bar {
  animation-play-state: paused !important;
}

@keyframes bar {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.5); }
}
</style>
