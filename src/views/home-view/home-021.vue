<template>
  <section style="background:#f9faf9;position:relative;overflow:hidden;">
    <!-- 网格线 -->
    <div class="absolute inset-0 pointer-events-none grid-lines" style="z-index:0;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:96px 40px 112px;position:relative;z-index:1;">
      <div class="lab-layout">

        <!-- 左侧文字 -->
        <div class="lab-text">
          <span class="text-micro lab-kicker">
            <ScrambleText text="02 / AI WORKBENCH" />
          </span>
          <h2 class="lab-heading">
            <SplitReveal :text="t('hero.labTitle')" />
          </h2>

          <p class="lab-desc" v-reveal="{ delay: 100, dir: 'left' }">
            <template v-if="lang === 'zh'">
              02X Lab 是一款面向科研场景的 <strong>AI 驱动一体化科研工作台</strong>，覆盖"提出问题 → 数据获取 → 分析执行 → 报告输出"的科研全流程闭环。
            </template>
            <template v-else>
              02X Lab is an <strong>AI-Powered Workbench for Scientific Research</strong>. It delivers a closed-loop, end-to-end research experience covering Problem Definition → Data Acquisition → Analysis Execution → Report Output.
            </template>
          </p>

          <ul class="lab-list" v-reveal="{ delay: 180, dir: 'left' }">
            <li v-if="lang === 'zh'">
              <span class="list-marker"></span>
              <div><strong>全流程闭环</strong> — 从问题到成果一站直达，无需多工具切换。</div>
            </li>
            <li v-else>
              <span class="list-marker"></span>
              <div><strong>END-TO-END LOOP</strong> — From idea to deliverable in one workbench.</div>
            </li>
            <li v-if="lang === 'zh'">
              <span class="list-marker"></span>
              <div><strong>领域级生态</strong> — 200+ Skill / 200+ MCP / 80+ GIS 工具，开箱即用。</div>
            </li>
            <li v-else>
              <span class="list-marker"></span>
              <div><strong>DOMAIN-NATIVE ECOSYSTEM</strong> — 200+ Skills, 200+ MCPs, 80+ GIS tools out of the box.</div>
            </li>
            <li v-if="lang === 'zh'">
              <span class="list-marker"></span>
              <div><strong>效率倍增</strong> — 复杂研究高保真复现，PPT 与代码一键生成。</div>
            </li>
            <li v-else>
              <span class="list-marker"></span>
              <div><strong>10× PRODUCTIVITY</strong> — High-fidelity reproduction; agents, code, and PPTs in one click.</div>
            </li>
          </ul>

          <button class="lab-cta" v-reveal="{ delay: 260, dir: 'left' }" data-cursor="view">
            {{ lang === 'zh' ? '立即体验' : 'Start now' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:8px;transition:transform 0.2s;">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- 右侧图片占位 -->
        <div class="lab-visual card-hover" v-reveal="{ delay: 160, dir: 'right' }" data-cursor="view">
          <div class="visual-frame">
            <div class="visual-chrome">
              <div class="chrome-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="text-micro" style="color:rgba(0,0,0,0.3);">zero2x_lab.interface</span>
            </div>
            <div class="visual-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
              </svg>
              <span class="text-micro" style="color:rgba(0,0,0,0.2);display:block;margin-top:12px;">INTERFACE PREVIEW</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore, t } from '../../lang/index';
import ScrambleText from '../../components/ScrambleText.vue';
import SplitReveal from '../../components/SplitReveal.vue';
export default Vue.extend({
  name: 'Home021',
  components: { ScrambleText, SplitReveal },
  computed: {
    lang() { return langStore.lang; },
  },
  methods: {
    t(key: string) { return t(key); },
  },
});
</script>

<style scoped>
/* 与 models / haina 等区块的 text-micro 角标一致 */
.lab-kicker {
  display: block;
  margin-bottom: 16px;
  color: #2e4fff;
  letter-spacing: 0.3em;
}

.lab-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

@media (max-width: 900px) {
  .lab-layout { grid-template-columns: 1fr; gap: 48px; }
}

/* 文字区 */
/* 与「科学基础模型」「领域科学模型」.section-heading / .domain-heading 一致 */
.lab-heading {
  font-size: clamp(36px, 4.5vw, 60px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0a0c10;
  margin: 0 0 24px;
  line-height: 1;
}

.lab-desc {
  font-size: 14px;
  line-height: 1.65;
  color: rgba(0, 0, 0, 0.65);
  margin: 0 0 24px;
}

.lab-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lab-list li {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.6;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.list-marker {
  display: inline-block;
  width: 4px;
  height: 4px;
  background: #2e4fff;
  border-radius: 50%;
  margin-top: 7px;
  flex-shrink: 0;
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

/* 视觉区 */
.lab-visual {
  height: 100%;
  min-height: 260px;
}

.visual-frame {
  width: 100%;
  height: 100%;
  min-height: 260px;
  border: 1px solid rgba(46, 79, 255, 0.15);
  display: flex;
  flex-direction: column;
  background: #fff;
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
</style>
