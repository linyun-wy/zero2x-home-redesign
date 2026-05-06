<template>
  <section id="section-events" class="contact-section relative overflow-hidden text-white" style="min-height:400px;display:flex;flex-direction:column;">
    <!-- ASCII 颗粒背景（参考 aino.agency 加载字母质感） -->
    <AsciiGrainBackdrop class="absolute inset-0" />

    <div class="absolute inset-0 pointer-events-none grid-lines-dark" style="z-index:1;"></div>
    <!-- 与首屏一致的深蓝氛围罩层，压住对比度便于阅读 -->
    <div class="absolute inset-0 pointer-events-none events-gradient-veil" style="z-index:2;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:80px 40px;position:relative;z-index:10;flex:1;display:flex;flex-direction:column;justify-content:center;">
      <span class="text-micro" style="color:#2e4fff;display:block;margin-bottom:24px;letter-spacing:0.3em;">
        <ScrambleText text="07 / CONNECT" />
      </span>

      <h2 class="events-heading">
        {{ lang === 'zh' ? 'AI赋能创新' : 'POWER INNOVATION WITH AI' }}
      </h2>
      <p class="events-sub">
        {{ lang === 'zh' ? '一站式科研，加速创新进程' : 'ONE-STOP SMART RESEARCH. INNOVATION ACCELERATED.' }}
      </p>

      <div style="margin-top:48px;">
        <button class="contact-btn">
          {{ lang === 'zh' ? '联系我们' : 'CONTACT US' }}
          <span style="margin-left:12px;">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore } from '../../lang/index';
import ScrambleText from '../../components/ScrambleText.vue';
import AsciiGrainBackdrop from '../../components/AsciiGrainBackdrop.vue';

export default Vue.extend({
  name: 'HomeEvents',
  components: { ScrambleText, AsciiGrainBackdrop },
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

.events-heading {
  font-size: clamp(36px, 6vw, 80px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #fff;
  margin: 0 0 20px;
  text-transform: uppercase;
  line-height: 1;
}

.events-sub {
  font-size: 14px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  transition: background 0.25s, color 0.25s;
}

.contact-btn:hover {
  background: #2e4fff;
  color: #fff;
}
</style>
