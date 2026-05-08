<template>
  <header class="site-header">
    <div class="header-inner">

      <!-- 左侧：Logo + 站点（与首页格子线一致） -->
      <div class="header-left">
        <router-link to="/" class="logo-block">
          <span class="nav-logo-wordmark">zero2x</span>
        </router-link>

        <div class="site-slot" ref="siteDropdownRoot">
          <button
            type="button"
            class="hdr-trigger"
            :class="{ 'hdr-trigger--open': siteOpen }"
            :aria-expanded="siteOpen"
            :aria-haspopup="true"
            :aria-label="t('header.siteAria')"
            @click.stop="siteOpen = !siteOpen"
          >
            <span class="hdr-trigger-label">{{ currentSiteLabel }}</span>
            <svg class="hdr-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path fill="currentColor" d="M5 2.5 L8 6 H2 Z" />
            </svg>
          </button>
          <div v-show="siteOpen" class="hdr-panel hdr-panel--site" role="menu" @click.stop>
            <button
              v-for="s in siteOptions"
              :key="s.key"
              type="button"
              class="hdr-item"
              :class="{ 'hdr-item--active': selectedSite === s.key }"
              role="menuitem"
              @click="selectSite(s.key)"
            >
              {{ t(s.labelKey) }}
            </button>
          </div>
        </div>
      </div>

      <!-- 中央导航 -->
      <nav class="main-nav">
        <template v-for="item in navItems">
          <div
            v-if="item.dropdown"
            :key="'dd-' + item.key"
            class="nav-dropdown nav-cell"
            :class="{
              active: activeNav === item.key || navDropdownOpenKey === item.key,
              'nav-dropdown--open': navDropdownOpenKey === item.key,
            }"
            @mouseenter="onNavDropdownEnter(item.key)"
            @mouseleave="onNavDropdownLeave"
          >
            <button
              type="button"
              class="nav-dropdown-btn"
              @click.prevent="activeNav = item.key"
            >
              {{ t('nav.' + item.key) }}
              <svg class="hdr-caret hdr-caret--nav" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path fill="currentColor" d="M5 2.5 L8 6 H2 Z" />
              </svg>
            </button>
            <div v-show="navDropdownOpenKey === item.key" class="hdr-panel hdr-panel--nav">
              <a
                v-for="sub in item.dropdown"
                :key="sub.key"
                href="javascript:void(0);"
                class="hdr-item hdr-item--link"
                :class="{ 'hdr-item--active': isNavSubActive(item.key, sub.key) }"
                @click.prevent="selectNavSub(item.key, sub.key)"
              >
                {{ sub.label }}
              </a>
            </div>
          </div>
          <!-- 普通项 -->
          <a
            v-else
            :key="item.key"
            href="#"
            class="nav-cell"
            :class="{ active: isPlainNavActive(item.key) }"
            @click.prevent="onPlainNav(item)"
          >
            {{ t('nav.' + item.key) }}
          </a>
        </template>
      </nav>

      <!-- 右侧 -->
      <div class="right-area">
        <div class="meta-block">
          <span class="text-micro meta-clock">{{ siteClockOffsetLabel }} / {{ siteLocalTime }}</span>
        </div>
        <button class="action-cell lang-btn" @click="handleLangSwitch" :title="lang === 'zh' ? '切换英文' : 'Switch to Chinese'">
          <span class="text-micro">{{ lang === 'zh' ? 'EN' : '中文' }}</span>
        </button>
        <button class="action-cell" title="登录">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>

      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>

    <div v-if="mobileOpen" class="mobile-menu">
      <div class="mobile-site">
        <span class="mobile-site-title text-micro">{{ t('header.siteAria') }}</span>
        <div class="mobile-site-btns">
          <button
            v-for="s in siteOptions"
            :key="s.key"
            type="button"
            class="mobile-site-btn"
            :class="{ active: selectedSite === s.key }"
            @click="selectSite(s.key)"
          >
            {{ t(s.labelKey) }}
          </button>
        </div>
      </div>

      <template v-for="item in navItems">
        <div v-if="item.dropdown" :key="'m-dd-' + item.key" class="mobile-group">
          <button
            type="button"
            class="mobile-cell mobile-cell--expand"
            @click="mobileExpandedKey = mobileExpandedKey === item.key ? null : item.key"
          >
            {{ t('nav.' + item.key) }}
            <span class="mobile-chevron" :class="{ open: mobileExpandedKey === item.key }">›</span>
          </button>
          <div v-show="mobileExpandedKey === item.key" class="mobile-sub">
            <a
              v-for="sub in item.dropdown"
              :key="sub.key"
              href="javascript:void(0);"
              class="mobile-cell mobile-sub-cell"
              :class="{ active: isNavSubActive(item.key, sub.key) }"
              @click="selectNavSub(item.key, sub.key); mobileOpen = false"
            >
              {{ sub.label }}
            </a>
          </div>
        </div>
        <a
          v-else
          :key="'m-' + item.key"
          href="#"
          class="mobile-cell"
          :class="{ active: isPlainNavActive(item.key) }"
          @click.prevent="onPlainNav(item); mobileOpen = false"
        >
          {{ t('nav.' + item.key) }}
        </a>
      </template>

      <div class="mobile-cell" style="color:#2e4fff;" @click="handleLangSwitch">
        {{ lang === 'zh' ? 'Switch to English' : '切换到中文' }}
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore, toggleLang, t } from '../../../lang/index';

type SiteKey = 'cn' | 'sg' | 'de';

const SITE_STORAGE = 'zero2x-site';

/** 与各站点区域对应的 IANA 时区（用于顶部时钟） */
const SITE_TIMEZONES: Record<SiteKey, string> = {
  cn: 'Asia/Shanghai',
  sg: 'Asia/Singapore',
  de: 'Europe/Berlin',
};

type ModelSubKey = 'm021' | 'geogpt' | 'oneastronomy' | 'genos' | 'oneporous';
type LabSubKey = 'lab02x' | 'oneearth';

interface NavDropdownItem {
  key: string;
  dropdown: { key: string; label: string }[];
}

interface NavLinkItem {
  key: string;
  dropdown?: undefined;
}

export default Vue.extend({
  name: 'CommonHeader',
  data() {
    return {
      activeNav: 'home',
      mobileOpen: false,
      mobileExpandedKey: null as string | null,
      siteLocalTime: '',
      siteClockOffsetLabel: 'UTC+8',
      timer: null as ReturnType<typeof setInterval> | null,
      navDropdownLeaveTimer: null as ReturnType<typeof setTimeout> | null,
      navDropdownOpenKey: null as string | null,
      navItems: [
        { key: 'home' },
        {
          key: 'models',
          dropdown: [
            { key: 'm021', label: '021' },
            { key: 'geogpt', label: 'GeoGPT' },
            { key: 'oneastronomy', label: 'OneAstronomy' },
            { key: 'genos', label: 'Genos' },
            { key: 'oneporous', label: 'OnePorous' },
          ],
        },
        {
          key: 'products',
          dropdown: [
            { key: 'lab02x', label: '02X Lab' },
            { key: 'oneearth', label: 'OneEarth' },
          ],
        },
        { key: 'data' },
        { key: 'cases' },
        { key: 'news' },
        { key: 'events' },
      ] as (NavLinkItem | NavDropdownItem)[],
      selectedSite: 'cn' as SiteKey,
      siteOpen: false,
      activeModelKey: 'geogpt' as ModelSubKey,
      activeLabKey: 'lab02x' as LabSubKey,
      siteOptions: [
        { key: 'cn' as SiteKey, labelKey: 'header.siteChina' },
        { key: 'sg' as SiteKey, labelKey: 'header.siteSingapore' },
        { key: 'de' as SiteKey, labelKey: 'header.siteGermany' },
      ],
    };
  },
  watch: {
    $route: {
      handler() {
        this.syncNavFromRoute();
      },
      immediate: true,
    },
  },
  computed: {
    lang() {
      return langStore.lang;
    },
    currentSiteLabel(): string {
      const map: Record<SiteKey, string> = {
        cn: 'header.siteChina',
        sg: 'header.siteSingapore',
        de: 'header.siteGermany',
      };
      return t(map[this.selectedSite]);
    },
  },
  mounted() {
    try {
      const raw = localStorage.getItem(SITE_STORAGE);
      if (raw === 'cn' || raw === 'sg' || raw === 'de') {
        this.selectedSite = raw;
      }
      const pk =
        localStorage.getItem('zero2x-model') || localStorage.getItem('zero2x-product');
      const modelAllowed: ModelSubKey[] = ['m021', 'geogpt', 'oneastronomy', 'genos', 'oneporous'];
      if (pk && (modelAllowed as string[]).includes(pk)) {
        this.activeModelKey = pk as ModelSubKey;
      }
      const lab = localStorage.getItem('zero2x-lab');
      if (lab === 'lab02x' || lab === 'oneearth') {
        this.activeLabKey = lab as LabSubKey;
      }
    } catch (_) {
      /* ignore */
    }
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
    document.addEventListener('click', this.closeSiteDropdown);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.navDropdownLeaveTimer) clearTimeout(this.navDropdownLeaveTimer);
    document.removeEventListener('click', this.closeSiteDropdown);
  },
  methods: {
    t(key: string) {
      return t(key);
    },
    handleLangSwitch() {
      toggleLang();
    },
    formatUtcOffsetLabel(timeZone: string, date: Date): string {
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone,
          timeZoneName: 'shortOffset',
        }).formatToParts(date);
        let raw = parts.find((p) => p.type === 'timeZoneName')?.value?.trim() ?? '';
        raw = raw.replace(/\u2212/g, '-');
        if (/^GMT/i.test(raw)) return raw.replace(/^GMT/i, 'UTC');
        return raw || 'UTC';
      } catch {
        return 'UTC';
      }
    },
    updateTime() {
      const now = new Date();
      const tz = SITE_TIMEZONES[this.selectedSite];
      this.siteClockOffsetLabel = this.formatUtcOffsetLabel(tz, now);
      this.siteLocalTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
    },
    selectSite(key: SiteKey) {
      this.selectedSite = key;
      this.siteOpen = false;
      this.updateTime();
      try {
        localStorage.setItem(SITE_STORAGE, key);
      } catch (_) {
        /* ignore */
      }
    },
    selectNavSub(navKey: string, subKey: string) {
      if (navKey === 'models') {
        this.activeModelKey = subKey as ModelSubKey;
        this.activeNav = 'models';
        try {
          localStorage.setItem('zero2x-model', subKey);
        } catch (_) {
          /* ignore */
        }
      } else if (navKey === 'products') {
        this.activeLabKey = subKey as LabSubKey;
        this.activeNav = 'products';
        try {
          localStorage.setItem('zero2x-lab', subKey);
        } catch (_) {
          /* ignore */
        }
      }
    },
    isNavSubActive(navKey: string, subKey: string): boolean {
      if (navKey === 'models') return this.activeModelKey === subKey;
      if (navKey === 'products') return this.activeLabKey === subKey;
      return false;
    },
    onNavDropdownEnter(key: string) {
      if (this.navDropdownLeaveTimer) {
        clearTimeout(this.navDropdownLeaveTimer);
        this.navDropdownLeaveTimer = null;
      }
      this.navDropdownOpenKey = key;
    },
    onNavDropdownLeave() {
      this.navDropdownLeaveTimer = setTimeout(() => {
        this.navDropdownOpenKey = null;
      }, 240);
    },
    closeSiteDropdown(e: MouseEvent) {
      const root = this.$refs.siteDropdownRoot as HTMLElement | undefined;
      if (!root || !this.siteOpen) return;
      if (root.contains(e.target as Node)) return;
      this.siteOpen = false;
    },
    isPlainNavActive(key: string): boolean {
      if (key === 'home') {
        return this.$route.path === '/' && !this.$route.hash;
      }
      if (key === 'data') {
        return this.$route.path === '/data';
      }
      return this.activeNav === key;
    },
    onPlainNav(item: NavLinkItem | NavDropdownItem) {
      if ('dropdown' in item && item.dropdown) return;
      const key = item.key;
      this.activeNav = key;
      if (key === 'home') {
        this.$router.push({ path: '/' }).catch(() => {});
      } else if (key === 'data') {
        this.$router.push({ path: '/data' }).catch(() => {});
      } else if (key === 'cases') {
        this.$router.push({ path: '/', hash: '#section-cases' }).catch(() => {});
      } else if (key === 'events') {
        this.$router.push({ path: '/', hash: '#section-events' }).catch(() => {});
      } else if (key === 'news') {
        this.$router.push({ path: '/', hash: '#section-events' }).catch(() => {});
      }
    },
    syncNavFromRoute() {
      const path = this.$route.path;
      const hash = this.$route.hash || '';
      if (path === '/data') {
        this.activeNav = 'data';
        return;
      }
      if (path === '/') {
        if (hash === '#section-cases') this.activeNav = 'cases';
        else if (hash === '#section-events') this.activeNav = 'events';
        else this.activeNav = 'home';
      }
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
  overflow: visible;
}

.header-inner {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0;
  position: relative;
  overflow: visible;
}

/* ── 左侧 Logo + 站点 ── */
.header-left {
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  z-index: 3;
  overflow: visible;
}

.logo-block {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  padding: 0 28px;
  height: 80px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.nav-logo-wordmark {
  font-size: clamp(17px, 1.85vw, 21px);
  font-weight: 900;
  letter-spacing: -0.04em;
  font-family: var(--font-display, 'Space Grotesk', 'Noto Sans SC', sans-serif);
  color: var(--brand-blue-600, #2e4fff);
  line-height: 1;
  white-space: nowrap;
}

.site-slot {
  position: relative;
  display: flex;
  align-items: stretch;
  padding: 0;
  height: 80px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  overflow: visible;
}

.meta-clock {
  color: rgba(0, 0, 0, 0.3);
  font-variant-numeric: tabular-nums;
}

/**
 * 站点触发器：与主导航 `.nav-cell` / `.nav-cell.active` 一致
 * — 默认 500 / 中性色；hover 与「产品」激活态同为整格 80px 高 + brand-blue-100 底 + 品牌蓝字 + 600
 */
.hdr-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  padding: 0 22px;
  margin: 0;
  border-radius: 0;
  border: none;
  box-shadow: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: crosshair;
  transition:
    background 0.25s ease,
    color 0.25s ease;
}

.hdr-trigger:hover,
.hdr-trigger--open {
  background: var(--brand-blue-100, #eef1ff);
  color: var(--brand-blue-600, #2e4fff);
  font-weight: 600;
}

.hdr-trigger:hover .hdr-caret,
.hdr-trigger--open .hdr-caret {
  opacity: 1;
  color: inherit;
}

.hdr-trigger-label {
  letter-spacing: 0.02em;
  max-width: 9.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hdr-caret {
  flex-shrink: 0;
  opacity: 0.55;
  color: rgba(0, 0, 0, 0.45);
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

.hdr-trigger--open .hdr-caret {
  transform: rotate(180deg);
}

.hdr-panel {
  position: absolute;
  /* 与入口留出间距，避免白底面板压住导航项 hover/active 浅色底 */
  top: calc(100% + 6px);
  padding: 0;
  width: max-content;
  min-width: 0;
  max-width: min(240px, calc(100vw - 24px));
  border-radius: 2px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 100;
}

.hdr-panel--site {
  left: 50%;
  transform: translateX(-50%);
}

/* 与对应导航格水平居中对齐（相对 .nav-dropdown / .site-slot 定位包含块） */
.hdr-panel--nav {
  left: 50%;
  transform: translateX(-50%);
}

.hdr-item {
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  padding: 12px 16px;
  margin: 0;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: rgba(10, 12, 16, 0.78);
  white-space: nowrap;
  cursor: crosshair;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.hdr-item:last-child {
  border-bottom: none;
}

.hdr-item--link {
  text-decoration: none;
}

.hdr-item:hover {
  background: rgba(46, 79, 255, 0.06);
  color: var(--brand-blue-600, #2e4fff);
}

.hdr-item--active {
  background: var(--brand-blue-100, #eef1ff);
  color: var(--brand-blue-600, #2e4fff);
  font-weight: 600;
}

/* ── Main Nav ── */
.main-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  height: 80px;
  z-index: 1;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  overflow: visible;
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
  background: var(--brand-blue-600, #2e4fff);
  color: #ffffff;
}

.nav-cell:hover::after {
  transform: scaleX(0);
}

.nav-cell:last-child {
  border-right: none;
}

.nav-cell.active {
  color: var(--brand-blue-600, #2e4fff);
  font-weight: 600;
  background: var(--brand-blue-100, #eef1ff);
}

.nav-cell.active::after {
  transform: scaleX(1);
}

.nav-cell:not(.active):hover {
  background: var(--brand-blue-600, #2e4fff);
  color: #ffffff;
}

/* 产品下拉容器（下拉露出后与入口有空隙，略延长收起延迟以减少误关） */
.nav-dropdown {
  padding: 0 !important;
  position: relative;
  overflow: visible;
}

.nav-dropdown-btn {
  height: 100%;
  width: 100%;
  padding: 0 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font: inherit;
  cursor: crosshair;
  color: inherit;
}

/* 产品下拉箭头：与站点 `.hdr-caret` 同形（实心三角）、同色阶与展开旋转 */
.hdr-caret--nav {
  flex-shrink: 0;
  opacity: 0.55;
  color: rgba(0, 0, 0, 0.45);
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

.nav-dropdown.active .hdr-caret--nav,
.nav-dropdown.nav-dropdown--open .hdr-caret--nav {
  opacity: 1;
  color: var(--brand-blue-600, #2e4fff);
}

.nav-dropdown.nav-dropdown--open .hdr-caret--nav {
  transform: rotate(180deg);
}

.nav-dropdown:hover:not(.active) .hdr-caret--nav {
  opacity: 1;
  color: #f9faf9;
}

.nav-dropdown.active:hover .hdr-caret--nav {
  opacity: 1;
  color: var(--brand-blue-600, #2e4fff);
}

.nav-dropdown:not(.active):hover .nav-dropdown-btn {
  color: #ffffff;
}

.nav-dropdown.active .nav-dropdown-btn {
  color: var(--brand-blue-600, #2e4fff);
}

.right-area {
  display: flex;
  align-items: center;
  height: 80px;
  margin-left: auto;
  position: relative;
  z-index: 2;
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

.mobile-site {
  padding: 16px 20px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.mobile-site-title {
  display: block;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.38);
  letter-spacing: 0.12em;
}

.mobile-site-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mobile-site-btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: rgba(10, 12, 16, 0.85);
  cursor: crosshair;
}

.mobile-site-btn.active {
  border-color: rgba(46, 79, 255, 0.35);
  background: var(--brand-blue-100, #eef1ff);
  color: var(--brand-blue-600, #2e4fff);
  font-weight: 600;
}

.mobile-group {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  transition: background 0.2s;
  cursor: crosshair;
}

.mobile-cell--expand {
  width: 100%;
  background: none;
  border: none;
  font: inherit;
  text-align: left;
}

.mobile-chevron {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.35);
  transition: transform 0.2s;
  display: inline-block;
}

.mobile-chevron.open {
  transform: rotate(90deg);
}

.mobile-sub {
  background: rgba(0, 0, 0, 0.02);
}

.mobile-sub-cell {
  padding-left: 44px !important;
  font-size: 13px;
}

.mobile-sub-cell.active {
  color: var(--brand-blue-600, #2e4fff);
  font-weight: 600;
  background: rgba(46, 79, 255, 0.06);
}

.mobile-cell:hover {
  background: rgba(0, 0, 0, 0.03);
}

@media (max-width: 1100px) {
  .main-nav {
    display: none;
  }
  .header-left .site-slot {
    display: none;
  }
  .right-area {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
}
</style>
