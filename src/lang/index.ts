import Vue from 'vue';

const zhMessages = {
  nav: {
    home: '首页',
    lab: '02X Lab',
    models: '模型',
    data: '数据',
    cases: '案例',
    casesScience: '科学案例',
    casesITU: 'ITU合作',
    constellation: '三体计算星座',
    events: '活动',
  },
  footer: {
    learnMore: '了解更多',
    policy: '政策指南',
    links: '友情链接',
    home: '首页',
    lab: '02X Lab',
    data: '数据',
    cases: '案例',
    constellation: '三体计算星座',
    events: '活动',
    privacy: '隐私政策',
    terms: '平台服务条款',
    zhejiangLab: '之江实验室',
    devFoundation: '之江发展基金会',
    icomputing: '智能计算',
    copyright: '© Copyright 2026, All Rights Reserved by Zhejiang lab',
    icp: '浙ICP备18016057号-16',
  },
  header: {
    siteChina: '中国站',
    siteSingapore: '新加坡站',
    siteGermany: '德国站',
    siteAria: '站点选择',
    settings: '设置',
    logout: '退出',
    signIn: '登录',
  },
  hero: {
    tagline: '全球性开放科学基础设施',
    tagline2: '旨在推动"人工智能+科学"融合发展',
    desc: '为算力、数据、模型、工具等各类资源提供一站式入口，助力各类人员高效便捷地触达"AI for Science"的各类资源和服务。',
    labTitle: '02X Lab',
    labDesc: '开放AI科研工具集，支持跨学科融合创新研究',
    explore: '立即探索',
    learnMore: '了解更多',
  },
  dataPage: {
    title: '发现数据，加速创新',
    searchScopeAll: '全部',
    searchPlaceholder: '请输入关键词',
    searchBtn: '立即搜索',
    tagLlm: '大模型训练',
    tagEarth: '地球科学',
    tagBio: '生物学',
    tagAstro: '天文学',
    featureSpecial: '专题',
    featureStar: '精选',
    featureLitTitle: '文献语料检索',
    featureLitSub: '跨学科论文与摘要索引',
    featureKgTitle: '科学知识图谱',
    featureKgSub: '实体关系与领域本体',
    sidebarOpenSystems: '开放数据体系',
    sidebarFields: '学科领域',
    sidebarScience: '理学',
    sidebarEngineering: '工学',
    sidebarMore: '更多',
    sidebarTasks: '科研任务',
    sidebarVolume: '数据体量',
    sidebarType: '数据类型',
    typeText: '文本',
    unitMin: '下限',
    unitMax: '上限',
    volumeUnitKb: 'KB',
    resultSort: '排序',
    sortCalls: '调用量',
    sortNew: '最新上架',
    openCollection: '公开征集',
    tagOss: '对象存储',
    records: '条',
    portalNote: '列表为演示数据；接入真实接口后可替换为 DataHub 同源数据。',
  },
  labPage: {
    heroTitle: '02X Lab',
    /** Portal 首屏副标题（文档） */
    heroTagline: '面向科学家的AI原生智能体操作平台',
    /** 首页模块与 Portal 首屏共用长描述 */
    heroDesc:
      '02X Lab 是以科学家为中心的AI原生智能体操作平台，融合算力、模型与智能体，旨在实现多智能体驱动的自主科学发现循环，构建开放的全球科学智能生态。',
    sectionsLead: '02X Lab专为科学家而设计',
    toolsetTitle: '智能科研工具集',
    toolsetBody:
      '集成 Chat、Deep Discovery、文献解读等多款AI工具，覆盖从文献调研到成果验证的全流程科研需求。',
    vibeTitle: 'Vibe Research 自动科研引擎',
    vibeBody:
      '支持半自动 / 全自动科研集成开发环境，将科研意图转化为可执行 Benchmark，让 AI 在明确规则下无限迭代探索。',
    builderTitle: 'Agent Builder',
    builderBody:
      '提供模型、数据、工具、技能共享与协作环境，支持低代码智能体构建与跨机构全球科研协同。',
  },
  genos: {
    modelTitle: '人类基因组基础模型',
    modelDes: '10B参数驱动：百万碱基长程建模，单核苷酸级精准致病关联',
    download: '下载',
    contact: '联系我们',
    features: '功能特性',
    architecture: '模型架构',
    benchmarks: '性能基准',
    modelDownload: '模型下载',
    featuresTitle: '共享、共有、共为',
    architectureTitle: 'MoE创新架构',
    architectureOneTitle: '超长序列建模：',
    architectureOne:
      '通过引入超长序列参数化策略、多维张量并行计算与多尺度注意力机制，成功攻克百万级碱基序列的建模挑战。创新性的分形注意力模块有效缓解了超长上下文中的局部-全局依赖衰减问题，实现了单碱基变异（SNV）与结构变异（SV）的协同解析。',
    architectureTwoTitle: '训练稳定性：',
    architectureTwo:
      '针对基因组数据特有的低熵特征分布，采用专家负载均衡机制。此外，模型结构选用更宽的模型，以保证模型的稳定训练，避免更深结构中的参数未充分激活的情况。',
    architectureThreeTitle: '动态专家路由：',
    architectureThree: '通过动态路由实时激活相关的专家，从而提升计算效率。',
    benchmarksTitle: '基准测试中性能领先',
    benchmarksOneTitle: '变异热点预测： ',
    benchmarksOne: 'Genos-10B在序列长度为131,072 bp的任务中实现了',
    benchmarksOneSum: '的准确率，显著超越竞争对手。',
    benchmarksTwoTitle: '长序列基准测试：',
    benchmarksTwo: 'Genos-10B在疾病致病性预测（variant_effect_pathogenic_clinvar_8K）任务中，序列长度为8K时，得分达到',
    benchmarksTwoSum: '',
    benchmarksThreeTitle: '多模态疾病预测：',
    benchmarksThree: '在文本+基因模型疾病预测任务中，Genos-1.2B+021 Model 8b-32K达到了98.28%的准确率。',
    modelDownloadTitle: '开放科学与范式转变 ',
    modelDownloadOneTitle: '开放生态：',
    modelDownloadOne: '模型已在Github和Huggingface上开源，并在DCS Cloud上提供云推理服务。',
    modelDownloadTwoTitle: '研究体系：',
    modelDownloadTwo: '建立了“预测-解释-验证”的全链条研究体系，为分子机制分析提供了一种新的范式。',
    modelDownloadThreeTitle: '应用前景：',
    modelDownloadThree: '将在疾病早期预警和药物靶点发现等领域开辟新维度，目标是实现从“基因组学”到“功能组学”的范式转变。',
    modelDownloadEmail: '如需探讨与我们开源模型相关的科学问题或讨论潜在合作，请通过',
    modelDownloadEmails: '联系我们。',
    modelDownloadDes:
      '您可以在GitHub和Hugging Face上找到我们的模型和代码。为了即时访问，BGI DCS Cloud托管了模型，用于在线部署和推理。',
  },
};

const enMessages = {
  nav: {
    home: 'Home',
    lab: '02X Lab',
    models: 'Models',
    data: 'Data',
    cases: 'Cases',
    casesScience: 'Science cases',
    casesITU: 'ITU collaboration',
    constellation: 'Three-body Constellation',
    events: 'Events',
  },
  footer: {
    learnMore: 'Learn More',
    policy: 'Policy Guidelines',
    links: 'Links',
    home: 'Home',
    lab: '02X Lab',
    data: 'Data',
    cases: 'Cases',
    constellation: 'Three-body Constellation',
    events: 'Events',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    zhejiangLab: 'Zhejiang Lab',
    devFoundation: 'Zhijiang Development Foundation',
    icomputing: 'Intelligent Computing',
    copyright: '© Copyright 2026, All Rights Reserved by Zhejiang lab',
    icp: '浙ICP备18016057号-16',
  },
  header: {
    siteChina: 'China Site',
    siteSingapore: 'Singapore Site',
    siteGermany: 'Germany Site',
    siteAria: 'Site selection',
    /** 与线上海外版头像菜单英文一致 */
    settings: 'Account',
    logout: 'Log out',
    signIn: 'Log in',
  },
  hero: {
    tagline: 'A Global Open Science Infrastructure',
    tagline2: 'To Advance "AI + Science"',
    desc: 'One-stop access to computing, data, models, and tools — enabling researchers to efficiently leverage AI for Science resources and services.',
    labTitle: '02X Lab',
    labDesc: 'Open AI research toolkit supporting interdisciplinary innovation',
    explore: 'Explore Now',
    learnMore: 'Learn More',
  },
  dataPage: {
    title: 'Discover data. Accelerate innovation.',
    searchScopeAll: 'All',
    searchPlaceholder: 'Enter keywords',
    searchBtn: 'Search',
    tagLlm: 'LLM training',
    tagEarth: 'Earth science',
    tagBio: 'Biology',
    tagAstro: 'Astronomy',
    featureSpecial: 'Special',
    featureStar: 'Featured',
    featureLitTitle: 'Literature corpus',
    featureLitSub: 'Cross-domain papers & abstracts',
    featureKgTitle: 'Scientific knowledge graph',
    featureKgSub: 'Entities, relations & ontologies',
    sidebarOpenSystems: 'Open data systems',
    sidebarFields: 'Scientific fields',
    sidebarScience: 'Science',
    sidebarEngineering: 'Engineering',
    sidebarMore: 'More',
    sidebarTasks: 'Research tasks',
    sidebarVolume: 'Data volume',
    sidebarType: 'Data type',
    typeText: 'Text',
    unitMin: 'Min',
    unitMax: 'Max',
    volumeUnitKb: 'KB',
    resultSort: 'Sort',
    sortCalls: 'Call volume',
    sortNew: 'Newest',
    openCollection: 'Open collection',
    tagOss: 'Object storage',
    records: 'records',
    portalNote: 'Demo listings; wire to the DataHub API for live data.',
  },
  labPage: {
    heroTitle: '02X Lab',
    heroTagline: 'An AI-native agent operating platform built for scientists',
    heroDesc:
      '02X Lab is a scientist-centric, AI-native agent operating platform that unifies compute, models, and agents to enable multi-agent–driven autonomous scientific discovery loops and an open global ecosystem for scientific intelligence.',
    sectionsLead: '02X Lab is designed for scientists',
    toolsetTitle: 'Intelligent research toolkit',
    toolsetBody:
      'Integrates Chat, Deep Discovery, literature tools, and more—covering the full pipeline from literature survey to results validation.',
    vibeTitle: 'Vibe Research — automated research engine',
    vibeBody:
      'Semi- and fully-automated research IDE: turn research intent into executable benchmarks so AI can iterate under clear rules.',
    builderTitle: 'Agent Builder',
    builderBody:
      'Shared models, data, tools, and skills with collaboration—low-code agent building and cross-institution global research teamwork.',
  },
  genos: {
    modelTitle: 'Foundation Model',
    modelDes:
      'A foundation model for the human genome, achieving million-base-pair context modeling and single-nucleotide resolution learning capability for the human genome sequence.',
    download: 'Download',
    contact: 'Contact Us',
    features: 'Features',
    architecture: 'Architecture',
    benchmarks: 'Benchmarks',
    modelDownload: 'Download',
    featuresTitle: 'Owned by All, Done by All, Shared by All',
    architectureTitle: 'MoE Innovative Architecture',
    architectureOneTitle: 'Ultra-Long Sequence Modeling:',
    architectureOne:
      'Combines parameterization, tensor parallelism, and multi-scale attention to process million-base-pair sequences. A fractal attention module captures local-global dependencies.',
    architectureTwoTitle: 'Training Stability:',
    architectureTwo:
      'Uses expert load balancing and gradient clipping for low-entropy genomic data. A wider model ensures full parameter utilization.',
    architectureThreeTitle: 'Dynamic Expert Routing:',
    architectureThree: 'Activates relevant experts in real-time via dynamic routing, boosting computational efficiency.',
    benchmarksTitle: 'Leading Performance in Benchmarks',
    benchmarksOneTitle: 'Variant Hotspot Prediction:',
    benchmarksOne: ' Genos-10B achieved an accuracy of',
    benchmarksOneSum:
      'in the task with a sequence length of 131,072 bp, significantly outperforming competitors.',
    benchmarksTwoTitle: 'Long Sequence Benchmarks:',
    benchmarksTwo: 'Genos-10B scored',
    benchmarksTwoSum:
      'in the disease pathogenicity prediction (variant_effect_pathogenic_clinvar_8K) task with an 8K sequence length.',
    benchmarksThreeTitle: 'Multimodal Disease Prediction:',
    benchmarksThree:
      'In the Text + Gene Model Disease Prediction task, the Genos-1.2B+021 Model 8b-32K reached an accuracy of 98.28%.',
    modelDownloadTitle: 'Open Science and Paradigm Shift',
    modelDownloadOneTitle: 'Open Ecosystem:',
    modelDownloadOne:
      'Models are open-sourced on Github and Huggingface, with cloud inference services available on DCS Cloud.',
    modelDownloadTwoTitle: 'Research System:',
    modelDownloadTwo:
      'Establishes a full-chain research system of "Prediction-Interpretation-Validation", offering a new paradigm for molecular mechanism analysis.',
    modelDownloadThreeTitle: 'Application Prospects:',
    modelDownloadThree:
      'Will open up new dimensions in areas such as disease early warning and drug target discovery. Aiming for a paradigm shift from "Genomics" to "Functionomics."',
    modelDownloadEmail:
      'To explore scientific questions with our open-source model or discuss potential collaborations, please contact us at',
    modelDownloadEmails: '',
    modelDownloadDes:
      'Find our model and code on GitHub and Hugging Face. For instant access, BGI DCS Cloud hosts the model for online deployment and inference.',
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
