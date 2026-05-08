<template>
  <section id="section-events" class="contact-section relative overflow-hidden text-white" style="min-height:560px;display:flex;flex-direction:column;">
    <!-- ASCII 颗粒背景（参考 aino.agency 加载字母质感） -->
    <AsciiGrainBackdrop class="absolute inset-0" />

    <div class="absolute inset-0 pointer-events-none grid-lines-dark" style="z-index:1;"></div>
    <!-- 与首屏一致的深蓝氛围罩层，压住对比度便于阅读 -->
    <div class="absolute inset-0 pointer-events-none events-gradient-veil" style="z-index:2;"></div>

    <div class="events-inner-wrap" style="max-width:1320px;margin:0 auto;padding:100px 40px;position:relative;z-index:10;flex:1;display:flex;flex-direction:column;justify-content:center;">
      <div class="events-inner">
        <span class="text-micro events-kicker">
          <ScrambleText text="07 / CONNECT" />
        </span>

        <h2 class="events-heading" :class="{ 'events-heading--en': lang !== 'zh' }">
          <SplitReveal
            :text="lang === 'zh' ? 'AI赋能创新' : 'POWER INNOVATION WITH AI'"
            :stagger="100"
          />
        </h2>
        <p
          class="events-sub"
          :class="lang === 'zh' ? 'events-sub--zh' : 'events-sub--en'"
          v-reveal="{ delay: 140, dir: 'fade' }"
        >
          {{ lang === 'zh' ? '一站式科研，加速创新进程' : 'ONE-STOP SMART RESEARCH. INNOVATION ACCELERATED.' }}
        </p>

        <div class="events-cta-wrap" v-reveal="{ delay: 280, dir: 'fade' }">
          <a
            class="contact-btn"
            href="mailto:support-zero2x@zhejianglab.org"
            data-cursor="view"
          >
            {{ lang === 'zh' ? '联系我们' : 'CONTACT US' }}
            <span style="margin-left:12px;">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore } from '../../lang/index';
import ScrambleText from '../../components/ScrambleText.vue';
import AsciiGrainBackdrop from '../../components/AsciiGrainBackdrop.vue';
import SplitReveal from '../../components/SplitReveal.vue';

export default Vue.extend({
  name: 'HomeEvents',
  components: { ScrambleText, AsciiGrainBackdrop, SplitReveal },
  computed: {
    lang() { return langStore.lang; },
  },
});
</script>

<style scoped>
.contact-section {
  background: #0a0c10;
}

.events-gradient-veil {
  background: linear-gradient(
    135deg,
    rgba(5, 12, 26, 0.88) 0%,
    rgba(10, 18, 46, 0.72) 48%,
    rgba(5, 12, 26, 0.9) 100%
  );
}

.events-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.events-kicker {
  color: #2e4fff;
  display: block;
  margin-bottom: 16px;
  letter-spacing: 0.3em;
}

/* 与 models 区块主标题 .section-heading / .domain-heading 同档 */
.events-heading {
  font-size: clamp(36px, 4.5vw, 60px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 20px;
  line-height: 1.08;
  width: 100%;
  text-transform: none;
}

/* 英文文案更长，降低字号让视觉体量与中文接近 */
.events-heading--en {
  font-size: clamp(28px, 3.5vw, 48px);
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.events-sub {
  font-size: 18px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.62);
  margin: 0;
  max-width: 720px;
}

.events-sub--zh {
  font-family: inherit;
  letter-spacing: 0.04em;
}

.events-sub--en {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.events-cta-wrap {
  margin-top: 48px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  padding: 18px 48px;
  background: #fff;
  color: #0a0c10;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: crosshair;
  text-decoration: none;
  transition: background 0.25s, color 0.25s;
}

.contact-btn:hover {
  background: #2e4fff;
  color: #fff;
}
</style>
