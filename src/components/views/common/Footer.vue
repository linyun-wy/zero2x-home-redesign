<template>
  <footer style="background:#f9faf9;border-top:1px solid rgba(0,0,0,0.08);padding-top:0;position:relative;z-index:20;">

    <div style="max-width:1320px;margin:0 auto;padding:52px 40px 0;">

      <!-- 主内容四列 -->
      <div class="footer-cols">

        <!-- Logo + 品牌描述 -->
        <div class="footer-brand-col">
          <a href="/" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;margin-bottom:16px;">
            <div style="width:28px;height:28px;background:#0a0c10;display:flex;align-items:center;justify-content:center;">
              <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#f9faf9;">Z</span>
            </div>
            <span style="font-size:14px;font-weight:800;color:#0a0c10;letter-spacing:-0.02em;text-transform:uppercase;">zero2x</span>
          </a>
          <p style="font-size:13px;line-height:1.7;color:#777f8f;margin:0;max-width:260px;">
            {{ lang === 'zh'
              ? '全球性开放科学基础设施，推动"人工智能+科学"融合发展'
              : 'A global open science infrastructure to advance AI + Science' }}
          </p>
        </div>

        <!-- 了解更多 -->
        <div>
          <h4 style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;color:rgba(0,0,0,0.35);margin:0 0 20px;border-bottom:1px solid rgba(0,0,0,0.07);padding-bottom:12px;">{{ t('footer.learnMore') }}</h4>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;">
            <li><a href="javascript:void(0);" class="footer-link">{{ t('footer.home') }}</a></li>
            <li><a href="javascript:void(0);" class="footer-link">{{ t('footer.resource') }}</a></li>
            <li><a href="javascript:void(0);" class="footer-link">{{ t('footer.cases') }}</a></li>
            <li><a href="javascript:void(0);" class="footer-link">{{ t('footer.news') }}</a></li>
            <li><a href="javascript:void(0);" class="footer-link">{{ t('footer.events') }}</a></li>
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

      <!-- 版权信息 -->
      <div style="border-top:1px solid rgba(0,0,0,0.08);padding:20px 0;margin-top:40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;color:rgba(0,0,0,0.4);">{{ t('footer.copyright') }}</span>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener" style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;color:rgba(0,0,0,0.35);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#2e4fff'" onmouseout="this.style.color='rgba(0,0,0,0.35)'">{{ t('footer.icp') }}</a>
      </div>

    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore, t } from '../../../lang/index';

export default Vue.extend({
  name: 'CommonFooter',
  computed: {
    lang() {
      return langStore.lang;
    },
  },
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

.footer-link {
  font-size: 14px;
  color: #52525a;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #2e4fff;
}

/* 确保关闭额外的 div */

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
