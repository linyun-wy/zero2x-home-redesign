<template>
  <span
    class="scramble-wrap"
    @mouseenter="startScramble"
    @mouseleave="cancelScramble"
  >{{ displayText }}</span>
</template>

<script lang="ts">
import Vue from 'vue';

// Aino-style glyph set：大写字母 + 数字 + 技术符号
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*<>{}[]\\|/+=-_';

export default Vue.extend({
  name: 'ScrambleText',
  props: {
    text: {
      type: String,
      required: true,
    },
    /** 每帧间隔 ms，越小越快 */
    speed: {
      type: Number,
      default: 25,
    },
    /** 每帧落定字符数，越大收敛越快 */
    settle: {
      type: Number,
      default: 0.45,
    },
  },
  data() {
    return {
      displayText: this.text as string,
      frame: 0,
      timer: null as ReturnType<typeof setInterval> | null,
    };
  },
  watch: {
    text(val: string) {
      clearInterval(this.timer!);
      this.displayText = val;
    },
  },
  methods: {
    startScramble() {
      this.frame = 0;
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        const chars = this.text.split('');
        const settled = Math.floor(this.frame);
        this.displayText = chars
          .map((ch: string, i: number) => {
            // 保留空格和分隔符原样
            if (' /.-·|'.includes(ch)) return ch;
            if (i < settled) return this.text[i];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
        this.frame += this.settle;
        if (this.frame >= this.text.length) {
          clearInterval(this.timer!);
          this.displayText = this.text;
        }
      }, this.speed);
    },
    cancelScramble() {
      if (this.timer) clearInterval(this.timer);
      this.displayText = this.text;
    },
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
});
</script>

<style scoped>
.scramble-wrap {
  display: inline;
  cursor: crosshair;
  font-family: inherit;
  /* 等宽字体让随机字符不跳动宽度 */
  font-variant-numeric: tabular-nums;
}
</style>
