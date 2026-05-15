<template>
  <footer style="background:#f9faf9;border-top:1px solid rgba(0,0,0,0.08);padding-top:0;position:relative;z-index:20;">

    <div style="max-width:1320px;margin:0 auto;padding:52px 40px 0;">

      <!-- 主内容四列 -->
      <div class="footer-cols">

        <!-- Logo + 品牌描述 -->
        <div class="footer-brand-col">
          <router-link to="/" class="footer-logo-link">
            <span class="footer-logo-wordmark">zero2x</span>
          </router-link>
        </div>

        <!-- 了解更多 -->
        <div>
          <h4 style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;color:rgba(0,0,0,0.35);margin:0 0 20px;border-bottom:1px solid rgba(0,0,0,0.07);padding-bottom:12px;">{{ t('footer.learnMore') }}</h4>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;">
            <li><router-link to="/" exact class="footer-link">{{ t('footer.home') }}</router-link></li>
            <li><router-link to="/lab/genos" class="footer-link">{{ t('footer.lab') }}</router-link></li>
            <li><router-link :to="{ path: '/', hash: '#section-models' }" class="footer-link">{{ t('footer.models') }}</router-link></li>
            <li><router-link to="/data" class="footer-link">{{ t('footer.data') }}</router-link></li>
            <li><router-link :to="{ path: '/', hash: '#section-cases' }" class="footer-link">{{ t('footer.cases') }}</router-link></li>
            <li><router-link to="/" class="footer-link">{{ t('footer.constellation') }}</router-link></li>
            <li><router-link :to="{ path: '/', hash: '#section-events' }" class="footer-link">{{ t('footer.events') }}</router-link></li>
          </ul>
        </div>

        <!-- 政策指南 -->
        <div>
          <h4 style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;color:rgba(0,0,0,0.35);margin:0 0 20px;border-bottom:1px solid rgba(0,0,0,0.07);padding-bottom:12px;">{{ t('footer.policy') }}</h4>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;">
            <li><a href="javascript:void(0);" class="footer-link">{{ t('footer.privacy') }}</a></li>
            <li><a href="javascript:void(0);" class="footer-link">{{ t('footer.terms') }}</a></li>
          </ul>
        </div>

        <!-- 友情链接 -->
        <div>
          <h4 style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;color:rgba(0,0,0,0.35);margin:0 0 20px;border-bottom:1px solid rgba(0,0,0,0.07);padding-bottom:12px;">{{ t('footer.links') }}</h4>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;">
            <li><a href="https://en.zhejianglab.org/" target="_blank" rel="noopener" class="footer-link">{{ t('footer.zhejiangLab') }}</a></li>
            <li><a href="http://zjdf.zhejianglab.org/home/#/home" target="_blank" rel="noopener" class="footer-link">{{ t('footer.devFoundation') }}</a></li>
            <li><a href="https://spj.science.org/journal/icomputing" target="_blank" rel="noopener" class="footer-link">{{ t('footer.icomputing') }}</a></li>
          </ul>
        </div>

      </div>

      <!-- 版权信息：与截图一致，单行居中 -->
      <div class="footer-copy-bar">
        <span class="footer-copy-text">{{ t('footer.copyright') }}</span>
        <span class="footer-copy-sep" aria-hidden="true">|</span>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener" class="footer-copy-link">{{ t('footer.icp') }}</a>
      </div>

    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { t } from '../../../lang/index';

export default Vue.extend({
  name: 'CommonFooter',
  methods: {
    t(key: string) {
      return t(key);
    },
  },
});
</script>

<style>
/* 非 scoped，确保全局生效 */
.footer-cols {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 0;
}

.footer-brand-col {
  display: flex;
  flex-direction: column;
}

.footer-logo-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 0;
  width: fit-content;
}

.footer-logo-wordmark {
  font-size: 21px;
  font-weight: 900;
  letter-spacing: -0.04em;
  font-family: var(--font-display, 'Plus Jakarta Sans', 'Noto Sans SC', sans-serif);
  color: var(--brand-blue-600, #2e4fff);
  line-height: 1;
  white-space: nowrap;
}

.footer-link {
  font-size: 14px;
  color: #52525a;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #2e4fff;
}

.footer-copy-bar {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 40px;
  padding: 20px 16px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 14px;
  font-family: var(--font-sans, 'Noto Sans SC', system-ui, sans-serif);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #5c5c66;
}

.footer-copy-sep {
  color: rgba(0, 0, 0, 0.25);
  user-select: none;
}

.footer-copy-text,
.footer-copy-link {
  color: #5c5c66;
  font-size: 14px;
}

.footer-copy-link {
  text-decoration: none;
  transition: color 0.2s;
  font-size: 14px;
}

.footer-copy-link:hover {
  color: #2e4fff;
}

@media (max-width: 1024px) {
  .footer-cols {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .footer-brand-col {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .footer-cols {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
</style>
