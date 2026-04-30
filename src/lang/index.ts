import Vue from 'vue';

const zhMessages = {
  nav: {
    home: '首页',
    products: '产品',
    resource: '资源',
    cases: '案例',
    news: '新闻',
    events: '活动',
  },
  footer: {
    learnMore: '了解更多',
    policy: '政策指南',
    links: '友情链接',
    home: '首页',
    resource: '资源',
    cases: '案例',
    news: '新闻',
    events: '活动',
    privacy: '隐私政策',
    terms: '平台服务条款',
    zhejiangLab: '之江实验室',
    devFoundation: '之江发展基金会',
    icomputing: '智能计算',
    copyright: 'Copyright © 2026 之江实验室. All Rights Reserved',
    icp: '浙ICP备2020025785号-2',
  },
  header: {
    siteChina: '中国站',
    siteSingapore: '新加坡站',
    siteGermany: '德国站',
    siteAria: '站点选择',
  },
  hero: {
    tagline: '全球性开放科学基础设施',
    tagline2: '旨在推动"人工智能+科学"融合发展',
    desc: '为算力、数据、模型、工具等各类资源提供一站式入口，助力各类人员高效便捷地触达"AI for Science"的各类资源和服务。',
    labTitle: 'zero2x Lab',
    labDesc: '开放AI科研工具集，支持跨学科融合创新研究',
    explore: '立即探索',
    learnMore: '了解更多',
  },
};

const enMessages = {
  nav: {
    home: 'Home',
    products: 'Products',
    resource: 'Resource',
    cases: 'Cases',
    news: 'News',
    events: 'Events',
  },
  footer: {
    learnMore: 'Learn More',
    policy: 'Policy Guidelines',
    links: 'Links',
    home: 'Home',
    resource: 'Resource',
    cases: 'Cases',
    news: 'News',
    events: 'Events',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    zhejiangLab: 'Zhejiang Lab',
    devFoundation: 'Zhijiang Development Foundation',
    icomputing: 'Intelligent Computing',
    copyright: '© Copyright 2026, All Rights Reserved by Zhejiang lab',
    icp: '浙ICP备2020025785号-2',
  },
  header: {
    siteChina: 'China Site',
    siteSingapore: 'Singapore Site',
    siteGermany: 'Germany Site',
    siteAria: 'Site selection',
  },
  hero: {
    tagline: 'A Global Open Science Infrastructure',
    tagline2: 'To Advance "AI + Science"',
    desc: 'One-stop access to computing, data, models, and tools — enabling researchers to efficiently leverage AI for Science resources and services.',
    labTitle: 'zero2x Lab',
    labDesc: 'Open AI research toolkit supporting interdisciplinary innovation',
    explore: 'Explore Now',
    learnMore: 'Learn More',
  },
};

export const langStore = Vue.observable({
  lang: 'zh' as 'zh' | 'en',
});

export function toggleLang() {
  langStore.lang = langStore.lang === 'zh' ? 'en' : 'zh';
}

export function t(key: string): string {
  const messages = langStore.lang === 'zh' ? zhMessages : enMessages;
  const keys = key.split('.');
  let result: any = messages;
  for (const k of keys) {
    result = result?.[k];
  }
  return result ?? key;
}
