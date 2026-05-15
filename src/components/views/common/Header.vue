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
              <template v-for="sub in item.dropdown">
                <a
                  v-if="sub.externalUrl"
                  :key="sub.key + '-ext'"
                  :href="sub.externalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hdr-item hdr-item--link hdr-item--row"
                  @click="navDropdownOpenKey = null"
                >
                  {{ sub.labelKey ? t(sub.labelKey) : sub.label }}
                </a>
                <a
                  v-else
                  :key="sub.key"
                  href="javascript:void(0);"
                  class="hdr-item hdr-item--link hdr-item--row"
                  :class="{ 'hdr-item--active': isNavSubActive(item.key, sub.key) }"
                  @click.prevent="selectNavSub(item.key, sub.key)"
                >
                  {{ sub.labelKey ? t(sub.labelKey) : sub.label }}
                </a>
              </template>
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

        <button
          v-if="!isLoggedIn"
          type="button"
          class="sign-in-btn"
          @click="onSignInClick"
        >
          {{ t('header.signIn') }}
        </button>

        <div v-else class="user-slot" ref="userMenuRoot">
          <button
            type="button"
            class="user-trigger"
            :class="{ 'user-trigger--open': userMenuOpen }"
            :aria-expanded="userMenuOpen"
            :aria-haspopup="true"
            :aria-label="t('header.settings')"
            @click.stop="userMenuOpen = !userMenuOpen"
          >
            <span class="user-avatar-ring">
              <span class="user-avatar" :style="{ background: avatarBg }">{{ userInitials }}</span>
            </span>
            <svg class="hdr-caret hdr-caret--user" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path fill="currentColor" d="M5 2.5 L8 6 H2 Z" />
            </svg>
          </button>
          <div v-show="userMenuOpen" class="hdr-panel hdr-panel--user" role="menu" @click.stop>
            <button type="button" class="hdr-item hdr-item--row" role="menuitem" @click="onUserSettings">
              <svg class="user-menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <circle cx="12" cy="10" r="2.5" />
                <path d="M8 17c0-2.2 1.8-4 4-4s4 1.8 4 4" />
              </svg>
              {{ t('header.settings') }}
            </button>
            <button type="button" class="hdr-item hdr-item--row" role="menuitem" @click="onUserLogout">
              <svg class="user-menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <path d="M16 17l5-5-5-5"/>
                <path d="M21 12H9"/>
              </svg>
              {{ t('header.logout') }}
            </button>
          </div>
        </div>
      </div>

      <button
        class="mobile-toggle"
        type="button"
        @click="mobileOpen = !mobileOpen"
        :aria-expanded="mobileOpen"
        :aria-label="mobileOpen ? t('header.menuClose') : t('header.menuOpen')"
      >
        <svg v-if="!mobileOpen" class="mobile-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <svg v-else class="mobile-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18"/>
          <line x1="18" y1="6" x2="6" y2="18"/>
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
            <span class="mobile-cell__label">{{ t('nav.' + item.key) }}</span>
            <span class="mobile-chevron" :class="{ open: mobileExpandedKey === item.key }">›</span>
          </button>
          <div v-show="mobileExpandedKey === item.key" class="mobile-sub">
            <template v-for="sub in item.dropdown">
              <a
                v-if="sub.externalUrl"
                :key="sub.key + '-ext'"
                :href="sub.externalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-cell mobile-sub-cell"
                @click="mobileOpen = false"
              >
                {{ sub.labelKey ? t(sub.labelKey) : sub.label }}
              </a>
              <a
                v-else
                :key="sub.key"
                href="javascript:void(0);"
                class="mobile-cell mobile-sub-cell"
                :class="{ active: isNavSubActive(item.key, sub.key) }"
                @click.prevent="selectNavSub(item.key, sub.key); mobileOpen = false"
              >
                {{ sub.labelKey ? t(sub.labelKey) : sub.label }}
              </a>
            </template>
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

      <div v-if="isLoggedIn" class="mobile-user-block">
        <div class="mobile-cell mobile-cell--static">{{ userInitials }} · {{ userDisplayName }}</div>
        <button type="button" class="mobile-cell" @click="onUserSettings(); mobileOpen = false">
          {{ t('header.settings') }}
        </button>
        <button type="button" class="mobile-cell" @click="onUserLogout(); mobileOpen = false">
          {{ t('header.logout') }}
        </button>
      </div>
      <button
        v-else
        type="button"
        class="mobile-cell"
        style="justify-content:center;color:#2e4fff;font-weight:600;"
        @click="onSignInClick(); mobileOpen = false"
      >
        {{ t('header.signIn') }}
      </button>

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

const AVATAR_COLORS = [
  '#6B4D3D',
  '#294175',
  '#416B69',
  '#D09030',
  '#C1542B',
  '#2D9C6A',
  '#74427D',
  '#CE5069',
  '#E6B220',
  '#2AA8A8',
  '#A83D97',
  '#8CBF3D',
  '#4D2E8C',
  '#FFA726',
  '#3D8C8C',
  '#6B8C3D',
];

function getAvatarColor(username: string): string {
  if (!username) return AVATAR_COLORS[0];
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

interface NavSubItem {
  key: string;
  label?: string;
  labelKey?: string;
  externalUrl?: string;
}

interface NavDropdownItem {
  key: string;
  dropdown: NavSubItem[];
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
      userMenuOpen: false,
      isLoggedIn: true,
      /** 与线上一致：用于头像缩写与颜色哈希（默认展示 WA） */
      userDisplayName: 'Wang Admin',
      navItems: [
        { key: 'home' },
        { key: 'lab' },
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
        { key: 'data' },
        {
          key: 'cases',
          dropdown: [
            { key: 'science', labelKey: 'nav.casesScience' },
            { key: 'itu', labelKey: 'nav.casesITU', externalUrl: 'https://ai4g.zero2x.org/' },
          ],
        },
        { key: 'constellation' },
        { key: 'events' },
      ] as (NavLinkItem | NavDropdownItem)[],
      selectedSite: 'cn' as SiteKey,
      siteOpen: false,
      activeModelKey: 'geogpt' as ModelSubKey,
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
    userInitials(): string {
      const name = this.userDisplayName.trim() || 'User';
      const parts = name.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase() || 'U';
    },
    avatarBg(): string {
      return getAvatarColor(this.userDisplayName);
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
      const dn = localStorage.getItem('zero2x-user-display-name');
      if (dn && dn.trim()) this.userDisplayName = dn.trim();
      const li = localStorage.getItem('zero2x-header-logged-in');
      if (li === '0') this.isLoggedIn = false;
      if (li === '1') this.isLoggedIn = true;
    } catch (_) {
      /* ignore */
    }
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
    document.addEventListener('click', this.closeOutsideMenus);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.navDropdownLeaveTimer) clearTimeout(this.navDropdownLeaveTimer);
    document.removeEventListener('click', this.closeOutsideMenus);
  },
  methods: {
    t(key: string) {
      return t(key);
    },
    handleLangSwitch() {
      toggleLang();
    },
    onUserSettings() {
      this.userMenuOpen = false;
    },
    onUserLogout() {
      this.userMenuOpen = false;
      this.isLoggedIn = false;
      try {
        localStorage.setItem('zero2x-header-logged-in', '0');
      } catch (_) {
        /* ignore */
      }
    },
    onSignInClick() {
      this.isLoggedIn = true;
      try {
        localStorage.setItem('zero2x-header-logged-in', '1');
      } catch (_) {
        /* ignore */
      }
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
      this.navDropdownOpenKey = null;
      if (navKey === 'models') {
        this.activeModelKey = subKey as ModelSubKey;
        this.activeNav = 'models';
        try {
          localStorage.setItem('zero2x-model', subKey);
        } catch (_) {
          /* ignore */
        }
      } else if (navKey === 'cases' && subKey === 'science') {
        this.activeNav = 'cases';
        this.$router.push({ path: '/', hash: '#section-cases' }).catch(() => {});
      }
    },
    isNavSubActive(navKey: string, subKey: string): boolean {
      if (navKey === 'models') return this.activeModelKey === subKey;
      if (navKey === 'cases') return subKey === 'science' && this.activeNav === 'cases';
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
    closeOutsideMenus(e: MouseEvent) {
      const siteRoot = this.$refs.siteDropdownRoot as HTMLElement | undefined;
      const userRoot = this.$refs.userMenuRoot as HTMLElement | undefined;
      if (this.siteOpen && siteRoot && !siteRoot.contains(e.target as Node)) {
        this.siteOpen = false;
      }
      if (this.userMenuOpen && userRoot && !userRoot.contains(e.target as Node)) {
        this.userMenuOpen = false;
      }
    },
    isPlainNavActive(key: string): boolean {
      if (key === 'constellation') {
        /* 「新闻」仅回首页顶部，不作为与 hash 绑定的当前页高亮 */
        return false;
      }
      if (key === 'home') {
        return this.$route.path === '/' && !this.$route.hash;
      }
      if (key === 'data') {
        return this.$route.path === '/data';
      }
      if (key === 'lab') {
        return this.activeNav === 'lab' || this.$route.path.startsWith('/lab');
      }
      return this.activeNav === key;
    },
    onPlainNav(item: NavLinkItem | NavDropdownItem) {
      if ('dropdown' in item && item.dropdown) return;
      const key = item.key;
      if (key === 'constellation') {
        this.activeNav = 'home';
        this.$router.push({ path: '/' }).catch(() => {});
        this.$nextTick(() => {
          try {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          } catch (_) {
            window.scrollTo(0, 0);
          }
        });
        return;
      }
      this.activeNav = key;
      if (key === 'home') {
        this.$router.push({ path: '/' }).catch(() => {});
      } else if (key === 'data') {
        this.$router.push({ path: '/data' }).catch(() => {});
      } else if (key === 'lab') {
        this.$router.push({ path: '/lab/genos' }).catch(() => {});
      } else if (key === 'cases') {
        this.$router.push({ path: '/', hash: '#section-cases' }).catch(() => {});
      } else if (key === 'events') {
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
      if (path.startsWith('/lab')) {
        this.activeNav = 'lab';
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
  /* 视觉评审：导航/下拉等 UI 铬层用正文栈 Noto Sans SC，与 logo 的展示字体区分 */
  font-family: var(--font-sans, 'Noto Sans SC', ui-sans-serif, system-ui, sans-serif);
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
  font-size: 21px;
  font-weight: 900;
  letter-spacing: -0.04em;
  font-family: var(--font-display, 'Plus Jakarta Sans', 'Noto Sans SC', sans-serif);
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

/* 与对应导航格水平居中对齐；宽度至少与入口格一致，避免「案例」等过窄 */
.hdr-panel--nav {
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  width: max-content;
  max-width: min(300px, calc(100vw - 24px));
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
  /* 与左侧 meta / 语言格对称，避免「Log in」贴紧视口右缘 */
  padding-right: 20px;
  column-gap: 0;
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
  background: var(--brand-blue-600, #2e4fff);
  color: #ffffff;
}

.lang-btn .text-micro {
  font-size: 11px;
  font-weight: 600;
}

.sign-in-btn {
  height: 36px;
  padding: 0 22px;
  margin-left: 12px;
  margin-right: 0;
  border-radius: 4px;
  border: 1px solid var(--brand-blue-600, #2e4fff);
  background: var(--brand-blue-600, #2e4fff);
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: crosshair;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.sign-in-btn:hover {
  background: var(--brand-blue-700, #2441e0);
  border-color: var(--brand-blue-700, #2441e0);
  color: #fff;
}

.user-slot {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 80px;
  padding: 0 12px 0 8px;
  margin: 0;
  border: none;
  background: none;
  cursor: crosshair;
  color: var(--brand-blue-600, #2e4fff);
}

.user-trigger--open .hdr-caret--user,
.user-trigger:hover .hdr-caret--user {
  opacity: 1;
}

.hdr-caret--user {
  flex-shrink: 0;
  opacity: 0.85;
  color: var(--brand-blue-600, #2e4fff);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.user-trigger--open .hdr-caret--user {
  transform: rotate(180deg);
}

.user-avatar-ring {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  padding: 1px;
  border: 1px solid var(--brand-blue-600, #2e4fff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1;
}

.hdr-panel--user {
  left: auto;
  right: 0;
  transform: none;
  /* 随文案 + 图标自然宽度，避免两三条目时右侧留白过大 */
  min-width: 0;
  width: max-content;
  max-width: min(220px, calc(100vw - 24px));
}

.hdr-panel--user .hdr-item--row {
  padding-left: 12px;
  padding-right: 12px;
  gap: 8px;
}

.hdr-item--row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding-left: 16px;
  padding-right: 16px;
}

.user-menu-icon {
  flex-shrink: 0;
  color: currentColor;
}

.mobile-user-block {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.mobile-cell--static {
  cursor: default;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  justify-content: center;
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
  justify-content: flex-start;
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
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 28px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  text-align: center;
  transition: background 0.2s;
  cursor: crosshair;
  position: relative;
}

.mobile-cell--expand {
  width: 100%;
  background: none;
  border: none;
  font: inherit;
}

/* 文案居中，展开箭头贴右，避免与居中标题抢 flex 空间 */
.mobile-cell__label {
  flex: 1;
  text-align: center;
  padding: 0 32px;
}

.mobile-chevron {
  position: absolute;
  right: 28px;
  top: 50%;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.35);
  transition: transform 0.2s;
  display: inline-block;
  transform: translateY(-50%);
  line-height: 1;
}

.mobile-chevron.open {
  transform: translateY(-50%) rotate(90deg);
}

.mobile-sub {
  background: rgba(0, 0, 0, 0.02);
}

.mobile-sub .mobile-cell {
  justify-content: center;
  text-align: center;
}

.mobile-sub-cell {
  padding-left: 28px !important;
  padding-right: 28px !important;
  font-size: 13px;
  justify-content: center !important;
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
