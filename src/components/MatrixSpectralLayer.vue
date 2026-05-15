<template>
  <div
    class="spectral-root"
    :class="{ 'spectral-root--paused': paused }"
    aria-hidden="true"
  >
    <div class="matrix-spectral-hue">
      <div class="matrix-spectral-patch"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

/** 首屏字符区上层彩光：单块居中小范围 + 一次 blur（由 home-zero2x 挂在 z-index:2） */
export default Vue.extend({
  name: 'MatrixSpectralLayer',
  props: {
    /** 与 section 离屏暂停联动 */
    paused: { type: Boolean, default: false },
  },
});
</script>

<style scoped>
.spectral-root {
  pointer-events: none;
}

.spectral-root--paused .matrix-spectral-hue,
.spectral-root--paused .matrix-spectral-patch {
  animation-play-state: paused !important;
}

/* 仅占中段偏上一块区域（略放大一圈便于彩光更出味） */
.matrix-spectral-hue {
  position: absolute;
  left: 50%;
  top: 36%;
  width: min(54vw, 500px);
  height: min(48vw, 400px);
  max-width: min(92vw, 500px);
  transform: translate(-50%, -50%);
  /* 深色首屏：screen 比 soft-light 更「出气」，区域仍局部故 GPU 可接受 */
  mix-blend-mode: screen;
  opacity: 0.86;
  animation: matrix-spectral-hue 24s ease-in-out infinite alternate;
}

.matrix-spectral-patch {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  /* 蓝紫 / 靛青 / cyan，避免品红与红相 */
  background: radial-gradient(
    ellipse 88% 84% at 50% 44%,
    rgba(170, 150, 255, 0.55) 0%,
    rgba(110, 95, 255, 0.48) 22%,
    rgba(70, 110, 255, 0.42) 44%,
    rgba(46, 79, 255, 0.34) 58%,
    rgba(55, 195, 240, 0.3) 72%,
    transparent 82%
  );
  filter: blur(32px);
  animation: matrix-spectral-breathe 18s ease-in-out infinite alternate;
}

/* 小幅度 hue：仅在蓝↔紫附近摆动，不会扫到红色相 */
@keyframes matrix-spectral-hue {
  from {
    filter: hue-rotate(-10deg) saturate(1.03);
  }
  to {
    filter: hue-rotate(18deg) saturate(1.08);
  }
}

@keyframes matrix-spectral-breathe {
  from {
    transform: scale(0.97);
    opacity: 0.92;
  }
  to {
    transform: scale(1.05);
    opacity: 1;
  }
}
</style>
