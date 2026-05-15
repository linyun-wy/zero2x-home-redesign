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
    /** 显示位置（与指针分离，形成柔和惯性） */
    let dx = -300;
    let dy = -300;
    let rafId = 0;
    /** 首页整体（.home-container）与视口有交集时才跑跟随 RAF；重新可见后不校正 dx/dy，等下一次 mousemove 再跟手 */
    let homeViewportActive = true;
    let homeIo: IntersectionObserver | null = null;

    const ring = this.$refs.ring as HTMLElement;
    const HALF = 10; // 半径（直径 20px）
    /** 每帧逼近比例：越小越「飘」，越大越贴指针 */
    const SMOOTH = 0.17;
    /** 收敛阈值：小于则对齐并停表，避免空转 RAF */
    const EPS = 0.45;

    const setRingVisible = (on: boolean) => {
      ring.style.opacity = on ? '1' : '0';
    };

    const tick = () => {
      if (!homeViewportActive) {
        rafId = 0;
        return;
      }
      dx += (mx - dx) * SMOOTH;
      dy += (my - dy) * SMOOTH;
      ring.style.transform = `translate3d(${dx - HALF}px, ${dy - HALF}px, 0)`;

      if (Math.hypot(mx - dx, my - dy) > EPS) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
        dx = mx;
        dy = my;
        ring.style.transform = `translate3d(${dx - HALF}px, ${dy - HALF}px, 0)`;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!homeViewportActive) return;
      mx = e.clientX;
      my = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      if (!homeViewportActive) return;
      mx = -400;
      my = -400;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    const bindHomeViewportObserver = () => {
      const rootEl =
        (this.$el as HTMLElement)?.closest?.('.home-container') ??
        document.querySelector('.home-container');
      if (!rootEl || typeof IntersectionObserver === 'undefined') {
        return;
      }
      homeIo = new IntersectionObserver(
        ([e]) => {
          const on = e ? e.isIntersecting : true;
          homeViewportActive = on;
          setRingVisible(on);
          if (!on && rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { root: null, threshold: 0, rootMargin: '72px 0px 72px 0px' },
      );
      homeIo.observe(rootEl);
    };

    this.$nextTick(() => bindHomeViewportObserver());

    (this as any)._cleanup = () => {
      if (homeIo) {
        homeIo.disconnect();
        homeIo = null;
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
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
  backface-visibility: hidden;
  transform: translate3d(-300px, -300px, 0);
}
</style>
