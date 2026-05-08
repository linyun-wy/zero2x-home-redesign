/**
 * v-reveal — IntersectionObserver 驱动的单次入场动画指令
 *
 * 用法：
 *   v-reveal                                → 默认（从下方 28px 淡入）
 *   v-reveal="120"                          → 延迟 120ms
 *   v-reveal="'fade'"                       → 仅淡入（无位移）
 *   v-reveal="{ delay: 120, dir: 'left' }" → 从左侧淡入，延迟 120ms
 *
 * dir 值：
 *   'up'    (默认) — translateY(+28px) → 0
 *   'left'         — translateX(-24px) → 0
 *   'right'        — translateX(+24px) → 0
 *   'fade'         — 仅 opacity
 */

import Vue from 'vue';

type RevealDir = 'up' | 'left' | 'right' | 'fade';
interface RevealOptions {
  delay?: number;
  dir?: RevealDir;
}

const io: IntersectionObserver | null =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('rv--on');
              io!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
      )
    : null;

Vue.directive('reveal', {
  inserted(el, binding) {
    // 元素在首屏内（页面初始可见区域）时跳过动画，直接可见
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      return; // 不添加隐藏态，保持默认可见
    }

    const raw = binding.value;
    const opts: RevealOptions =
      raw == null
        ? {}
        : typeof raw === 'number'
          ? { delay: raw }
          : typeof raw === 'string'
            ? { dir: raw as RevealDir }
            : (raw as RevealOptions);

    const { delay = 0, dir = 'up' } = opts;

    el.classList.add('rv', `rv--${dir}`);
    if (delay) el.style.setProperty('--rv-delay', `${delay}ms`);
    io?.observe(el);
  },
  unbind(el) {
    io?.unobserve(el);
  },
});
