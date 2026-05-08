<template>
  <section class="orbital-section" style="position:relative;overflow:hidden;">
    <!-- 仅保留深色氛围渐变，去掉字符矩阵背景 -->
    <div class="absolute inset-0 pointer-events-none orbital-gradient-veil" style="z-index:1;"></div>

    <div style="max-width:1320px;margin:0 auto;padding:100px 40px 120px;position:relative;z-index:10;">

      <!-- 模块 tag -->
      <span class="text-micro" style="color:#2e4fff;display:block;margin-bottom:32px;letter-spacing:0.3em;">
        <ScrambleText text="05 / ORBITAL_INFRASTRUCTURE" />
      </span>

      <!-- 主内容区：左侧文字+卫星，右侧遥测面板 -->
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
                text="Three-body"
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
                text="Const. Workspace"
                :base-delay="180"
                :stagger="55"
              />
            </h2>

            <!-- 链路 HUD 置于轨道区上方，避免与卫星轨道重叠遮挡 -->
            <div class="sat-visual-stack">
              <div class="sat-hud-external" aria-hidden="true">
                <div class="sat-hud-line sat-hud-line--down"></div>
                <span class="sat-hud-label">LINK_ESTABLISHED</span>
              </div>

              <!-- 卫星可视化：JS-RAF 精确轨道 + 鼠标交互 -->
              <div
                ref="satVisual"
                class="sat-visual"
                :class="{ 'sat-visual--hover': satHovered }"
                @mouseenter="satHovered = true"
                @mouseleave="satHovered = false; satOnSat = false"
              >
                <!-- 轨道环（悬停时高亮） -->
                <div class="sat-ring sat-ring--outer"></div>
                <div class="sat-ring sat-ring--inner"></div>

                <!-- 中心光点 -->
                <div class="sat-center-dot"></div>

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

                <!-- 悬停时浮现的状态标签 -->
                <div class="sat-hover-badge">
                  <span class="sat-hover-dot"></span>
                  TELEMETRY ACTIVE
                </div>
              </div>
            </div>
          </div>

          <!-- 描述文字 -->
          <p class="orbital-desc" v-reveal="{ delay: 120 }">
            <template v-if="lang === 'zh'">
              确保您在地面调试好的模型，能够无缝部署并稳定运行于太空环境中。天地无缝衔接，实现真正的全球化科研协同。
            </template>
            <template v-else>
              Ensure your ground-validated models deploy seamlessly and run stably in space environments.
              Ground-to-orbit continuity — realizing truly global scientific collaboration.
            </template>
          </p>

          <!-- 底部指标 -->
          <div class="orbital-stats" v-reveal="{ delay: 220 }">
            <div class="ostat">
              <span class="ostat-label">{{ lang === 'zh' ? '同步协议' : 'Sync Protocol' }}</span>
              <span class="ostat-val ostat-val--blue">L_ORBIT_V4</span>
            </div>
            <div class="ostat">
              <span class="ostat-label">{{ lang === 'zh' ? '延迟目标' : 'Latency Target' }}</span>
              <span class="ostat-val ostat-val--white">&lt; 20MS</span>
            </div>
            <div class="ostat">
              <span class="ostat-label">{{ lang === 'zh' ? '上行速率' : 'Uplink Speed' }}</span>
              <span class="ostat-val ostat-val--blue">10 GBPS</span>
            </div>
            <div class="ostat">
              <span class="ostat-label">{{ lang === 'zh' ? '活跃节点' : 'Nodes Active' }}</span>
              <span class="ostat-val ostat-val--white">1,024+</span>
            </div>
          </div>
        </div>

        <!-- 右侧遥测面板 -->
        <div class="telemetry-panel" v-reveal="{ delay: 160, dir: 'right' }">
          <div class="telemetry-header">
            <span class="telemetry-title">{{ lang === 'zh' ? '实时遥测' : 'Real-time Telemetry' }}</span>
            <div class="telemetry-bars">
              <span class="tbar" style="animation-delay:0.1s;"></span>
              <span class="tbar" style="animation-delay:0.2s;height:20px;"></span>
              <span class="tbar" style="animation-delay:0.3s;height:8px;"></span>
            </div>
          </div>
          <div class="telemetry-channels">
            <div class="telemetry-ch" v-for="n in 3" :key="n">
              <div class="telemetry-ch-left">
                <span class="telemetry-ch-id">CHANNEL_0{{ n }}</span>
                <span class="telemetry-ch-status">ACTIVE_LINK_STABLE</span>
              </div>
              <span class="telemetry-ch-val">99.9%</span>
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

export default Vue.extend({
  name: 'HomeNanhu',
  components: { ScrambleText, SplitReveal },
  data() {
    return {
      satHovered: false,
      satOnSat: false,   // 鼠标直接悬停在卫星上
    };
  },
  computed: {
    lang() { return langStore.lang; },
  },
  mounted() {
    // 用普通对象存动画状态（非响应式，避免每帧触发 Vue 的 setter）
    const state = { angle: -Math.PI / 2, rafId: 0 };
    (this as any)._sat = state;

    this.$nextTick(() => { this.startOrbit(); });
  },
  beforeDestroy() {
    const s = (this as any)._sat;
    if (s) cancelAnimationFrame(s.rafId);
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
  },
});
</script>

<style scoped>
/* ── 整体 ── */
.orbital-section {
  background: #050b1a;
  color: #fff;
  min-height: 560px;
}

.orbital-gradient-veil {
  background: radial-gradient(
    ellipse 80% 60% at 50% 40%,
    rgba(46, 79, 255, 0.08) 0%,
    rgba(5, 8, 26, 0) 70%
  );
}

/* ── 布局 ── */
.orbital-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 64px;
  align-items: start;
}

@media (max-width: 1100px) {
  .orbital-layout { grid-template-columns: 1fr; }
}

/* ── 大标题行 ── */
.orbital-headline-row {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  margin-bottom: 40px;
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

/* HUD + 轨道：HUD 在轨道盒上方，不与卫星图层重叠 */
.sat-visual-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-top: 8px;
}

.sat-hud-external {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  pointer-events: none;
}

.sat-hud-line--down {
  width: 1px;
  height: 18px;
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
}

.sat-ring--inner {
  inset: 32px;
  border-color: rgba(255, 255, 255, 0.1);
}

/* 悬停：环变亮 */
.sat-visual--hover .sat-ring--outer { border-color: rgba(46, 79, 255, 0.7); }
.sat-visual--hover .sat-ring--inner { border-color: rgba(255, 255, 255, 0.25); }

/* 中心光点 */
.sat-center-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(46, 79, 255, 0.5);
  box-shadow: 0 0 12px rgba(46, 79, 255, 0.8);
  z-index: 3;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.sat-visual--hover .sat-center-dot {
  transform: scale(1.6);
  box-shadow: 0 0 24px rgba(46, 79, 255, 1);
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
  margin-top: 6px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.sat-visual-stack:has(.sat-visual--hover) .sat-hud-label {
  color: #2e4fff;
}

/* 悬停状态徽章 */
.sat-hover-badge {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-family: monospace;
  letter-spacing: 0.15em;
  color: rgba(46, 79, 255, 0.9);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.sat-visual--hover .sat-hover-badge { opacity: 1; }

.sat-hover-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2e4fff;
  animation: sat-ping-ring 1s ease-out infinite;
}

/* ── 描述 ── */
.orbital-desc {
  font-size: 18px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
  margin: 0 0 56px;
}

/* ── 指标栏 ── */
.orbital-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 40px;
}

@media (max-width: 720px) {
  .orbital-stats { grid-template-columns: repeat(2, 1fr); }
}

.ostat           { display: flex; flex-direction: column; gap: 8px; }
.ostat-label     { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); font-family: monospace; }
.ostat-val       { font-size: 18px; font-weight: 700; font-family: monospace; }
.ostat-val--blue  { color: #2e4fff; }
.ostat-val--white { color: rgba(255,255,255,0.85); }

/* ── 遥测面板 ── */
.telemetry-panel {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  padding: 32px;
  margin-top: 56px;
}

.telemetry-header     { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.telemetry-title      { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #2e4fff; font-family: monospace; }

.telemetry-bars       { display: flex; align-items: flex-end; gap: 3px; height: 20px; }
.tbar                 { display: block; width: 4px; height: 12px; background: #2e4fff; animation: tbar-pulse 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite; }

@keyframes tbar-pulse {
  0%   { transform: scaleY(0.5); opacity: 0.5; }
  40%  { transform: scaleY(1.5); opacity: 1; }
  100% { transform: scaleY(0.5); opacity: 0.5; }
}

.telemetry-channels   { display: flex; flex-direction: column; }
.telemetry-ch         { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 16px 0; }
.telemetry-ch:last-child { border-bottom: none; }
.telemetry-ch-left    { display: flex; flex-direction: column; gap: 4px; }
.telemetry-ch-id      { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.25); font-family: monospace; }
.telemetry-ch-status  { font-size: 13px; font-family: monospace; color: rgba(255,255,255,0.8); }
.telemetry-ch-val     { font-size: 12px; font-family: monospace; color: #2e4fff; }
</style>

<!-- 全局 keyframes，不能 scoped，否则 animation-name 在 Vue 2 里可能找不到 -->
<style>
@keyframes sat-ping-ring {
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0; }
}
</style>
