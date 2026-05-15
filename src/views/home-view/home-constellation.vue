<template>
  <section
    id="section-constellation"
    class="orbital-section"
    style="position:relative;overflow:hidden;"
    :class="{ 'section-out-of-view': !sectionAnimActive }"
  >
    <div class="orbital-cosmic-wrap" aria-hidden="true">
      <OrbilonBackdrop :paused="!sectionAnimActive" />
    </div>
    <!-- 遮罩层保留占位，不再叠渐变 -->
    <div class="absolute inset-0 pointer-events-none orbital-gradient-veil" style="z-index:1;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:112px 40px 96px;position:relative;z-index:10;">

      <!-- 模块 tag -->
      <span class="text-micro" style="color:#2e4fff;display:block;margin-bottom:32px;letter-spacing:0.3em;">
        <ScrambleText text="05 / ORBITAL_INFRASTRUCTURE" />
      </span>

      <!-- 大标题 + 卫星可视化：移至模块顶部，标题获得更宽展示空间 -->
      <div class="orbital-headline-row">
        <h2 class="orbital-heading" :class="{ 'orbital-heading--en': lang !== 'zh' }">
          <template v-if="lang === 'zh'">
            <SplitReveal
              key="orb-l1-zh"
              text="三体计算星座"
              :base-delay="0"
              :stagger="80"
            />
            <br />
            <SplitReveal
              key="orb-l2-zh"
              text="开放平台"
              :base-delay="180"
              :stagger="80"
            />
          </template>
          <template v-else>
            <SplitReveal
              key="orb-l1-en"
              text="Three-body Computing Constellation"
              :base-delay="0"
              :stagger="50"
            />
            <br />
            <SplitReveal
              key="orb-l2-en"
              text="Open Platform"
              :base-delay="180"
              :stagger="48"
            />
          </template>
        </h2>

        <!-- 链路与球体同一视觉组，缩短与球心的距离 -->
        <div class="sat-visual-stack">
          <!-- 卫星可视化：JS-RAF 精确轨道 + 鼠标交互 -->
          <div
            ref="satVisual"
            class="sat-visual"
            :class="{ 'sat-visual--hover': satHovered }"
            @mouseenter="satHovered = true"
            @mouseleave="satHovered = false; satOnSat = false"
          >
            <div class="sat-hud-inline" aria-hidden="true">
              <div class="sat-hud-line sat-hud-line--down"></div>
              <span class="sat-hud-label">{{ lang === 'zh' ? '链路已建立' : 'LINK_ESTABLISHED' }}</span>
            </div>

            <!-- 轨道环：仅外圈（不旋转，固定取向） -->
            <div class="sat-ring sat-ring--outer"></div>

            <!-- 中心：线框球 + 清晰外轮廓（略缩进画布，避免贴边） -->
            <div class="sat-center-globe" aria-hidden="true">
              <WireframeSphere
                :size="256"
                :animated="false"
                :meridians="13"
                :parallels="9"
                :line-width="0.82"
                :fill-ratio="0.92"
                color="rgba(130, 188, 255, 0.62)"
                rim-color="rgba(210, 236, 255, 0.78)"
                :paused="!sectionAnimActive"
              />
            </div>

            <!--
              卫星图片：left/top 完全由 JS RAF 驱动，
              position:absolute，坐标以容器左上角为原点。
            -->
            <div
              ref="satWrap"
              class="sat-wrap"
              :class="{ 'sat-wrap--zoom': satOnSat }"
              @mouseenter="satOnSat = true"
              @mouseleave="satOnSat = false"
              style="pointer-events:auto;"
            >
              <img
                src="/satellite.png"
                alt="Satellite"
                class="sat-orbit-img"
              />
              <div class="sat-orbit-ping"></div>
            </div>

            <!-- 遥测徽标：贴靠球体下沿，避免过远被忽略 -->
            <div class="sat-hover-badge">
              <span class="sat-hover-globe" aria-hidden="true" />
              {{ lang === 'zh' ? '遥测已激活' : 'TELEMETRY ACTIVE' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 平台介绍：从顶部移至标题下方，仍为模块级正文 -->
      <p class="orbital-platform-lead" v-reveal="{ delay: 60 }">
        <template v-if="lang === 'zh'">
          开放共享星座计算、存储、网络、数据、模型等资源，提供从模型训练、应用调试、地面验证到上星部署的一站式全流程服务，助力全球科学家的太空计算创新应用。
        </template>
        <template v-else>
          Sharing constellation resources—computing, storage, networking, data, and models—and offering one-stop
          end-to-end services from model training and application debugging to ground verification and orbital
          deployment, to empower global scientists’ innovative space computing applications.
        </template>
      </p>

      <!-- 主内容区：左侧路线图，右侧模型轮播 -->
      <div class="orbital-layout" :class="{ 'orbital-layout--en': lang !== 'zh' }">

        <!-- 左侧：路线图独占一列 -->
        <div class="orbital-left" :style="{ '--orbital-autoplay-ms': orbitalAutoplayIntervalMs + 'ms' }">
          <!-- 建设路线：三阶段自动轮播；卡片式包装与右侧呼应 -->
          <div class="orbital-roadmap" v-reveal="{ delay: 120 }">
            <p class="orbital-roadmap__leadtime orbital-panel-eyebrow">
              <template v-if="lang === 'zh'">
                三阶段建设 <strong class="orbital-roadmap__emph">1,000</strong> 颗计算星座
              </template>
              <template v-else>
                Three phases to a <strong class="orbital-roadmap__emph">1,000</strong>-sat constellation
              </template>
            </p>

            <div class="orbital-roadmap__stage">
              <transition name="roadmap-fade" mode="out-in">
                <div :key="roadmapIndex" class="roadmap-slide">
                  <div class="roadmap-kicker">
                    <span class="roadmap-year">{{ roadmapSlides[roadmapIndex].year }}</span>
                    <span class="roadmap-dot" aria-hidden="true" />
                    <span class="roadmap-count">{{ roadmapSlides[roadmapIndex].count }}</span>
                  </div>
                  <h3 class="roadmap-phase">{{ roadmapSlides[roadmapIndex].phase }}</h3>
                  <p class="roadmap-body">{{ roadmapSlides[roadmapIndex].body }}</p>
                </div>
              </transition>
            </div>

            <div class="roadmap-progress" aria-hidden="true">
              <span
                v-for="(_, i) in roadmapSlides"
                :key="i"
                class="roadmap-tick"
                :class="{ 'roadmap-tick--on': i === roadmapIndex }"
              />
            </div>
          </div>

        </div>

        <!-- 右侧：部署时效 + 模型案例轮播 -->
        <div
          class="constellation-services"
          v-reveal="{ delay: 160, dir: 'right' }"
          :style="orbitCarouselShellStyle"
          :class="{
            'constellation-services--orbit-paused': orbitCarouselHover || !sectionAnimActive,
          }"
        >
          <p class="constellation-services__leadtime orbital-panel-eyebrow">
            <template v-if="lang === 'zh'">
              <strong class="constellation-services__emph">2</strong> 天完成模型部署和在轨更新
            </template>
            <template v-else>
              Deploy and refresh models on orbit in <strong class="constellation-services__emph">2</strong> days
            </template>
          </p>

          <div
            class="orbit-carousel"
            :style="orbitCarouselCardStyle"
            @mouseenter="onOrbitCarouselEnter"
            @mouseleave="onOrbitCarouselLeave"
          >
            <div class="orbit-carousel__main">
              <div class="orbit-carousel__content">
                <div class="orbit-carousel__content-inner">
                  <div :class="orbitTextBlockClass">
                    <h4 class="orbit-carousel__name">
                      {{ orbitCurrentSlide?.title }}
                    </h4>
                    <p
                      v-if="orbitCurrentSlide?.params"
                      class="orbit-carousel__params"
                      :style="{ color: orbitSlideAccentColor }"
                    >
                      {{ orbitCurrentSlide.params }}
                    </p>
                    <p class="orbit-carousel__org">
                      {{ orbitCurrentSlide?.org }}
                    </p>
                    <div
                      class="orbit-carousel__nav-arrows"
                      role="group"
                      :aria-label="lang === 'zh' ? '轮播切换' : 'Carousel navigation'"
                    >
                      <button
                        type="button"
                        class="orbit-carousel__arrow orbit-carousel__arrow--inline"
                        :disabled="orbitModelSlides.length < 2 || orbitElegantTransitioning"
                        :aria-label="lang === 'zh' ? '上一案例' : 'Previous slide'"
                        @click.stop="orbitGoPrev"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                          <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="orbit-carousel__arrow orbit-carousel__arrow--inline"
                        :disabled="orbitModelSlides.length < 2 || orbitElegantTransitioning"
                        :aria-label="lang === 'zh' ? '下一案例' : 'Next slide'"
                        @click.stop="orbitGoNext"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="orbit-carousel__image-col">
                <div class="orbit-carousel__image-shell">
                  <div :class="orbitImageFrameClass">
                    <img
                      v-if="orbitCurrentSlide"
                      class="orbit-carousel__image"
                      :src="orbitCurrentSlide.image"
                      :alt="orbitCurrentSlide.title"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div
                    class="orbit-carousel__frame-corner orbit-carousel__frame-corner--tl"
                    :style="{ borderColor: orbitSlideAccentColor }"
                    aria-hidden="true"
                  />
                  <div
                    class="orbit-carousel__frame-corner orbit-carousel__frame-corner--br"
                    :style="{ borderColor: orbitSlideAccentColor }"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div class="orbit-carousel__card-progress" aria-hidden="true">
                <div
                  :key="'autoplay-' + servicesSlideIndex + '-' + orbitProgressNonce"
                  class="orbit-carousel__card-progress-fill"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { langStore } from '../../lang/index';
import ScrambleText from '../../components/ScrambleText.vue';
import SplitReveal from '../../components/SplitReveal.vue';
import OrbilonBackdrop from '../../components/OrbilonBackdrop.vue';
import WireframeSphere from '../../components/WireframeSphere.vue';
import sectionViewportActive from '../../mixins/sectionViewportActive';

type SatOrbitState = { angle: number; rafId: number; angleFixed: number | null };

type OrbitModelSlide = {
  title: string;
  params: string;
  org: string;
  hue: number;
  image: string;
};

type RoadmapSlide = {
  year: string;
  count: string;
  phase: string;
  body: string;
};

export default Vue.extend({
  name: 'HomeConstellation',
  mixins: [sectionViewportActive],
  components: { ScrambleText, SplitReveal, OrbilonBackdrop, WireframeSphere },
  data() {
    return {
      satHovered: false,
      satOnSat: false,
      roadmapIndex: 0,
      roadmapTimer: 0 as number,
      servicesSlideIndex: 0,
      servicesTimer: 0 as number,
      /** 与 CSS 进度条同步，点击同页时递增以重启动画 */
      orbitProgressNonce: 0,
      /** 路线图三阶段与右侧案例轮播共用同一自动切换间隔（节奏与路线图进度条一致） */
      orbitalAutoplayIntervalMs: 6400,
      /** 参考 Elegant Carousel：prev / next 决定过渡方向 */
      orbitCarouselDir: 'next' as 'next' | 'prev',
      orbitCarouselHover: false,
      /** ElegantCarousel 风格：半周期换片 + 文案/图淡入淡出 */
      orbitElegantTransitioning: false,
      orbitTransitionT1: 0 as number,
      orbitTransitionT2: 0 as number,
    };
  },
  computed: {
    lang() { return langStore.lang; },
    orbitCarouselCardStyle(): Record<string, string> {
      const m = this.orbitModelSlides[this.servicesSlideIndex];
      const h = m?.hue ?? 200;
      return {
        '--orbit-hue': String(h),
        '--orbit-accent': this.orbitCarouselAccentRgb,
      };
    },
    /** 与 hue 对应的强调色（rgba），用于背景光晕 */
    orbitCarouselAccentRgb(): string {
      const m = this.orbitModelSlides[this.servicesSlideIndex];
      const h = m?.hue ?? 200;
      return `hsla(${h}, 72%, 58%, 0.22)`;
    },
    orbitCarouselShellStyle(): Record<string, string> {
      return {
        '--orbit-autoplay-ms': `${this.orbitalAutoplayIntervalMs}ms`,
      };
    },
    orbitCurrentSlide(): OrbitModelSlide | null {
      const slides = this.orbitModelSlides;
      return slides[this.servicesSlideIndex] ?? null;
    },
    orbitSlideAccentColor(): string {
      const h = this.orbitCurrentSlide?.hue ?? 200;
      return `hsl(${h}, 72%, 58%)`;
    },
    orbitTextBlockClass(): Record<string, boolean> {
      return {
        'orbit-carousel__text-block': true,
        'is-transitioning': this.orbitElegantTransitioning,
        'is-dir-next': this.orbitCarouselDir === 'next',
        'is-dir-prev': this.orbitCarouselDir === 'prev',
      };
    },
    orbitImageFrameClass(): Record<string, boolean> {
      return {
        'orbit-carousel__image-frame': true,
        'is-transitioning': this.orbitElegantTransitioning,
        'is-dir-next': this.orbitCarouselDir === 'next',
        'is-dir-prev': this.orbitCarouselDir === 'prev',
      };
    },
    orbitModelSlides(): OrbitModelSlide[] {
      if (this.lang === 'zh') {
        return [
          {
            title: '天基遥感模型',
            params: '80 亿参数',
            org: '之江实验室、北京师范大学、香港大学、航天体系院',
            hue: 198,
            image: '/orbit-models/tianji-remote-sensing.png',
          },
          {
            title: '天基天文时域模型',
            params: '80 亿参数',
            org: '国家天文台、广西大学、之江实验室',
            hue: 218,
            image: '/orbit-models/tianji-astronomy.png',
          },
          {
            title: '量子抗干扰加密算法',
            params: '',
            org: '之江实验室',
            hue: 262,
            image: '/orbit-models/quantum-crypto.jpeg',
          },
          {
            title: '遥感图像融合算法',
            params: '',
            org: '宁波大学',
            hue: 192,
            image: '/orbit-models/space-cloud.png',
          },
          {
            title: '航天多模态模型',
            params: '3 亿参数',
            org: '航天体系院',
            hue: 206,
            image: '/orbit-models/aerospace-multimodal.jpg',
          },
          {
            title: '千问大语言模型',
            params: '6 亿参数',
            org: '国星宇航',
            hue: 178,
            image: '/orbit-models/qwen-llm.jpg',
          },
          {
            title: '太空云盘',
            params: '',
            org: '太空字节',
            hue: 188,
            image: '/orbit-models/rs-fusion.png',
          },
          {
            title: '伏羲气象模型',
            params: '1.5 亿参数',
            org: '复旦大学',
            hue: 168,
            image: '/orbit-models/fuxi-weather.jpg',
          },
          {
            title: 'L0-L4 遥感图像处理算法',
            params: '',
            org: '之江实验室',
            hue: 208,
            image: '/orbit-models/tianji-remote-sensing-detail.png',
          },
          {
            title: '地表要素提取模型',
            params: '',
            org: '之江实验室',
            hue: 152,
            image: '/orbit-models/surface-extraction.jpg',
          },
        ];
      }
      return [
        {
          title: 'Space-based remote sensing model',
          params: '8B parameters',
          org: 'Zhejiang Lab, BNU, HKU, aerospace institute',
          hue: 198,
          image: '/orbit-models/tianji-remote-sensing.png',
        },
        {
          title: 'Space-based astronomical time-domain model',
          params: '8B parameters',
          org: 'NAOC, Guangxi University, Zhejiang Lab',
          hue: 218,
          image: '/orbit-models/tianji-astronomy.png',
        },
        {
          title: 'Quantum anti-interference encryption',
          params: '',
          org: 'Zhejiang Lab',
          hue: 262,
          image: '/orbit-models/quantum-crypto.jpeg',
        },
        {
          title: 'Remote sensing image fusion',
          params: '',
          org: 'Ningbo University',
          hue: 192,
          image: '/orbit-models/space-cloud.png',
        },
        {
          title: 'Aerospace multimodal model',
          params: '300M parameters',
          org: 'Aerospace institute',
          hue: 206,
          image: '/orbit-models/aerospace-multimodal.jpg',
        },
        {
          title: 'Qwen large language model',
          params: '600M parameters',
          org: 'Guoxing Aerospace',
          hue: 178,
          image: '/orbit-models/qwen-llm.jpg',
        },
        {
          title: 'Space cloud storage',
          params: '',
          org: 'Space Byte',
          hue: 188,
          image: '/orbit-models/rs-fusion.png',
        },
        {
          title: 'Fuxi meteorological model',
          params: '150M parameters',
          org: 'Fudan University',
          hue: 168,
          image: '/orbit-models/fuxi-weather.jpg',
        },
        {
          title: 'L0–L4 remote sensing processing',
          params: '',
          org: 'Zhejiang Lab',
          hue: 208,
          image: '/orbit-models/tianji-remote-sensing-detail.png',
        },
        {
          title: 'Land surface feature extraction',
          params: '',
          org: 'Zhejiang Lab',
          hue: 152,
          image: '/orbit-models/surface-extraction.jpg',
        },
      ];
    },
    roadmapSlides(): RoadmapSlide[] {
      if (this.lang === 'zh') {
        return [
          {
            year: '2025',
            count: '12 颗计算卫星',
            phase: '技术验证阶段',
            body:
              '首发任务验证 P 级算力在轨、激光稳定建链、星间组网与天基模型，打通关键链路。',
          },
          {
            year: '2027',
            count: '100 颗计算星座',
            phase: '场景验证阶段',
            body:
              '在遥感、天文、导航、通信等典型场景示范验证，与伙伴共建系统，形成百余颗规模星座。',
          },
          {
            year: '2032',
            count: '1000 颗计算星座',
            phase: '大规模组网阶段',
            body:
              '以协议、工具、算力与算法服务支撑行业，搭建开放创新平台与太空计算生态，建成千星星座。',
          },
        ];
      }
      return [
        {
          year: '2025',
          count: '12 compute sats',
          phase: 'Technology validation',
          body:
            'First tranche proves petascale orbit-side compute, stable laser links, inter-sat networking, and orbital foundation models.',
        },
        {
          year: '2027',
          count: '100-sat constellation',
          phase: 'Scenario validation',
          body:
            'Demonstrations across remote sensing, astronomy, navigation, and communications; partner systems at ~100-sat scale.',
        },
        {
          year: '2032',
          count: '1,000-sat mesh',
          phase: 'Large-scale deployment',
          body:
            'Open protocols, toolchains, compute, and algorithms for the industry; platform + ecosystem for a kilo-sat compute grid.',
        },
      ];
    },
  },
  watch: {
    sectionAnimActive: {
      immediate: true,
      handler(active: boolean) {
        this.$nextTick(() => {
          if (active) this.resumeOrbitalMotion();
          else this.pauseOrbitalMotion();
        });
      },
    },
  },
  created() {
    (this as any)._sat = { angle: -Math.PI / 2, rafId: 0, angleFixed: null } as SatOrbitState;
  },
  beforeDestroy() {
    const s = (this as any)._sat;
    if (s) cancelAnimationFrame(s.rafId);
    if (this.roadmapTimer) window.clearInterval(this.roadmapTimer);
    if (this.servicesTimer) window.clearInterval(this.servicesTimer);
    if (this.orbitTransitionT1) window.clearTimeout(this.orbitTransitionT1);
    if (this.orbitTransitionT2) window.clearTimeout(this.orbitTransitionT2);
  },
  methods: {
    pauseOrbitalMotion() {
      const s = (this as any)._sat as SatOrbitState | undefined;
      if (s?.rafId) {
        cancelAnimationFrame(s.rafId);
        s.rafId = 0;
      }
      if (this.roadmapTimer) {
        window.clearInterval(this.roadmapTimer);
        this.roadmapTimer = 0;
      }
      if (this.servicesTimer) {
        window.clearInterval(this.servicesTimer);
        this.servicesTimer = 0;
      }
    },
    resumeOrbitalMotion() {
      if (!(this as any)._sat) {
        (this as any)._sat = { angle: -Math.PI / 2, rafId: 0, angleFixed: null } as SatOrbitState;
      }
      this.placeSatelliteOnce();
      this.startRoadmapRotation();
      this.startServicesCarousel();
    },
    /** 卫星轨道：无 RAF，每次进入页/刷新随机一次角度后固定（配合 created 内 angleFixed） */
    placeSatelliteOnce() {
      const state = (this as any)._sat as SatOrbitState | undefined;
      if (!state) return;
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
      if (state.angleFixed == null) {
        state.angleFixed = Math.random() * Math.PI * 2;
      }
      state.angle = state.angleFixed;

      const SIZE = 360;
      const RADIUS = 138;
      const CX = SIZE / 2;
      const CY = SIZE / 2;
      const SAT_W = 128;
      const SAT_H = 90;

      const x = CX + RADIUS * Math.cos(state.angle) - SAT_W / 2;
      const y = CY + RADIUS * Math.sin(state.angle) - SAT_H / 2;

      const wrap = this.$refs.satWrap as HTMLElement | undefined;
      if (wrap) {
        wrap.style.left = `${x}px`;
        wrap.style.top = `${y}px`;
      }
    },

    startRoadmapRotation() {
      if (this.roadmapTimer) window.clearInterval(this.roadmapTimer);
      this.roadmapTimer = window.setInterval(() => {
        const n = this.roadmapSlides.length;
        this.roadmapIndex = n ? (this.roadmapIndex + 1) % n : 0;
      }, this.orbitalAutoplayIntervalMs);
    },

    startServicesCarousel() {
      if (this.servicesTimer) window.clearInterval(this.servicesTimer);
      if (this.orbitCarouselHover) return;
      const ms = this.orbitalAutoplayIntervalMs;
      this.servicesTimer = window.setInterval(() => {
        this.orbitAutoAdvance();
      }, ms);
    },

    orbitAutoAdvance() {
      if (this.orbitCarouselHover || this.orbitElegantTransitioning) return;
      const n = this.orbitModelSlides.length;
      if (!n) return;
      const next = (this.servicesSlideIndex + 1) % n;
      this.beginOrbitSlideChange(next, 'next');
    },

    onOrbitCarouselEnter() {
      this.orbitCarouselHover = true;
      if (this.servicesTimer) {
        window.clearInterval(this.servicesTimer);
        this.servicesTimer = 0;
      }
    },

    onOrbitCarouselLeave() {
      this.orbitCarouselHover = false;
      this.orbitProgressNonce += 1;
      this.startServicesCarousel();
    },

    orbitGoNext() {
      const n = this.orbitModelSlides.length;
      if (n < 2) return;
      const next = (this.servicesSlideIndex + 1) % n;
      this.beginOrbitSlideChange(next, 'next');
    },

    orbitGoPrev() {
      const n = this.orbitModelSlides.length;
      if (n < 2) return;
      const prev = (this.servicesSlideIndex - 1 + n) % n;
      this.beginOrbitSlideChange(prev, 'prev');
    },

    beginOrbitSlideChange(targetIndex: number, dir: 'next' | 'prev') {
      const n = this.orbitModelSlides.length;
      if (!n || this.orbitElegantTransitioning) return;
      const next = ((targetIndex % n) + n) % n;
      if (next === this.servicesSlideIndex) {
        this.orbitProgressNonce += 1;
        return;
      }
      this.orbitCarouselDir = dir;
      if (this.servicesTimer) {
        window.clearInterval(this.servicesTimer);
        this.servicesTimer = 0;
      }
      if (this.orbitTransitionT1) window.clearTimeout(this.orbitTransitionT1);
      if (this.orbitTransitionT2) window.clearTimeout(this.orbitTransitionT2);

      this.orbitElegantTransitioning = true;
      this.orbitProgressNonce += 1;

      const half = 400;
      const end = 450;
      this.orbitTransitionT1 = window.setTimeout(() => {
        this.servicesSlideIndex = next;
        this.orbitTransitionT1 = 0;
      }, half);
      this.orbitTransitionT2 = window.setTimeout(() => {
        this.orbitElegantTransitioning = false;
        this.orbitTransitionT2 = 0;
        if (!this.orbitCarouselHover) this.startServicesCarousel();
      }, end);
    },

    goToOrbitSlide(i: number) {
      const n = this.orbitModelSlides.length;
      if (!n) return;
      const next = ((i % n) + n) % n;
      if (next === this.servicesSlideIndex) {
        this.orbitProgressNonce += 1;
        if (!this.orbitCarouselHover) this.startServicesCarousel();
      } else {
        const cur = this.servicesSlideIndex;
        const d = (next - cur + n) % n;
        const dir = d * 2 <= n ? 'next' : 'prev';
        this.beginOrbitSlideChange(next, dir);
      }
    },
  },
});
</script>

<style scoped>
/* ── 整体 ── */
.orbital-section {
  background: #02040c;
  color: #fff;
  min-height: 560px;
}

.orbital-cosmic-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
  min-height: 560px;
  pointer-events: none;
}

.orbital-gradient-veil {
  /* 去掉区块大渐变，仅保留层次占位 */
  background: none;
}

/* 模块级平台介绍：现位于标题下方，仍保留正文宽度 */
.orbital-platform-lead {
  margin: 28px 0 56px;
  max-width: 62rem;
  padding: 0;
  border: none;
  background: none;
  font-size: clamp(15px, 1.45vw, 17px);
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.62);
  letter-spacing: 0.015em;
}

/* ── 布局：两栏等宽、同高；stretch 铺满行高 ── */
.orbital-layout {
  --orbital-panel-height: 320px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px 24px;
  align-items: stretch;
}

.orbital-left {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1100px) {
  .orbital-layout {
    grid-template-columns: 1fr;
  }

  .orbital-roadmap,
  .constellation-services {
    height: auto;
    min-height: min(360px, 70vh);
    max-height: none;
  }

  .orbit-carousel__main {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(160px, 36vw) auto;
  }

  .orbit-carousel__content {
    grid-column: 1;
    grid-row: 1;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .orbit-carousel__image-col {
    grid-column: 1;
    grid-row: 2;
    min-height: 160px;
    padding: 0 2px 10px;
  }

  .orbit-carousel__image-shell {
    min-height: 160px;
  }

  .orbit-carousel__image-frame {
    min-height: 160px;
  }

  .orbit-carousel__image {
    min-height: 160px;
  }

  .orbit-carousel__card-progress {
    grid-column: 1;
    grid-row: 3;
    border-radius: 2px;
  }
}

/* ── 大标题行：模块顶部宽列布局；标题左、球体右；英文单独缩字号防换行错位 ── */
.orbital-headline-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  /* 略缩小与标题的横向空隙，线框球更贴近主标题 */
  gap: 24px;
  align-items: center;
  margin: 4px 0 8px;
}

@media (max-width: 1100px) {
  .orbital-headline-row {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 22px;
    margin-bottom: 32px;
  }

  .orbital-heading {
    width: 100%;
    max-width: 640px;
    text-align: center;
  }
}

.orbital-heading {
  font-size: clamp(36px, 5vw, 68px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #fff;
  margin: 0;
  line-height: 1.05;
  position: relative;
  z-index: 2;
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.orbital-heading--en {
  font-size: clamp(30px, 4.2vw, 56px);
  line-height: 1.08;
  letter-spacing: -0.034em;
  overflow-wrap: normal;
  word-break: normal;
  hyphens: manual;
}

/* 区块离屏：暂停纯 CSS 的无限动画（轮播定时器在 JS 侧暂停） */
.section-out-of-view .sat-orbit-ping {
  animation-play-state: paused !important;
}

.section-out-of-view .roadmap-tick--on::after {
  animation-play-state: paused !important;
}

/* HUD 叠在轨道盒顶部居中，缩短与球心的视觉距离 */
.sat-visual-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-top: 0;
}

.sat-hud-inline {
  position: absolute;
  left: 50%;
  top: 6px;
  transform: translateX(-50%);
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.sat-hud-line--down {
  width: 1px;
  height: 12px;
  background: linear-gradient(to bottom, transparent, rgba(46, 79, 255, 0.65));
}

/* ── 卫星可视化容器 ── */
.sat-visual {
  position: relative;
  width: 360px;
  height: 360px;
  flex-shrink: 0;
  cursor: crosshair;
  overflow: visible;
}

/* 与背景融合的柔光晕：让线框球像是从星空里浮现 */
.sat-visual::before {
  content: '';
  position: absolute;
  inset: -14%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(46, 79, 255, 0.18) 0%, rgba(46, 79, 255, 0.08) 36%, rgba(46, 79, 255, 0) 64%);
  filter: blur(6px);
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.4s ease;
  opacity: 0.85;
}

.sat-visual--hover::before {
  opacity: 1;
}

/* 轨道环 */
.sat-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed;
  pointer-events: none;
  transition: border-color 0.4s ease, opacity 0.4s ease;
}

.sat-ring--outer {
  inset: 0;
  border-color: rgba(46, 79, 255, 0.18);
  transform-origin: 50% 50%;
}

/* 悬停：环变亮 */
.sat-visual--hover .sat-ring--outer {
  border-color: rgba(46, 79, 255, 0.58);
}

/* 轨道中心线框球（替代平面圆点） */
.sat-center-globe {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
  width: 256px;
  height: 256px;
  max-width: 256px;
  max-height: 256px;
  transition: transform 0.45s ease, filter 0.45s ease;
  filter: drop-shadow(0 0 5px rgba(70, 140, 220, 0.22));
}

.sat-visual--hover .sat-center-globe {
  transform: translate(-50%, -50%) scale(1.015);
  filter: drop-shadow(0 0 8px rgba(90, 155, 235, 0.35));
}

/* 卫星包裹层：left/top 完全由 JS RAF 设置 */
.sat-wrap {
  position: absolute;
  width: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  transition: transform 0.3s ease;
  transform-origin: center center;
}

/* 鼠标直接悬停卫星时额外小幅放大 */
.sat-wrap--zoom {
  transform: scale(1.15);
}

.sat-orbit-img {
  width: 128px;
  height: auto;
  display: block;
  filter: drop-shadow(0 0 18px rgba(46, 79, 255, 0.65));
  transition: filter 0.35s ease;
}

/* 整体容器悬停：光晕加强 */
.sat-visual--hover .sat-orbit-img {
  filter: drop-shadow(0 0 30px rgba(46, 79, 255, 0.9)) brightness(1.1);
}

/* 直接悬停卫星：最强光晕 */
.sat-wrap--zoom .sat-orbit-img {
  filter: drop-shadow(0 0 44px rgba(46, 79, 255, 1)) brightness(1.22);
}

/* 卫星周身脉冲圈 */
.sat-orbit-ping {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(46, 79, 255, 0.5);
  animation: sat-ping-ring 2.4s ease-out infinite;
}

.sat-visual--hover .sat-orbit-ping {
  animation-duration: 1.2s;
  border-color: rgba(46, 79, 255, 0.8);
}

/* sat-ping-ring 定义在全局 <style> 块中，此处无需重复 */

.sat-hud-label {
  font-size: 8px;
  font-family: monospace;
  letter-spacing: 0.12em;
  color: rgba(46, 79, 255, 0.85);
  margin-top: 4px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.sat-visual--hover .sat-hud-label {
  color: #2e4fff;
}

/* 遥测徽标：紧贴可视化区域下沿，默认可见，避免被忽略 */
.sat-hover-badge {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-family: monospace;
  letter-spacing: 0.15em;
  color: rgba(142, 178, 255, 0.95);
  white-space: nowrap;
  opacity: 0.88;
  transition: opacity 0.3s ease, color 0.3s ease;
  pointer-events: none;
  z-index: 5;
  text-shadow: 0 0 12px rgba(46, 79, 255, 0.35);
}

.sat-visual--hover .sat-hover-badge {
  opacity: 1;
  color: rgba(200, 220, 255, 1);
}

.sat-hover-globe {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(165, 205, 255, 0.88);
  background: radial-gradient(circle at 32% 30%, rgba(235, 245, 255, 0.55), rgba(70, 130, 220, 0.2));
  box-shadow: 0 0 8px rgba(46, 130, 255, 0.45);
}

/* 轨道双栏玻璃：固定高度，避免随内容忽高忽低；略加高以适配英文多行 */
.orbital-roadmap {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  height: var(--orbital-panel-height, 320px);
  min-height: var(--orbital-panel-height, 320px);
  max-height: var(--orbital-panel-height, 320px);
  box-sizing: border-box;
  overflow: hidden;
  padding: 14px 18px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  backdrop-filter: blur(12px);
}

/* 两侧模块顶栏 */
.orbital-panel-eyebrow {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 4px 6px;
  min-height: 2.65em;
  margin: 0 0 10px;
  padding: 0 0 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.52);
  text-align: left;
}

.orbital-roadmap__emph {
  font-size: 1.45em;
  font-weight: 800;
  color: #2e4fff;
  margin-right: 4px;
  vertical-align: -0.06em;
}

.orbital-roadmap__stage {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  min-height: 0;
  padding: 0 6px 8px;
}

.roadmap-slide {
  margin: 0;
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.roadmap-progress {
  display: flex;
  gap: 8px;
  margin-top: auto;
  width: 100%;
  flex-shrink: 0;
}

.roadmap-kicker {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 8px;
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(46, 79, 255, 0.95);
}

.roadmap-year {
  font-weight: 700;
}

.roadmap-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
}

.roadmap-count {
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.08em;
}

.roadmap-phase {
  margin: 0 0 6px;
  font-size: clamp(18px, 2.1vw, 24px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1.15;
}

.roadmap-body {
  margin: 0;
  font-size: clamp(13px, 1.28vw, 15px);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.58);
  max-width: none;
}

/* 英文更长、视觉偏大：在非中文时略收紧标题/正文与顶栏 */
.orbital-layout--en .orbital-panel-eyebrow {
  font-size: 13px;
  line-height: 1.42;
}

.orbital-layout--en .roadmap-phase,
.orbital-layout--en .orbit-carousel__name {
  font-size: clamp(16px, 1.85vw, 21px);
}

.orbital-layout--en .roadmap-body,
.orbital-layout--en .orbit-carousel__org {
  font-size: clamp(12px, 1.15vw, 14px);
  line-height: 1.52;
}

.orbital-layout--en .orbit-carousel__params {
  font-size: 10px;
}

.roadmap-tick {
  flex: 1;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  position: relative;
  transition: background 0.35s ease;
}

.roadmap-tick--on {
  background: rgba(255, 255, 255, 0.1);
}

/** 当前阶段：与自动轮播同周期，自左向右填充 + 前端光感（与右侧卡片底栏节奏一致） */
.roadmap-tick--on::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transform-origin: left center;
  transform: scaleX(0);
  background: linear-gradient(90deg, rgba(46, 79, 255, 0.42) 0%, #2e4fff 52%, rgba(190, 224, 255, 0.98) 100%);
  box-shadow: 0 0 14px rgba(80, 140, 255, 0.75);
  animation: roadmap-segment-fill var(--orbital-autoplay-ms, 6400ms) linear forwards;
}

.roadmap-fade-enter-active,
.roadmap-fade-leave-active {
  transition: opacity 0.38s ease, transform 0.38s ease;
}

.roadmap-fade-enter,
.roadmap-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* ── 右侧玻璃面板：与左侧同固定高度 ── */
.constellation-services {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 14px 18px 12px;
  border-radius: 4px;
  height: var(--orbital-panel-height, 320px);
  min-height: var(--orbital-panel-height, 320px);
  max-height: var(--orbital-panel-height, 320px);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.constellation-services__emph {
  font-size: 1.45em;
  font-weight: 800;
  color: #2e4fff;
  margin-right: 4px;
  vertical-align: -0.06em;
}

.orbit-carousel {
  position: relative;
  isolation: isolate;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.orbit-carousel__main {
  --orbit-hue: 200;
  --orbit-accent: hsla(200, 72%, 58%, 0.22);
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: stretch;
  margin-bottom: 0;
}

/* 左：文案垂直居中 + 左对齐 */
.orbit-carousel__content {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  min-width: 0;
  min-height: 0;
  padding: 0;
  border-right: none;
  background: transparent;
}

.orbit-carousel__content-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 0;
  width: 100%;
  padding: 0 8px 8px;
  text-align: left;
}

.orbit-carousel__text-block {
  width: 100%;
  max-width: 100%;
  text-align: left;
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.orbit-carousel__text-block.is-transitioning.is-dir-next {
  opacity: 0;
  transform: translate3d(0, -12px, 0);
}

.orbit-carousel__text-block.is-transitioning.is-dir-prev {
  opacity: 0;
  transform: translate3d(0, 12px, 0);
}

/* 右：配图区域（矩形框仅约束图，不套文案） */
.orbit-carousel__image-col {
  grid-column: 2;
  grid-row: 1;
  position: relative;
  min-width: 0;
  min-height: 0;
  background: transparent;
  display: flex;
  align-items: stretch;
  align-self: stretch;
  padding: 2px 2px 2px 10px;
}

.orbit-carousel__image-shell {
  position: relative;
  flex: 1;
  height: 100%;
  min-height: 96px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.28);
}

.orbit-carousel__image-frame {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 96px;
  overflow: hidden;
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.orbit-carousel__image-frame.is-transitioning.is-dir-next {
  opacity: 0;
  transform: scale(1.02) translate3d(0, 10px, 0);
}

.orbit-carousel__image-frame.is-transitioning.is-dir-prev {
  opacity: 0;
  transform: scale(1.02) translate3d(0, -10px, 0);
}

.orbit-carousel__image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 96px;
  object-fit: cover;
  object-position: center;
}

.orbit-carousel__frame-corner {
  position: absolute;
  z-index: 3;
  width: 24px;
  height: 24px;
  pointer-events: none;
  border-style: solid;
  border-width: 0;
  opacity: 0.65;
}

.orbit-carousel__frame-corner--tl {
  top: 10px;
  left: 10px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 2px;
}

.orbit-carousel__frame-corner--br {
  right: 10px;
  bottom: 10px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-bottom-right-radius: 2px;
}

.orbit-carousel__card-progress {
  grid-column: 1 / -1;
  grid-row: 2;
  flex-shrink: 0;
  height: 3px;
  width: 100%;
  margin: 6px 0 0;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;
  align-self: stretch;
}

.orbit-carousel__card-progress-fill {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  transform: scaleX(0);
  background: hsl(var(--orbit-hue), 72%, 58%);
  box-shadow: none;
  animation: orbit-carousel-autoplay-progress var(--orbit-autoplay-ms, 6400ms) linear forwards;
}

.constellation-services--orbit-paused .orbit-carousel__card-progress-fill {
  animation-play-state: paused;
}

.orbit-carousel__name {
  margin: 0 0 6px;
  font-size: clamp(18px, 2.1vw, 24px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1.15;
}

.orbit-carousel__params {
  margin: 0 0 6px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: none;
  line-height: 1.45;
}

.orbit-carousel__org {
  margin: 0;
  font-size: clamp(13px, 1.28vw, 15px);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.58);
  max-width: none;
}

.orbit-carousel__nav-arrows {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 12px;
  padding-top: 2px;
}

.orbit-carousel__arrow {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(2, 8, 22, 0.2);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition:
    opacity 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.orbit-carousel__arrow--inline {
  opacity: 0.92;
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(4, 10, 26, 0.35);
}

.orbit-carousel:hover .orbit-carousel__arrow--inline:not(:disabled) {
  border-color: rgba(191, 219, 254, 0.55);
  background: rgba(8, 14, 32, 0.5);
}

.orbit-carousel__arrow--inline:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.65);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.orbit-carousel__arrow:focus-visible {
  outline: 2px solid rgba(96, 165, 250, 0.95);
  outline-offset: 2px;
  opacity: 1;
}

.orbit-carousel__arrow--inline:focus-visible:not(:disabled) {
  opacity: 1;
}

.orbit-carousel__arrow:active:not(:disabled) {
  transform: scale(0.94);
}

.orbit-carousel__arrow:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

@keyframes orbit-carousel-autoplay-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes roadmap-segment-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-carousel__card-progress-fill {
    animation: none;
    transform: scaleX(0.4);
    opacity: 0.85;
  }

  .roadmap-tick--on::after {
    animation: none;
    transform: scaleX(0.4);
    opacity: 0.9;
  }

  .orbit-carousel__text-block,
  .orbit-carousel__image-frame {
    transition: opacity 0.18s ease;
  }

  .orbit-carousel__text-block.is-transitioning.is-dir-next,
  .orbit-carousel__text-block.is-transitioning.is-dir-prev {
    transform: none;
  }

  .orbit-carousel__image-frame.is-transitioning.is-dir-next,
  .orbit-carousel__image-frame.is-transitioning.is-dir-prev {
    transform: none;
  }
}
</style>

<!-- 全局 keyframes，不能 scoped，否则 animation-name 在 Vue 2 里可能找不到 -->
<style>
@keyframes sat-ping-ring {
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0; }
}
</style>
