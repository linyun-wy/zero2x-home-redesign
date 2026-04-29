<template>
  <header class="site-header">
    <div class="header-inner">

      <!-- 左侧 Logo -->
      <a href="/" class="logo-block">
        <div class="logo-mark">Z</div>
        <div class="logo-text-group">
          <span class="logo-name">zero2x</span>
          <span class="logo-sub text-micro" style="color:rgba(0,0,0,0.35);">Scientific Research Lab</span>
        </div>
      </a>

      <!-- 中央导航（格子样式 + Scramble 效果） -->
      <nav class="main-nav">
        <a
          v-for="item in navItems"
          :key="item.key"
          href="javascript:void(0);"
          class="nav-cell"
          :class="{ active: activeNav === item.key }"
          @click="activeNav = item.key"
        >
          {{ t('nav.' + item.key) }}
        </a>
      </nav>

      <!-- 右侧操作区 -->
      <div class="right-area">
        <!-- UTC 时间 -->
        <div class="meta-block">
          <span class="text-micro" style="color:rgba(0,0,0,0.3);">UTC+8 / {{ utcTime }}</span>
        </div>
        <!-- 版本号 -->
        <div class="meta-block" style="border-right:none;">
          <span class="text-micro" style="color:rgba(0,0,0,0.25);">v2.1.0</span>
        </div>
        <!-- 语言切换 -->
        <button class="action-cell lang-btn" @click="handleLangSwitch" :title="lang === 'zh' ? '切换英文' : 'Switch to Chinese'">
          <span class="text-micro">{{ lang === 'zh' ? 'EN' : '中文' }}</span>
        </button>
        <!-- 登录 -->
        <button class="action-cell" title="登录">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>

      <!-- 移动端汉堡按钮 -->
      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div v-if="mobileOpen" class="mobile-menu">
      <a
        v-for="item in navItems"
        :key="item.key"
        href="javascript:void(0);"
        class="mobile-cell"
        @click="activeNav = item.key; mobileOpen = false"
      >
        {{ t('nav.' + item.key) }}
      </a>
      <div class="mobile-cell" style="color:#2e4fff;" @click="handleLangSwitch">
        {{ lang === 'zh' ? 'Switch to English' : '切换到中文' }}
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore, toggleLang, t } from '../../../lang/index';
import ScrambleText from '../../ScrambleText.vue';

export default Vue.extend({
  name: 'CommonHeader',
  components: { ScrambleText },
  data() {
    return {
      activeNav: 'home',
      mobileOpen: false,
      utcTime: '',
      timer: null as any,
      navItems: [
        { key: 'home' },
        { key: 'products' },
        { key: 'resource' },
        { key: 'cases' },
        { key: 'news' },
        { key: 'events' },
      ],
    };
  },
  computed: {
    lang() {
      return langStore.lang;
    },
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    t(key: string) {
      return t(key);
    },
    handleLangSwitch() {
      toggleLang();
    },
    updateTime() {
      const now = new Date();
      this.utcTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },
  },
});
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background: rgba(249, 250, 249, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
}

.header-inner {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0;
  position: relative; /* 支持 nav 绝对居中 */
}

/* ── Logo ── */
.logo-block {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 0 28px;
  height: 80px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  transition: background 0.25s;
  position: relative;
  z-index: 2; /* 确保在绝对定位的 nav 之上 */
}

.logo-block:hover {
  background: rgba(0, 0, 0, 0.03);
}

.logo-mark {
  width: 28px;
  height: 28px;
  background: var(--brand-blue-600, #2E4FFF);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.25s ease;
}

.logo-block:hover .logo-mark {
  background: var(--brand-blue-700, #2441E0);
}

.logo-text-group {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0a0c10;
  line-height: 1.2;
}

.logo-sub {
  color: rgba(0, 0, 0, 0.35);
  line-height: 1.2;
}

/* ── Main Nav：绝对居中 ── */
.main-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  height: 80px;
  z-index: 1;
  /* 两侧加外边框形成整体边框感 */
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.nav-cell {
  display: inline-flex;
  align-items: center;
  height: 80px;
  padding: 0 28px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  text-decoration: none;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: background 0.25s ease, color 0.25s ease;
  white-space: nowrap;
  position: relative;
}

.nav-cell::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #2e4fff;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-cell:hover {
  background: #0a0c10;
  color: #f9faf9;
}

.nav-cell:hover::after {
  transform: scaleX(0); /* 深色背景时隐藏下划线 */
}

.nav-cell:last-child {
  border-right: none;
}

.nav-cell.active {
  color: var(--brand-blue-600, #2e4fff);
  font-weight: 600;
  background: var(--brand-blue-100, #EEF1FF);
}

.nav-cell.active::after {
  transform: scaleX(1);
}

/* 品牌色 hover 状态 */
.nav-cell:not(.active):hover {
  background: #0a0c10;
  color: #ffffff;
}

/* ── Right Area ── */
.right-area {
  display: flex;
  align-items: center;
  height: 80px;
  margin-left: auto;
  position: relative;
  z-index: 2; /* 确保在 nav 之上 */
}

.meta-block {
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.action-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 0 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  background: none;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.55);
  transition: background 0.25s, color 0.25s;
  cursor: crosshair;
  white-space: nowrap;
}

.action-cell:hover {
  background: #0a0c10;
  color: #f9faf9;
}

.lang-btn .text-micro {
  font-size: 11px;
  font-weight: 600;
}

/* ── Mobile ── */
.mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 80px;
  background: none;
  border: none;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  color: #333;
  cursor: crosshair;
  margin-left: auto;
}

.mobile-menu {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #f9faf9;
}

.mobile-cell {
  display: block;
  padding: 16px 28px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background 0.2s;
  cursor: crosshair;
}

.mobile-cell:hover {
  background: rgba(0, 0, 0, 0.03);
}

@media (max-width: 1100px) {
  .main-nav { display: none; }
  .right-area { display: none; }
  .mobile-toggle { display: flex; }
}
</style>
