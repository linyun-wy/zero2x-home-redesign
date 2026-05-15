<template>
  <section
    id="section-models"
    style="background:#fff;position:relative;overflow:hidden;"
    :class="{ 'section-out-of-view': !sectionAnimActive }"
  >
    <div class="absolute inset-0 pointer-events-none grid-lines" style="z-index:0;"></div>
    <!-- 代码片段装饰层：DOM 文本元素，浏览器原生渲染确保清晰；CSS 慢速漂浮，不打断注意力 -->
    <div class="models-code-layer" aria-hidden="true">
      <pre
        v-for="(frag, i) in codeFragments"
        :key="i"
        class="models-code-frag"
        :style="frag.style"
      >{{ frag.text }}</pre>
    </div>

    <div class="models-inner">

      <!-- Section 标题 -->
      <div style="margin-bottom:40px;">
        <span class="text-micro" style="color:#2e4fff;display:block;margin-bottom:16px;letter-spacing:0.3em;">
          <ScrambleText text="03 / SCIENTIFIC_INTELLIGENCE" />
        </span>
        <h2 class="section-heading">
          <SplitReveal :text="lang === 'zh' ? '科学基础模型' : 'Science Foundation Model'" />
        </h2>
      </div>

      <!-- 021 Foundation Model：左侧正文 + 右侧「了解更多」（不占额外一行高度） -->
      <a href="#" class="model-feature-link card-hover" @click.prevent style="margin-bottom:40px;" v-reveal="{ delay: 100 }" data-cursor="view">
        <div class="model-feature-inner">
          <div class="model-feature-main">
            <div class="model-feature-stack">
              <div class="model-feature-head">
                <div class="model-logo-wrap model-logo-wrap--feature-head">
                  <img class="model-logo-img" :src="logo021Foundation" alt="O21" />
                </div>
                <div>
                  <span class="text-micro" style="color:rgba(0,0,0,0.4);display:block;margin-bottom:4px;">FOUNDATION_MODEL</span>
                  <h3 class="model-title">{{ lang === 'zh' ? '021科学基础模型' : '021 Science Foundation Model' }}</h3>
                </div>
              </div>
              <p class="model-desc">
                <template v-if="lang === 'zh'">021科学基础模型是面向全球开源开放的科技公共产品，旨在赋能科学研究、推动科学发现、重塑科研范式。</template>
                <template v-else>The 021 Science Foundation Model, as a globally accessible, open-source S&T public good, is designed to empower scientific research, accelerate discovery, and reshape scientific paradigms.</template>
              </p>
            </div>
          </div>
          <span class="card-cta model-feature-cta">
            {{ t('hero.learnMore') }}
            <span class="card-cta-arrow" aria-hidden="true">→</span>
          </span>
        </div>
      </a>

      <!-- Domain Models 标题：与「03 / …」区块一致，装饰编号在上 -->
      <div class="domain-section-head">
        <span class="text-micro domain-section-kicker">
          <ScrambleText text="03.2 / SPECIALIZED" />
        </span>
        <h3 class="domain-heading">
          <SplitReveal :text="lang === 'zh' ? '领域科学模型' : 'Domain Science Models'" :base-delay="60" />
        </h3>
      </div>

      <!-- Domain Model Cards -->
      <div class="domain-grid">
        <a
          v-for="(model, mi) in models"
          :key="model.key"
          href="#"
          class="domain-card"
          v-reveal="{ delay: mi * 90 + 120 }"
          data-cursor="view"
        >
          <div class="domain-card-brand">
            <span class="text-micro domain-card-tag">{{ model.tag }}</span>
            <div class="model-logo-wrap">
              <img
                class="model-logo-img"
                :class="{
                  'model-logo-img--genos': model.key === 'genos',
                  'model-logo-img--oneporous': model.key === 'oneporous',
                }"
                :src="model.logo"
                :alt="model.name"
              />
            </div>
          </div>
          <p class="card-desc">{{ lang === 'zh' ? model.descCn : model.descEn }}</p>
          <div class="card-footer">
            <span class="card-cta">
              {{ t('hero.learnMore') }}
              <span class="card-cta-arrow" aria-hidden="true">→</span>
            </span>
          </div>
        </a>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore, t } from '../../lang/index';
import ScrambleText from '../../components/ScrambleText.vue';
/** O21 透明字标（Logo_FullColor / mask-group），与下方领域模型共用 `.model-logo-img` 规格 */
import logo021Foundation from '../../assets/models/mask-group.png';
import logoGeoGPT from '../../assets/models/model_1.png';
import logoOneAstronomy from '../../assets/models/model_2.png';
import logoOnePorous from '../../assets/models/model_3.png';
import logoGenos from '../../assets/models/model_4.png';
import SplitReveal from '../../components/SplitReveal.vue';
import sectionViewportActive from '../../mixins/sectionViewportActive';

export default Vue.extend({
  name: 'HomeModels',
  mixins: [sectionViewportActive],
  components: { ScrambleText, SplitReveal },
  computed: {
    lang() { return langStore.lang; },
  },
  created() {
    this.codeFragments = this.buildRandomCodeFragments();
  },
  methods: {
    t(key: string) {
      return t(key);
    },
    /**
     * 装饰代码块：部分集中在两节标题右侧空白带（截图区），其余在左右边列；互不重叠。
     */
    buildRandomCodeFragments(): Array<{ text: string; style: Record<string, string> }> {
      const pct = (n: number) => `${n.toFixed(2)}%`;
      const r = (a: number, b: number) => a + Math.random() * (b - a);

      const makeSlots = (
        vLo: number,
        vHi: number,
        hLo: number,
        hHi: number,
        rowN: number,
        colN: number,
      ): Array<{ h0: number; h1: number; v0: number; v1: number }> => {
        const out: Array<{ h0: number; h1: number; v0: number; v1: number }> = [];
        const vSpan = (vHi - vLo) / rowN;
        const hSpan = (hHi - hLo) / colN;
        for (let ri = 0; ri < rowN; ri++) {
          for (let ci = 0; ci < colN; ci++) {
            const v0 = vLo + ri * vSpan + 0.25;
            const v1 = vLo + (ri + 1) * vSpan - 0.55;
            const h0 = hLo + ci * hSpan + 0.25;
            const h1 = hLo + (ci + 1) * hSpan - 0.45;
            out.push({ h0, h1, v0, v1 });
          }
        }
        return out;
      };

      const shuffleInPlace = <T,>(arr: T[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const t = arr[i];
          arr[i] = arr[j];
          arr[j] = t;
        }
      };

      const allTexts = [
        '#2E4FFF\n021.base\n[sigma_x]',
        'const f =\n  model();\nreturn x;',
        '{ α: 0.001\n  ε: 1e-8\n  β: 0.98 }',
        '0xA3F2C1\n021.model\n[ok]→void',
        'argmax f\n∇θ ≤ 0.01\nlog(P|θ)',
        '[epoch:021]\n>0.92 acc\n<0.08 loss',
        'import {\n  Model\n} from "sci"',
        'n=1_000_000\nΔt = 0.001s\ndataset[*]',
        'θ[i] += η·∇\n[64, 128, 0]\n/* weights */',
        'if (model) {\n  return ✓\n}',
        '#science\n@base_v1\n0x021ABCD',
        'fn(x) → y\n‖∇θ‖ ≤ ε\n∫f(x)dx',
        '[✓] trained\nv1.2.0-beta\n021.run()',
        '0x021\n[β=0.98]\n(n, d, h)',
      ];

      shuffleInPlace(allTexts);

      /** 主标题 +「领域模型」标题一带的右侧留白（约 23%–72% 宽） */
      const titlePool = [
        ...makeSlots(6, 21, 23, 72, 2, 3),
        ...makeSlots(31, 49, 23, 72, 2, 3),
      ];
      shuffleInPlace(titlePool);
      const TITLE_N = 7;
      const titleChosen = titlePool.slice(0, TITLE_N);

      const inTitleCorridor = (cx: number, cy: number) =>
        cx >= 21 &&
        cx <= 74 &&
        ((cy >= 4 && cy <= 24) || (cy >= 28 && cy <= 52));

      const rows = 6;
      const vTop = 5;
      const vBottom = 92;
      const vSpan = (vBottom - vTop) / rows;
      const hBands: [number, number][] = [
        [0.35, 5.2],
        [6, 13.5],
        [86.2, 93.8],
        [94.5, 99.3],
      ];
      const edgePool: Array<{ h0: number; h1: number; v0: number; v1: number }> = [];
      for (let row = 0; row < rows; row++) {
        const v0 = vTop + row * vSpan + 0.35;
        const v1 = vTop + (row + 1) * vSpan - 0.95;
        for (const band of hBands) {
          const slot = { h0: band[0], h1: band[1], v0, v1 };
          const cx = (slot.h0 + slot.h1) / 2;
          const cy = (slot.v0 + slot.v1) / 2;
          if (!inTitleCorridor(cx, cy)) edgePool.push(slot);
        }
      }
      shuffleInPlace(edgePool);
      const EDGE_N = allTexts.length - TITLE_N;
      const edgeChosen = edgePool.slice(0, EDGE_N);

      const chosen = [...titleChosen, ...edgeChosen];
      shuffleInPlace(chosen);

      return chosen.map((slot, i) => {
        const style: Record<string, string> = {
          left: pct(r(slot.h0, slot.h1)),
          top: pct(r(slot.v0, slot.v1)),
        };
        style['--dur'] = `${r(24, 44).toFixed(1)}s`;
        style['--delay'] = `-${r(0, 24).toFixed(1)}s`;
        style['--dist'] = `-${r(14, 32).toFixed(0)}px`;
        return { text: allTexts[i], style };
      });
    },
  },
  data() {
    return {
      logo021Foundation,
      /** 代码片段：由 created() 随机生成位置 */
      codeFragments: [] as Array<{ text: string; style: Record<string, string> }>,
      models: [
        {
          key: 'geogpt',
          name: 'GeoGPT',
          tag: '03.2.1',
          logo: logoGeoGPT,
          descCn: '为支持地球科学研究与应用而开发的专用大语言模型。',
          descEn: "A specialized LLM developed to support geoscientific research and applications.",
        },
        {
          key: 'oneastronomy',
          name: 'OneAstronomy',
          tag: '03.2.2',
          logo: logoOneAstronomy,
          descCn: '面向天文领域的AI模型，支持天文学研究与发现。',
          descEn: 'An astronomy-focused AI model supporting fast research, data analysis, and discovery.',
        },
        {
          key: 'oneporous',
          name: 'OnePorous',
          tag: '03.2.3',
          logo: logoOnePorous,
          descCn: '实现孔结构逆向生成与性能预测，赋能增材制造设计。',
          descEn: 'Enables rapid pore structure generation and performance prediction.',
        },
        {
          key: 'genos',
          name: 'Genos',
          tag: '03.2.4',
          logo: logoGenos,
          descCn: '10B参数级人类基因组基础模型。',
          descEn: 'A 10 Billion-Parameter Human Genome Foundation Model.',
        },
      ],
    };
  },
});
</script>

<style scoped>
#section-models {
  scroll-margin-top: 80px;
}

.models-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 96px 40px 112px;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .models-inner {
    padding: 72px 18px 88px;
  }
}

/* ── 代码片段装饰层 ── */
.models-code-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.models-code-frag {
  position: absolute;
  margin: 0;
  padding: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  font-size: 11px;
  line-height: 1.7;
  font-weight: 400;
  white-space: pre;
  color: rgba(46, 79, 255, 0.13);
  letter-spacing: 0.04em;
  user-select: none;
  animation: models-frag-drift var(--dur, 30s) ease-in-out var(--delay, 0s) infinite alternate;
  will-change: transform;
}

.section-out-of-view .models-code-frag {
  animation-play-state: paused !important;
}

@keyframes models-frag-drift {
  0%   { transform: translateY(0); }
  100% { transform: translateY(var(--dist, -20px)); }
}

@media (prefers-reduced-motion: reduce) {
  .models-code-frag { animation: none; }
}

/* 科学基础模型区块标题；领域科学模型（domain-heading）与之同字号 */
.section-heading {
  font-size: clamp(36px, 4.5vw, 60px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0a0c10;
  margin: 0;
  line-height: 1.05;
}

/* 021 基础模型区块：与 domain-card 一致的 hover（了解更多）与底边渐变条；左侧竖条仅与正文等高 */
.model-feature-link {
  display: flex;
  flex-direction: column;
  padding: 40px;
  border: 1px solid rgba(46, 79, 255, 0.12);
  background: #fff;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: background 0.3s ease, transform 0.3s var(--ease-spring), box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.model-feature-link:hover {
  background: var(--brand-blue-100);
  border-color: rgba(46, 79, 255, 0.22);
}

.model-feature-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 28px;
}

.model-feature-main {
  display: flex;
  gap: 16px;
  flex: 1;
  min-width: 0;
  align-items: flex-start;
  /* 避免正文与右侧绝对定位的「了解更多」重叠 */
  padding-right: clamp(96px, 14vw, 180px);
}

.model-feature-stack {
  flex: 1;
  min-width: 0;
}

.model-feature-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.model-feature-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, var(--brand-blue-600), var(--brand-blue-400));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-spring);
}

.model-feature-link:hover::after {
  transform: scaleX(1);
}

.model-title {
  font-size: 22px;
  font-weight: 800;
  color: #0a0c10;
  margin: 0;
  letter-spacing: -0.02em;
}

.model-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.62);
  line-height: 1.65;
  margin: 0;
  max-width: 800px;
}

.domain-heading {
  font-size: clamp(36px, 4.5vw, 60px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0a0c10;
  margin: 0;
}

.domain-section-head {
  margin-bottom: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  padding-top: 40px;
}

.domain-section-kicker {
  display: block;
  margin-bottom: 16px;
  color: #2e4fff;
  letter-spacing: 0.3em;
}

.domain-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

@media (max-width: 900px) {
  .domain-grid {
    grid-template-columns: 1fr 1fr;
  }

  .domain-card:nth-child(2n) {
    border-right: none;
  }

  .domain-card:nth-child(-n + 2) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
}

/* 极窄屏再单列，避免两列挤扁；375 仍保持 2×2 */
@media (max-width: 360px) {
  .domain-grid {
    grid-template-columns: 1fr;
  }

  .domain-card:nth-child(2n) {
    border-right: none;
  }

  .domain-card:nth-child(-n + 2) {
    border-bottom: none;
  }

  .domain-card {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .domain-card:last-child {
    border-bottom: none;
  }
}

.domain-card {
  padding: 32px 28px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: background 0.3s ease, transform 0.3s var(--ease-spring), box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  background: #ffffff; /* 纯白背景，防止网格线穿透 */
}

.domain-card:hover {
  background: var(--brand-blue-100);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(46, 79, 255, 0.1);
  z-index: 2;
}

.domain-card:last-child {
  border-right: none;
}

.domain-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, var(--brand-blue-600), var(--brand-blue-400));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-spring);
}

.domain-card:hover::after {
  transform: scaleX(1);
}

/* 编号在上、Logo 作为标题；固定 Logo 区高度使下方描述起始位置对齐 */
.domain-card-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  min-height: 84px;
}

.domain-card-tag {
  display: block;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.32);
  letter-spacing: 0.14em;
}

.model-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  /* 抵消各 PNG 留白差异：统一占位，字标垂直居中 */
  min-height: 52px;
  box-sizing: border-box;
}

.model-logo-img {
  height: 40px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;
  display: block;
}

/* Genos 源文件字重偏大，同 40px 仍显突兀，略缩小以与其它三枚对齐 */
.model-logo-img--genos {
  height: 32px;
}

/* OnePorous 源图上方留白较多，字形整体偏上：略下移以对齐邻近 logo 的视觉中线 */
.model-logo-img--oneporous {
  margin-top: 8px;
}

/* 基础模型区块标题行内的 Logo：与 `.model-logo-img` 一致（40px 高），横向字标限制宽度 */
.model-logo-wrap.model-logo-wrap--feature-head {
  width: auto;
  flex-shrink: 0;
  max-width: min(260px, 46vw);
}

.card-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.58);
  line-height: 1.65;
  margin: 0;
  flex: 1;
}

/* 了解更多：默认隐藏，hover 时底部浮现（与原交互一致） */
.card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid transparent;
  min-height: 44px;
  display: flex;
  align-items: flex-end;
}

.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-blue-600);
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
    text-shadow 0.3s;
  text-shadow: 0 0 0 rgba(46, 79, 255, 0);
}

.card-cta-arrow {
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 021 右侧 CTA：须写在通用 .card-cta 之后，避免 translateY(14px) 覆盖纵向居中 */
.model-feature-link .model-feature-cta.card-cta {
  position: absolute;
  right: 0;
  top: 50%;
  display: inline-flex;
  transform: translateY(-50%) translateX(14px);
  opacity: 0;
  pointer-events: none;
}

.model-feature-link:hover .model-feature-cta.card-cta {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
  pointer-events: auto;
  text-shadow: 0 0 24px rgba(46, 79, 255, 0.35);
}

.model-feature-link:hover .model-feature-cta .card-cta-arrow {
  transform: translateX(8px);
}

.model-feature-link:active .model-feature-cta .card-cta-arrow {
  transform: translateX(12px);
}

.domain-card:hover .card-footer .card-cta {
  opacity: 1;
  transform: translateY(0);
  text-shadow: 0 0 24px rgba(46, 79, 255, 0.35);
}

.domain-card:hover .card-footer .card-cta-arrow {
  transform: translateX(8px);
}

.domain-card:hover .card-footer {
  border-top-color: rgba(46, 79, 255, 0.22);
}

.domain-card:active .card-footer .card-cta-arrow {
  transform: translateX(12px);
}

@media (max-width: 640px) {
  .section-heading,
  .domain-heading {
    font-size: clamp(28px, 8.5vw, 44px);
    line-height: 1.08;
  }

  .domain-section-head {
    margin-bottom: 24px;
    padding-top: 32px;
  }

  .model-feature-link {
    padding: 22px 16px;
    margin-bottom: 32px !important;
  }

  .model-feature-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .model-feature-main {
    padding-right: 0;
  }

  .model-feature-head {
    align-items: center;
    margin-bottom: 14px;
    gap: 10px;
  }

  .model-logo-wrap.model-logo-wrap--feature-head {
    max-width: min(160px, 42vw);
    min-height: 0;
  }

  .model-logo-wrap.model-logo-wrap--feature-head .model-logo-img {
    height: clamp(26px, 7vw, 34px);
  }

  .model-title {
    font-size: clamp(17px, 5vw, 20px);
    line-height: 1.28;
    text-wrap: balance;
  }

  .model-desc {
    font-size: 13px;
    line-height: 1.72;
    max-width: none;
  }

  .model-feature-link .model-feature-cta.card-cta {
    position: relative;
    top: auto;
    right: auto;
    transform: none !important;
    opacity: 1;
    pointer-events: none;
    margin-top: 4px;
    align-self: flex-start;
  }

  .domain-card {
    padding: 22px 16px;
    min-width: 0;
  }

  .domain-card-brand {
    min-height: 72px;
    margin-bottom: 14px;
  }

  .card-desc {
    font-size: 13px;
    line-height: 1.65;
  }

  .model-logo-img {
    height: 36px;
  }

  .model-logo-img--genos {
    height: 30px;
  }
}
</style>
