<template>
  <span class="split-reveal">
    <template v-for="(token, i) in tokens">
      <span
        :key="tokenKey(i, token)"
        class="sr-word"
      >
        <!-- 扫描色块：background 由 JS 写入，自动继承父级文字颜色 -->
        <span class="sr-block" aria-hidden="true"></span>
        <span class="sr-inner">{{ token }}</span>
      </span>
      <span
        v-if="isWordMode && i < tokens.length - 1"
        :key="'s-' + i"
        class="sr-space"
      >&nbsp;</span>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SplitReveal',
  props: {
    text: { type: String, required: true },
    baseDelay: { type: Number, default: 0 },
    stagger:   { type: Number, default: 70 },
  },
  data() {
    return {
      visible: false,
      _io: null as IntersectionObserver | null,
      _timer: 0 as number | null,
    };
  },
  computed: {
    isWordMode(): boolean {
      return !(/[\u4e00-\u9fff\u3040-\u30ff]/.test(this.text) && !this.text.includes(' '));
    },
    tokens(): string[] {
      if (this.isWordMode) {
        return this.text.split(/\s+/).filter(Boolean);
      }
      // 连续拉丁字母/数字合并为一个 token，避免「AI」与汉字之间出现窄条接缝
      return this.splitCjkWithLatinRuns(this.text);
    },
  },
  watch: {
    visible(val: boolean) {
      if (!val) return;
      this.applyRevealAnimations();
    },
    text() {
      this.resetRevealCycle();
    },
  },
  mounted() {
    this.$nextTick(() => this.beginRevealCycle());
  },
  beforeDestroy() {
    this.teardownObservers();
  },
  methods: {
    /** 中日韩逐字拆分时，将连续 ASCII 字母与数字打成一段，减少字盒边界伪影 */
    splitCjkWithLatinRuns(text: string): string[] {
      const out: string[] = [];
      let latin = '';
      const flush = () => {
        if (latin) {
          out.push(latin);
          latin = '';
        }
      };
      for (const ch of text) {
        if (/[a-zA-Z0-9]/.test(ch)) {
          latin += ch;
        } else {
          flush();
          out.push(ch);
        }
      }
      flush();
      return out;
    },
    tokenKey(i: number, token: string) {
      return `${i}-${token}-${this.text.length}`;
    },
    teardownObservers() {
      if (this._io) {
        this._io.disconnect();
        this._io = null;
      }
      if (this._timer != null) {
        window.clearTimeout(this._timer);
        this._timer = null;
      }
    },
    /** 清除上一轮动画遗留的 inline 样式，避免换文案后透明度卡在 0 */
    clearWordAnimationStyles() {
      const root = this.$el as HTMLElement | undefined;
      if (!root || !root.querySelectorAll) return;
      root.querySelectorAll<HTMLElement>('.sr-word').forEach((word) => {
        const block = word.querySelector<HTMLElement>('.sr-block');
        const inner = word.querySelector<HTMLElement>('.sr-inner');
        if (block) {
          block.style.animationName = '';
          block.style.animationDuration = '';
          block.style.animationTimingFunction = '';
          block.style.animationDelay = '';
          block.style.animationFillMode = '';
          block.style.transform = '';
          block.style.background = '';
        }
        if (inner) {
          inner.style.animationName = '';
          inner.style.animationDuration = '';
          inner.style.animationTimingFunction = '';
          inner.style.animationDelay = '';
          inner.style.animationFillMode = '';
          inner.style.opacity = '';
        }
      });
    },
    applyRevealAnimations() {
      this.$nextTick(() => {
        const words = (this.$el as HTMLElement).querySelectorAll<HTMLElement>('.sr-word');
        const parentColor = getComputedStyle(this.$el as HTMLElement).color || '#ffffff';
        const dur = '0.44s';
        const easing = 'cubic-bezier(0.65,0,0.35,1)';

        words.forEach((word, i) => {
          const delay = this.baseDelay + i * this.stagger;
          const block = word.querySelector<HTMLElement>('.sr-block');
          const inner = word.querySelector<HTMLElement>('.sr-inner');
          if (block) {
            block.style.background = parentColor;
            block.style.animationName = 'sr-sweep';
            block.style.animationDuration = dur;
            block.style.animationTimingFunction = easing;
            block.style.animationDelay = delay + 'ms';
            block.style.animationFillMode = 'both';
          }
          if (inner) {
            inner.style.animationName = 'sr-appear';
            inner.style.animationDuration = dur;
            inner.style.animationTimingFunction = 'linear';
            inner.style.animationDelay = delay + 'ms';
            inner.style.animationFillMode = 'both';
          }
        });
      });
    },
    beginRevealCycle() {
      this.teardownObservers();
      this.visible = false;
      this.$nextTick(() => {
        this.clearWordAnimationStyles();
        const el = this.$el as HTMLElement;
        const rect = el.getBoundingClientRect();
        const inView = rect.bottom > 0 && rect.top < window.innerHeight;

        const trigger = () => {
          this.visible = true;
        };

        if (inView) {
          this._timer = window.setTimeout(trigger, 200);
          return;
        }

        this._io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              this.teardownObservers();
              trigger();
            }
          },
          { threshold: 0.01, rootMargin: '0px 0px -16px 0px' },
        );
        this._io.observe(el);
      });
    },
    /** 文案变更（如中英文切换）：从头再走一遍入屏动画，避免文字停在 opacity:0 */
    resetRevealCycle() {
      this.visible = false;
      this.teardownObservers();
      this.$nextTick(() => {
        this.clearWordAnimationStyles();
        this.beginRevealCycle();
      });
    },
  },
});
</script>

<!-- 全局 @keyframes，不能 scoped，否则 inline animationName 引用不到 -->
<style>
/* 直扫：入 → 覆盖 → 出，无停顿 */
@keyframes sr-sweep {
  0%   { transform: translateX(-101%); opacity: 1; visibility: visible; }
  50%  { transform: translateX(0%);    opacity: 1; visibility: visible; }
  /* 扫出后隐藏色块，避免字盒边缘残留 1px 竖线（尤其拉丁与汉字交界处） */
  100% { transform: translateX(101%);  opacity: 0; visibility: hidden; }
}
/* 文字在色块遮住时显现（50% 时刻），色块退出后随之可见 */
@keyframes sr-appear {
  0%, 44%  { opacity: 0; }
  50%, 100% { opacity: 1; }
}
</style>

<style scoped>
.split-reveal {
  display: inline;
}

.sr-word {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  /* 加大上下留白，防止超大中文字符被 overflow:hidden 裁切 */
  padding-top: 0.06em;
  padding-bottom: 0.18em;
  margin-top: -0.06em; /* 补偿 padding-top 避免行间距增大 */
}

.sr-block {
  position: absolute;
  inset: 0;
  transform: translateX(-101%);
  z-index: 2;
  pointer-events: none;
  display: block;
  visibility: visible;
  backface-visibility: hidden;
}

.sr-inner {
  display: block;
  opacity: 0;
  position: relative;
  z-index: 1;
}

.sr-space {
  display: inline;
}

@media (prefers-reduced-motion: reduce) {
  .sr-block { display: none; }
  .sr-inner { opacity: 1 !important; animation: none !important; }
}
</style>
