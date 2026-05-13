<template>
  <section class="orbital-section" style="position:relative;overflow:hidden;">
    <div class="orbital-cosmic-wrap" aria-hidden="true">
      <OrbilonBackdrop />
    </div>
    <!-- 仅保留深色氛围渐变，去掉字符矩阵背景 -->
    <div class="absolute inset-0 pointer-events-none orbital-gradient-veil" style="z-index:1;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:112px 40px 96px;position:relative;z-index:10;">

      <!-- 模块 tag -->
      <span class="text-micro" style="color:#2e4fff;display:block;margin-bottom:32px;letter-spacing:0.3em;">
        <ScrambleText text="05 / ORBITAL_INFRASTRUCTURE" />
      </span>

      <!-- 平台介绍：独立于右侧玻璃卡片，直接置于模块内 -->
      <p class="orbital-platform-lead" v-reveal="{ delay: 60 }">
        <template v-if="lang === 'zh'">
          开放共享星座计算、存储、网络、数据、模型等资源，提供从模型训练、应用调试、地面验证到上星部署的一站式全流程服务，助力全球科学家的太空计算创新应用。
        </template>
        <template v-else>
          Open shared compute, storage, networking, data, and models across the constellation—full stack from training
          and ground debugging to validation and on-orbit deployment—empowering scientists worldwide to innovate in
          space computing.
        </template>
      </p>

      <!-- 主内容区：左侧文字+卫星，右侧模型轮播 -->
      <div class="orbital-layout">

        <!-- 左侧：heading 不加 v-reveal，让 SplitReveal 自主动画 -->
        <div class="orbital-left">

          <!-- 大标题 + 卫星可视化同行 -->
          <div class="orbital-headline-row">
            <h2 class="orbital-heading">
              <SplitReveal
                v-if="lang === 'zh'"
                key="orb-l1-zh"
                text="三体计算"
                :base-delay="0"
                :stagger="80"
              />
              <SplitReveal
                v-else
                key="orb-l1-en"
                text="Three-Body"
                :base-delay="0"
                :stagger="60"
              />
              <br />
              <SplitReveal
                v-if="lang === 'zh'"
                key="orb-l2-zh"
                text="星座工作台"
                :base-delay="180"
                :stagger="80"
              />
              <SplitReveal
                v-else
                key="orb-l2-en"
                text="Constellation Workspace"
                :base-delay="180"
                :stagger="55"
              />
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

                <!-- 轨道环：仅外圈（内虚线已移除），外圈缓慢旋转 -->
                <div class="sat-ring sat-ring--outer"></div>

                <!-- 中心：线框球 + 清晰外轮廓（略缩进画布，避免贴边） -->
                <div class="sat-center-globe" aria-hidden="true">
                  <WireframeSphere
                    :size="256"
                    :speed="0.55"
                    :meridians="13"
                    :parallels="9"
                    :line-width="0.82"
                    :fill-ratio="0.92"
                    color="rgba(130, 188, 255, 0.62)"
                    rim-color="rgba(210, 236, 255, 0.78)"
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
                  <span class="sat-hover-globe" aria-hidden="true">
                    <WireframeSphere
                      :size="14"
                      :speed="0.9"
                      :meridians="6"
                      :parallels="4"
                      :line-width="0.85"
                      :show-rim="false"
                    />
                  </span>
                  {{ lang === 'zh' ? '遥测已激活' : 'TELEMETRY ACTIVE' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 建设路线：三阶段自动轮播（摘自路线图提炼） -->
          <div class="orbital-roadmap" v-reveal="{ delay: 120 }">
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
        <div class="constellation-services" v-reveal="{ delay: 160, dir: 'right' }">
          <p class="constellation-services__leadtime">
            <template v-if="lang === 'zh'">
              <strong class="constellation-services__emph">2</strong> 天完成模型部署和在轨更新
            </template>
            <template v-else>
              Deploy and refresh models on orbit in <strong class="constellation-services__emph">2</strong> days
            </template>
          </p>

          <div class="orbit-carousel">
            <transition name="orbit-card-fade" mode="out-in">
              <article
                :key="servicesSlideIndex"
                class="orbit-carousel__card"
                :style="orbitCarouselCardStyle"
              >
                <div class="orbit-carousel__thumb" aria-hidden="true" />
                <div class="orbit-carousel__body">
                  <h4 class="orbit-carousel__name">{{ orbitModelSlides[servicesSlideIndex].title }}</h4>
                  <p v-if="orbitModelSlides[servicesSlideIndex].params" class="orbit-carousel__params">
                    {{ orbitModelSlides[servicesSlideIndex].params }}
                  </p>
                  <p class="orbit-carousel__org">{{ orbitModelSlides[servicesSlideIndex].org }}</p>
                </div>
              </article>
            </transition>
            <div class="orbit-carousel__dots" role="tablist" :aria-label="lang === 'zh' ? '典型模型案例' : 'Featured models'">
              <button
                v-for="(m, i) in orbitModelSlides"
                :key="m.title + i"
                type="button"
                class="orbit-carousel__dot"
                :class="{ 'orbit-carousel__dot--active': i === servicesSlideIndex }"
                :aria-selected="i === servicesSlideIndex"
                :aria-label="(lang === 'zh' ? '查看 ' : 'Show ') + m.title"
                @click="servicesSlideIndex = i"
              />
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

type OrbitModelSlide = {
  title: string;
  params: string;
  org: string;
  hue: number;
};

type RoadmapSlide = {
  year: string;
  count: string;
  phase: string;
  body: string;
};

export default Vue.extend({
  name: 'HomeNanhu',
  components: { ScrambleText, SplitReveal, OrbilonBackdrop, WireframeSphere },
  data() {
    return {
      satHovered: false,
      satOnSat: false,
      roadmapIndex: 0,
      roadmapTimer: 0 as number,
      servicesSlideIndex: 0,
      servicesTimer: 0 as number,
    };
  },
  computed: {
    lang() { return langStore.lang; },
    orbitCarouselCardStyle(): Record<string, string> {
      const m = this.orbitModelSlides[this.servicesSlideIndex];
      const h = m?.hue ?? 200;
      return {
        '--orbit-hue': String(h),
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
          },
          {
            title: '天基天文时域模型',
            params: '80 亿参数',
            org: '国家天文台、广西大学、之江实验室',
            hue: 218,
          },
          {
            title: '量子抗干扰加密算法',
            params: '',
            org: '之江实验室',
            hue: 262,
          },
          {
            title: '遥感图像融合算法',
            params: '',
            org: '宁波大学',
            hue: 192,
          },
          {
            title: '航天多模态模型',
            params: '3 亿参数',
            org: '航天体系院',
            hue: 206,
          },
          {
            title: '千问大语言模型',
            params: '6 亿参数',
            org: '国星宇航',
            hue: 178,
          },
          {
            title: '太空云盘',
            params: '',
            org: '太空字节',
            hue: 188,
          },
          {
            title: '伏羲气象模型',
            params: '1.5 亿参数',
            org: '复旦大学',
            hue: 168,
          },
          {
            title: 'L0-L4 遥感图像处理算法',
            params: '',
            org: '之江实验室',
            hue: 208,
          },
          {
            title: '地表要素提取模型',
            params: '',
            org: '之江实验室',
            hue: 152,
          },
        ];
      }
      return [
        {
          title: 'Space-based remote sensing model',
          params: '8B parameters',
          org: 'Zhejiang Lab, BNU, HKU, aerospace institute',
          hue: 198,
        },
        {
          title: 'Space-based astronomical time-domain model',
          params: '8B parameters',
          org: 'NAOC, Guangxi University, Zhejiang Lab',
          hue: 218,
        },
        {
          title: 'Quantum anti-interference encryption',
          params: '',
          org: 'Zhejiang Lab',
          hue: 262,
        },
        {
          title: 'Remote sensing image fusion',
          params: '',
          org: 'Ningbo University',
          hue: 192,
        },
        {
          title: 'Aerospace multimodal model',
          params: '300M parameters',
          org: 'Aerospace institute',
          hue: 206,
        },
        {
          title: 'Qwen large language model',
          params: '600M parameters',
          org: 'Guoxing Aerospace',
          hue: 178,
        },
        {
          title: 'Space cloud storage',
          params: '',
          org: 'Space Byte',
          hue: 188,
        },
        {
          title: 'Fuxi meteorological model',
          params: '150M parameters',
          org: 'Fudan University',
          hue: 168,
        },
        {
          title: 'L0–L4 remote sensing processing',
          params: '',
          org: 'Zhejiang Lab',
          hue: 208,
        },
        {
          title: 'Land surface feature extraction',
          params: '',
          org: 'Zhejiang Lab',
          hue: 152,
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
  mounted() {
    // 用普通对象存动画状态（非响应式，避免每帧触发 Vue 的 setter）
    const state = { angle: -Math.PI / 2, rafId: 0 };
    (this as any)._sat = state;

    this.$nextTick(() => {
      this.startOrbit();
      this.startRoadmapRotation();
      this.startServicesCarousel();
    });
  },
  beforeDestroy() {
    const s = (this as any)._sat;
    if (s) cancelAnimationFrame(s.rafId);
    if (this.roadmapTimer) window.clearInterval(this.roadmapTimer);
    if (this.servicesTimer) window.clearInterval(this.servicesTimer);
  },
  methods: {
    startOrbit() {
      const state = (this as any)._sat as { angle: number; rafId: number };

      // 容器尺寸（与 CSS .sat-visual 保持一致）
      const SIZE   = 320;   // px（已同步更新 CSS）
      const RADIUS = 118;   // 内环轨道半径（inner ring inset=32px → 160-32=128, 保留10px间距）
      const CX     = SIZE / 2;
      const CY     = SIZE / 2;
      const SAT_W  = 128;  // 卫星图片宽度（CSS 已同步）
      const SAT_H  = 90;   // 近似高度

      // 速度：正常 0.0042 rad/frame（约 12.5s/圈 @60fps），悬停减速
      const tick = () => {
        const speed = this.satHovered ? 0.0016 : 0.0042;
        state.angle += speed;

        const x = CX + RADIUS * Math.cos(state.angle) - SAT_W / 2;
        const y = CY + RADIUS * Math.sin(state.angle) - SAT_H / 2;

        const wrap = this.$refs.satWrap as HTMLElement | undefined;
        if (wrap) {
          wrap.style.left = x + 'px';
          wrap.style.top  = y + 'px';
        }

        state.rafId = requestAnimationFrame(tick);
      };

      state.rafId = requestAnimationFrame(tick);
    },

    startRoadmapRotation() {
      if (this.roadmapTimer) window.clearInterval(this.roadmapTimer);
      this.roadmapTimer = window.setInterval(() => {
        const n = this.roadmapSlides.length;
        this.roadmapIndex = n ? (this.roadmapIndex + 1) % n : 0;
      }, 6400);
    },

    startServicesCarousel() {
      if (this.servicesTimer) window.clearInterval(this.servicesTimer);
      this.servicesTimer = window.setInterval(() => {
        const n = this.orbitModelSlides.length;
        this.servicesSlideIndex = n ? (this.servicesSlideIndex + 1) % n : 0;
      }, 4800);
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
  background: radial-gradient(
    ellipse 80% 60% at 50% 40%,
    rgba(46, 79, 255, 0.08) 0%,
    rgba(5, 8, 26, 0) 70%
  );
}

/* 模块级平台介绍（无玻璃卡片包裹） */
.orbital-platform-lead {
  margin: 0 0 40px;
  max-width: 62rem;
  padding: 0;
  border: none;
  background: none;
  font-size: clamp(15px, 1.45vw, 17px);
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.62);
  letter-spacing: 0.015em;
}

/* ── 布局 ── */
.orbital-layout {
  display: grid;
  grid-template-columns: 1fr minmax(320px, 440px);
  gap: 40px;
  align-items: start;
}

@media (max-width: 1100px) {
  .orbital-layout { grid-template-columns: 1fr; }
}

/* ── 大标题行 ── */
.orbital-headline-row {
  display: flex;
  align-items: flex-start;
  gap: 28px;
  margin-bottom: 52px;
  flex-wrap: wrap;
}

.orbital-heading {
  font-size: clamp(36px, 4.5vw, 60px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #fff;
  margin: 0;
  line-height: 1;
  flex-shrink: 0;
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
  width: 320px;
  height: 320px;
  flex-shrink: 0;
  cursor: crosshair;
  overflow: visible;
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
  border-color: rgba(46, 79, 255, 0.28);
  transform-origin: 50% 50%;
  animation: sat-ring-outer-spin 96s linear infinite;
}

/* 悬停：环变亮（旋转保持） */
.sat-visual--hover .sat-ring--outer {
  border-color: rgba(46, 79, 255, 0.72);
  animation-duration: 72s;
}

@keyframes sat-ring-outer-spin {
  to {
    transform: rotate(360deg);
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px rgba(46, 130, 255, 0.75));
}

/* ── 建设路线轮播 ── */
.orbital-roadmap {
  position: relative;
  max-width: 640px;
  min-height: 168px;
  margin: 40px 0 0;
}

.roadmap-slide {
  margin: 0;
}

.roadmap-kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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
  margin: 0 0 12px;
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1.15;
}

.roadmap-body {
  margin: 0;
  font-size: 17px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.52);
}

.roadmap-progress {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.roadmap-tick {
  flex: 1;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.35s ease, box-shadow 0.35s ease;
}

.roadmap-tick--on {
  background: linear-gradient(90deg, rgba(46, 79, 255, 0.2), #2e4fff);
  box-shadow: 0 0 14px rgba(46, 79, 255, 0.35);
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

/* ── 右侧：部署说明 + 模型轮播卡片 ── */
.constellation-services {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 22px 22px 20px;
  border-radius: 4px;
  align-self: start;
}

.constellation-services__leadtime {
  margin: 0 0 18px;
  padding: 0 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.52);
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
}

.orbit-carousel__card {
  --orbit-hue: 200;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(46, 79, 255, 0.22);
  background: rgba(2, 6, 18, 0.65);
  margin-bottom: 14px;
  min-height: 280px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.orbit-carousel__thumb {
  flex-shrink: 0;
  width: 100%;
  min-height: 168px;
  aspect-ratio: 16 / 10;
  max-height: 220px;
  background:
    radial-gradient(ellipse 85% 130% at 18% 38%, hsla(var(--orbit-hue), 78%, 58%, 0.38), transparent 58%),
    radial-gradient(circle at 82% 18%, hsla(calc(var(--orbit-hue) + 40), 70%, 48%, 0.28), transparent 48%),
    linear-gradient(165deg, rgba(8, 14, 32, 0.95) 0%, rgba(4, 10, 24, 0.98) 100%);
  position: relative;
}

.orbit-carousel__thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
  background-size: 12px 12px;
  opacity: 0.4;
  pointer-events: none;
}

.orbit-carousel__body {
  padding: 14px 16px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}

.orbit-carousel__name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.35;
}

.orbit-carousel__params {
  margin: 0;
  font-size: 12px;
  font-family: monospace;
  color: #2e4fff;
  letter-spacing: 0.04em;
}

.orbit-carousel__org {
  margin: 2px 0 0;
  font-size: 11px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.4);
}

.orbit-carousel__dots {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.orbit-carousel__dot {
  width: 7px;
  height: 7px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
}

.orbit-carousel__dot:hover {
  background: rgba(255, 255, 255, 0.2);
}

.orbit-carousel__dot--active {
  background: #2e4fff;
  box-shadow: 0 0 12px rgba(46, 79, 255, 0.5);
  transform: scale(1.1);
}

.orbit-card-fade-enter-active,
.orbit-card-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.orbit-card-fade-enter,
.orbit-card-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

<!-- 全局 keyframes，不能 scoped，否则 animation-name 在 Vue 2 里可能找不到 -->
<style>
@keyframes sat-ping-ring {
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0; }
}
</style>
