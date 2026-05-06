<template>
  <div class="data-portal">
    <section class="data-hero-section relative overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <CharacterGrid subtle />
      </div>

      <div class="relative data-hero__inner" style="z-index: 10">
        <div class="data-hero__main">
          <h1 class="data-hero__title">{{ t('dataPage.title') }}</h1>

          <div class="data-search">
            <div class="data-search__scope">
              <span>{{ t('dataPage.searchScopeAll') }}</span>
              <svg class="data-chevron" width="12" height="12" viewBox="0 0 10 10" aria-hidden="true">
                <path fill="currentColor" d="M5 7.5 L2 3.5 H8 Z" />
              </svg>
            </div>
            <div class="data-search__field">
              <svg class="data-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input v-model="query" type="search" class="data-search__input" :placeholder="t('dataPage.searchPlaceholder')" />
            </div>
            <button type="button" class="data-search__btn">{{ t('dataPage.searchBtn') }}</button>
          </div>

          <div class="data-quick-tags">
            <button v-for="tag in quickTags" :key="tag" type="button" class="data-pill">{{ tag }}</button>
          </div>

          <p class="data-note">{{ t('dataPage.portalNote') }}</p>
        </div>

        <div class="data-hero__spotlights">
          <div class="data-spot data-spot--special">
            <span class="data-spot__badge">{{ t('dataPage.featureSpecial') }}</span>
            <div class="data-spot__body">
              <div class="data-spot__icon" aria-hidden="true">📚</div>
              <div>
                <div class="data-spot__title">{{ t('dataPage.featureLitTitle') }}</div>
                <div class="data-spot__sub">{{ t('dataPage.featureLitSub') }}</div>
              </div>
            </div>
          </div>
          <div class="data-spot data-spot--star">
            <span class="data-spot__badge data-spot__badge--gold">{{ t('dataPage.featureStar') }}</span>
            <div class="data-spot__body">
              <div class="data-spot__icon" aria-hidden="true">🔗</div>
              <div>
                <div class="data-spot__title">{{ t('dataPage.featureKgTitle') }}</div>
                <div class="data-spot__sub">{{ t('dataPage.featureKgSub') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="data-body">
      <aside class="data-aside">
        <div class="data-aside__block">
          <h3 class="data-aside__h"><span class="data-aside__bar" />{{ t('dataPage.sidebarOpenSystems') }}</h3>
          <div class="data-source-chips">
            <span class="data-source-chip">AWS Open Data</span>
            <span class="data-source-chip">Hugging Face</span>
          </div>
        </div>

        <div class="data-aside__block">
          <h3 class="data-aside__h"><span class="data-aside__bar" />{{ t('dataPage.sidebarFields') }}</h3>
          <div class="data-field-group">
            <span class="data-field-label">{{ t('dataPage.sidebarScience') }}</span>
            <div class="data-tag-cloud">
              <button v-for="x in fieldTags.science" :key="x" type="button" class="data-tag">{{ x }}</button>
            </div>
          </div>
          <div class="data-field-group">
            <span class="data-field-label">{{ t('dataPage.sidebarEngineering') }}</span>
            <div class="data-tag-cloud">
              <button v-for="x in fieldTags.engineering" :key="x" type="button" class="data-tag">{{ x }}</button>
            </div>
          </div>
          <div class="data-field-group">
            <span class="data-field-label">{{ t('dataPage.sidebarMore') }}</span>
            <div class="data-tag-cloud">
              <button v-for="x in fieldTags.more" :key="x" type="button" class="data-tag">{{ x }}</button>
            </div>
          </div>
        </div>

        <div class="data-aside__block">
          <h3 class="data-aside__h"><span class="data-aside__bar" />{{ t('dataPage.sidebarTasks') }}</h3>
          <div class="data-tag-cloud">
            <button v-for="x in taskTags" :key="x" type="button" class="data-tag">{{ x }}</button>
          </div>
        </div>

        <div class="data-aside__block">
          <h3 class="data-aside__h"><span class="data-aside__bar" />{{ t('dataPage.sidebarVolume') }}</h3>
          <div class="data-range-row">
            <div class="data-range">
              <label class="data-range__lbl">{{ t('dataPage.unitMin') }}</label>
              <input type="text" class="data-range__input" value="0" />
              <span class="data-range__unit">{{ t('dataPage.volumeUnitKb') }}</span>
            </div>
            <div class="data-range">
              <label class="data-range__lbl">{{ t('dataPage.unitMax') }}</label>
              <input type="text" class="data-range__input" value="∞" />
              <span class="data-range__unit">{{ t('dataPage.volumeUnitKb') }}</span>
            </div>
          </div>
        </div>

        <div class="data-aside__block">
          <h3 class="data-aside__h"><span class="data-aside__bar" />{{ t('dataPage.sidebarType') }}</h3>
          <div class="data-type-dd">{{ t('dataPage.typeText') }}</div>
        </div>
      </aside>

      <section class="data-main">
        <div class="data-main__head">
          <p class="data-main__count">
            <strong>{{ totalCount.toLocaleString() }}</strong>
            {{ datasetsSuffix }}
          </p>
          <div class="data-sort">
            <span class="data-sort__lbl">{{ t('dataPage.resultSort') }}</span>
            <button type="button" class="data-sort__btn">
              {{ t('dataPage.sortCalls') }}
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path fill="currentColor" d="M2 4 L5 7 L8 4 Z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="data-grid">
          <article v-for="item in visibleDatasets" :key="item.id" class="data-card">
            <header class="data-card__head">
              <h2 class="data-card__title">{{ item.title }}</h2>
              <span class="data-card__stars" aria-label="stars">☆ {{ item.stars }}</span>
            </header>
            <div class="data-card__mid">
              <div class="data-card__cube" aria-hidden="true" />
              <div class="data-card__meta">
                <div class="data-card__stats">
                  <span>{{ item.sizeLabel }}</span>
                  <span>{{ item.recordsLabel }}</span>
                </div>
                <div class="data-card__tags">
                  <span v-for="tg in item.tags" :key="tg" class="data-card__pill">{{ tg }}</span>
                </div>
                <p class="data-card__desc">{{ item.desc }}</p>
              </div>
            </div>
            <footer class="data-card__foot">
              <span class="data-card__src"><i class="data-card__dot" />{{ item.source }}</span>
              <span class="data-card__org"><i class="data-card__dot data-card__dot--soft" />{{ item.org }}</span>
            </footer>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CharacterGrid from '../components/CharacterGrid.vue';
import { langStore, t } from '../lang/index';

type Dataset = {
  id: string;
  title: string;
  stars: number;
  sizeLabel: string;
  recordsLabel: string;
  tags: string[];
  desc: string;
  source: string;
  org: string;
};

const DATASET_BASE = [
  { id: '1', title: 'LLaVA-OneVision-1.5-Mid-Training-85M', stars: 0, sizeLabel: '40.72TB', source: 'mvp-lab' },
  { id: '2', title: 'GeoGPT-Benchmark-Weather-10M', stars: 12, sizeLabel: '3.1TB', source: 'geogpt' },
  { id: '3', title: 'OneAstronomy-Spectra-DR2', stars: 4, sizeLabel: '890GB', source: 'oneastronomy' },
  { id: '4', title: 'Genomics-Tokenized-CLR-Subset', stars: 31, sizeLabel: '18.4TB', source: 'genos' },
];

export default Vue.extend({
  name: 'DataResourceView',
  components: { CharacterGrid },
  data() {
    return {
      query: '',
      totalCount: 6318,
      fieldTags: {
        science: ['Math', 'Physics', 'Chemistry', 'Biology', 'Astronomy'],
        engineering: ['CS', 'Materials', 'Energy', 'Environment'],
        more: ['Medicine', 'Agri', 'Ocean', 'AI'],
      },
      taskTags: ['Pre-training', 'SFT', 'RLHF', 'Eval', 'Distillation'],
    };
  },
  computed: {
    lang(): 'zh' | 'en' {
      return langStore.lang;
    },
    quickTags(): string[] {
      return [t('dataPage.tagLlm'), t('dataPage.tagEarth'), t('dataPage.tagBio'), t('dataPage.tagAstro')];
    },
    datasetsSuffix(): string {
      return this.lang === 'zh' ? '个数据集' : 'datasets';
    },
    datasets(): Dataset[] {
      const zh = this.lang === 'zh';
      return DATASET_BASE.map((b) => {
        let recordsLabel = '';
        let tags: string[] = [];
        let desc = '';
        let org = '';
        if (b.id === '1') {
          recordsLabel = zh ? '2.68亿 条' : '268M records';
          tags = [t('dataPage.openCollection'), t('dataPage.tagOss')];
          desc = zh
            ? '多模态中期训练语料与对齐数据，适用于视觉-语言联合建模与指令微调。'
            : 'Mid-training multimodal corpus for vision–language alignment and instruction tuning.';
          org = zh ? '之江实验室' : 'Zhejiang Lab';
        } else if (b.id === '2') {
          recordsLabel = zh ? '1000万 条' : '10M records';
          tags = [t('dataPage.tagEarth'), t('dataPage.openCollection')];
          desc = zh
            ? '全球格点气象与再分析数据切片，用于地球科学基础模型评测。'
            : 'Gridded weather & reanalysis shards for geoscience foundation model benchmarks.';
          org = zh ? '之江实验室' : 'Zhejiang Lab';
        } else if (b.id === '3') {
          recordsLabel = zh ? '220万 条' : '2.2M records';
          tags = [t('dataPage.tagAstro')];
          desc = zh
            ? '仿真与实测光谱融合数据集，支持恒星物理属性反演任务。'
            : 'Blended synthetic & observed spectra for stellar property inference.';
          org = zh ? '国家天文台合作' : 'NAOC collaboration';
        } else {
          recordsLabel = '9.1B tokens';
          tags = [t('dataPage.tagBio')];
          desc = zh
            ? '经 Token 化与清洗的基因组语言建模语料子集。'
            : 'Tokenized, cleaned sequences for genomics language modeling.';
          org = 'Open Consortium';
        }
        return {
          id: b.id,
          title: b.title,
          stars: b.stars,
          sizeLabel: b.sizeLabel,
          recordsLabel,
          tags,
          desc,
          source: b.source,
          org,
        };
      });
    },
    visibleDatasets(): Dataset[] {
      const q = this.query.trim().toLowerCase();
      if (!q) return this.datasets;
      return this.datasets.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.source.toLowerCase().includes(q),
      );
    },
  },
  methods: {
    t,
  },
});
</script>

<style scoped>
.data-portal {
  min-height: calc(100vh - 80px);
  background: var(--bg-page, #f8fafc);
  color: var(--text-primary);
}

/* 浅色渐变首屏（原数据页配色）+ 代码字符矩阵叠层 */
.data-hero-section {
  position: relative;
  height: 400px;
  min-height: 400px;
  max-height: 400px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 42%, #fae8ff 100%);
  border-bottom: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.data-hero__inner {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 40px;
  justify-content: space-between;
}

.data-hero__main {
  min-width: 0;
  flex: 1;
}

.data-hero__title {
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin: 0 0 18px;
  line-height: 1.25;
}

.data-search {
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 32px rgba(46, 79, 255, 0.08);
  overflow: hidden;
  max-width: 720px;
}

.data-search__scope {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  border-right: 1px solid rgba(15, 23, 42, 0.06);
  white-space: nowrap;
}

.data-chevron {
  opacity: 0.45;
}

.data-search__field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  min-width: 0;
}

.data-search__icon {
  flex-shrink: 0;
  color: #94a3b8;
}

.data-search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 12px 0;
  min-width: 0;
  color: #0f172a;
}

.data-search__btn {
  border: none;
  background: #2e4fff;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 0 24px;
  cursor: crosshair;
  transition: background 0.2s;
}

.data-search__btn:hover {
  background: #1d3ae0;
}

.data-quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.data-pill {
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: crosshair;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.data-pill:hover {
  border-color: rgba(46, 79, 255, 0.35);
  color: #2e4fff;
  background: rgba(255, 255, 255, 0.95);
}

.data-note {
  margin: 12px 0 0;
  font-size: 11px;
  color: #64748b;
  max-width: 640px;
  line-height: 1.5;
}

.data-hero__spotlights {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 280px;
  flex-shrink: 0;
}

.data-spot {
  position: relative;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  padding: 18px 18px 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
}

.data-spot__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #2e4fff;
  background: #eef1ff;
  padding: 4px 8px;
  border-radius: 6px;
}

.data-spot__badge--gold {
  color: #b45309;
  background: #fffbeb;
}

.data-spot__body {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding-right: 72px;
}

.data-spot__icon {
  font-size: 1.5rem;
  line-height: 1;
}

.data-spot__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.data-spot__sub {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.data-body {
  max-width: 1320px;
  margin: 0 auto;
  padding: 32px 40px 80px;
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.data-aside {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.data-aside__block {
  background: #fff;
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 18px 16px;
  box-shadow: var(--shadow-card);
}

.data-aside__h {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px;
}

.data-aside__bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: #2e4fff;
  flex-shrink: 0;
}

.data-source-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.data-source-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #475569;
}

.data-field-group {
  margin-bottom: 14px;
}

.data-field-group:last-child {
  margin-bottom: 0;
}

.data-field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.data-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.data-tag {
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #f8fafc;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #475569;
  cursor: crosshair;
}

.data-tag:hover {
  border-color: rgba(46, 79, 255, 0.25);
  color: #2e4fff;
}

.data-range-row {
  display: flex;
  gap: 10px;
}

.data-range {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.data-range__lbl {
  font-size: 11px;
  color: #94a3b8;
}

.data-range__input {
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
}

.data-range__unit {
  font-size: 11px;
  color: #94a3b8;
}

.data-type-dd {
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #334155;
  background: #f8fafc;
}

.data-main {
  flex: 1;
  min-width: 0;
}

.data-main__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.data-main__count {
  margin: 0;
  font-size: 15px;
  color: #475569;
}

.data-main__count strong {
  color: #0f172a;
  font-weight: 800;
}

.data-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}

.data-sort__lbl {
  font-size: 13px;
  color: #64748b;
}

.data-sort__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-default);
  background: #fff;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: crosshair;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.data-card {
  background: #fff;
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 18px 18px 16px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.data-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.data-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}

.data-card__stars {
  flex-shrink: 0;
  font-size: 13px;
  color: #94a3b8;
}

.data-card__mid {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.data-card__cube {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(145deg, #2e4fff 0%, #6366f1 50%, #a5b4fc 100%);
  box-shadow: 0 6px 20px rgba(46, 79, 255, 0.25);
  transform: rotate(-6deg);
  flex-shrink: 0;
}

.data-card__meta {
  flex: 1;
  min-width: 0;
}

.data-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.data-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.data-card__pill {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: #eef1ff;
  color: #2e4fff;
}

.data-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.data-card__foot {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
}

.data-card__src,
.data-card__org {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.data-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2e4fff;
}

.data-card__dot--soft {
  background: #94a3b8;
}

@media (max-width: 1100px) {
  .data-hero-section {
    height: auto;
    min-height: 400px;
    max-height: none;
    padding: 24px 0 28px;
  }

  .data-hero__inner {
    flex-direction: column;
    align-items: stretch;
    padding: 0 24px;
  }

  .data-hero__spotlights {
    width: 100%;
    min-width: 0;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .data-spot {
    flex: 1 1 240px;
  }

  .data-body {
    flex-direction: column;
  }

  .data-aside {
    width: 100%;
  }

  .data-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .data-search {
    flex-direction: column;
    border-radius: 16px;
  }

  .data-search__scope {
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    padding: 12px 20px;
  }

  .data-search__field {
    padding: 0 20px;
  }

  .data-search__btn {
    padding: 14px 20px;
    border-radius: 0 0 16px 16px;
  }
}
</style>
