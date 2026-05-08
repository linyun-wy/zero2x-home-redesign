<template>
  <!-- 保留原生箭头光标，仅叠加一个大圆圈用于 difference 反色效果 -->
  <div ref="ring" class="cc-ring" aria-hidden="true"></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'CustomCursor',
  mounted() {
    let mx = -300;
    let my = -300;
    let dx = -300;
    let dy = -300;
    let rafId = 0;

    const ring = this.$refs.ring as HTMLElement;
    const HALF = 10; // 半径（直径 20px）

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onLeave = () => { mx = -400; my = -400; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    // 圆圈用比较慢的 lerp（0.08）形成明显的拖尾/跟随感
    const tick = () => {
      dx += (mx - dx) * 0.08;
      dy += (my - dy) * 0.08;
      ring.style.transform = `translate(${dx - HALF}px, ${dy - HALF}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    (this as any)._cleanup = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  },
  beforeDestroy() {
    (this as any)._cleanup?.();
  },
});
</script>

<style scoped>
/*
  大白色实心圆，mix-blend-mode: difference。
  效果：
    · 浅色页面背景上 → 圆几乎不可见（白 diff 白 ≈ 0），但经过深色文字时文字反白 —— 即截图所示的"反色感"
    · 深色首屏背景上 → 圆显示为白色实心圆
  Native 箭头光标仍可见（不设 cursor: none）。
*/
.cc-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 99999;
  will-change: transform;
}
</style>
