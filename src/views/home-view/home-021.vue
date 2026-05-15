<template>
  <section
    id="section-02x-lab"
    :class="{ 'section-out-of-view': !sectionAnimActive }"
    style="background:#f9faf9;position:relative;overflow:hidden;"
  >
    <div class="absolute inset-0 pointer-events-none grid-lines" style="z-index:0;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:96px 40px 112px;position:relative;z-index:1;">
      <div class="lab-layout">

        <!-- 左列：文案 + CTA（窄屏用 display:contents + order，使按钮落到预览图下方） -->
        <div class="lab-col-left">
          <div class="lab-text">
            <span class="text-micro lab-kicker">
              <ScrambleText text="02 / AI WORKBENCH" />
            </span>

            <div class="lab-title-row" v-reveal="{ delay: 40, dir: 'left' }">
              <img
                class="lab-logo-title"
                src="/o2x-lab-logo.png"
                alt="02X Lab"
                width="5787"
                height="1044"
                loading="lazy"
                decoding="async"
              />
            </div>

            <p class="lab-desc" v-reveal="{ delay: 100, dir: 'left' }">
              <template v-if="lang === 'zh'">
                02X Lab 是以科学家为中心的<strong>AI原生智能体操作平台</strong>，融合算力、模型与智能体，旨在实现多智能体驱动的<strong>自主科学发现循环</strong>，构建开放的全球科学智能生态。
              </template>
              <template v-else>
                02X Lab is a scientist-centric <strong>AI-native agent operating platform</strong> that unifies compute, models, and agents to enable <strong>multi-agent autonomous scientific discovery</strong> and an open global ecosystem for scientific intelligence.
              </template>
            </p>
          </div>

          <button class="lab-cta" v-reveal="{ delay: 200, dir: 'left' }" data-cursor="view">
            {{ lang === 'zh' ? '立即体验' : 'Start now' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:8px;transition:transform 0.2s;">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- 右侧：产品界面预览 -->
        <div class="lab-visual card-hover" v-reveal="{ delay: 160, dir: 'right' }" data-cursor="view">
          <div class="visual-frame">
            <div class="visual-chrome">
              <div class="chrome-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="text-micro visual-chrome-title">02X Lab</span>
            </div>
            <div class="visual-content visual-content--shot">
              <div class="lab-shot-stage">
                <img
                  class="lab-screenshot"
                  src="/02x-lab-app-preview.png"
                  alt="02X Lab"
                  loading="lazy"
                  decoding="async"
                />
              </div>
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
import sectionViewportActive from '../../mixins/sectionViewportActive.js';

export default Vue.extend({
  name: 'Home021',
  mixins: [sectionViewportActive],
  components: { ScrambleText },
  computed: {
    lang() { return langStore.lang; },
  },
});
</script>

<style scoped>
.lab-kicker {
  display: block;
  margin-bottom: 16px;
  color: #2e4fff;
  letter-spacing: 0.3em;
}

.lab-col-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.lab-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
}

@media (max-width: 900px) {
  .lab-layout { grid-template-columns: 1fr; gap: 48px; }
}

/* 375 档及窄屏：单栏时预览在上、CTA 沉底（文案 → 图 → 按钮） */
@media (max-width: 639px) {
  .lab-layout {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .lab-col-left {
    display: contents;
  }

  .lab-text {
    order: 1;
  }

  .lab-visual {
    order: 2;
  }

  .lab-cta {
    order: 3;
    align-self: flex-start;
    margin-top: 4px;
  }
}

/* Logo 行布局与下边距；Logo 显示高度由 .lab-logo-title 控制 */
.lab-title-row {
  margin: 0 0 28px;
}

.lab-logo-title {
  display: block;
  width: auto;
  height: clamp(30px, 8vw, 45px);
  max-width: 100%;
  object-fit: contain;
  object-position: left center;
}

@media (max-width: 480px) {
  .lab-layout .lab-text {
    min-width: 0;
  }

  .lab-kicker {
    margin-bottom: 12px;
  }

  .lab-title-row {
    margin-bottom: 20px;
  }

  .lab-desc {
    max-width: none;
    font-size: 14px;
    line-height: 1.72;
  }
}

.lab-desc {
  font-size: clamp(15px, 1.5vw, 17px);
  line-height: 1.75;
  color: rgba(0, 0, 0, 0.68);
  margin: 0 0 32px;
  max-width: 36rem;
}

.lab-desc :deep(strong) {
  color: #0a0c10;
  font-weight: 700;
}

.lab-cta {
  display: inline-flex;
  align-items: center;
  padding: 14px 32px;
  background: #0a0c10;
  color: #f9faf9;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  cursor: crosshair;
  transition: background 0.25s;
}

.lab-cta:hover {
  background: #2e4fff;
}

.lab-visual {
  width: 100%;
  min-height: 0;
}

.visual-frame {
  width: 100%;
  height: auto;
  min-height: 0;
  border: 1px solid rgba(46, 79, 255, 0.15);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.lab-visual:hover .visual-frame {
  border-color: var(--brand-blue-300);
  box-shadow: 0 0 0 3px var(--brand-blue-100);
}

.visual-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  background: rgba(0, 0, 0, 0.02);
}

.visual-chrome-title {
  color: rgba(0, 0, 0, 0.38);
}

.chrome-dots {
  display: flex;
  gap: 6px;
}

.chrome-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
}

.chrome-dots span:nth-child(1) { background: #ff5f57; }
.chrome-dots span:nth-child(2) { background: #ffbd2e; }
.chrome-dots span:nth-child(3) { background: #28ca41; }

.visual-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.02);
}

.visual-content--shot {
  display: block;
  padding: 0;
  background: #fff;
  min-height: 0;
}

.lab-shot-stage {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: min(70vh, 880px);
  margin: 0;
  overflow: hidden;
  background: #fff;
}

.lab-screenshot {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
</style>
