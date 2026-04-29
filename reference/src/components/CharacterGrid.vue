<template>
  <div class="character-grid-container absolute inset-0 overflow-hidden pointer-events-none" ref="container">
    <div class="character-grid font-mono text-[10px] leading-none whitespace-pre select-none opacity-20"
         :style="gridStyle">
      {{ gridText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CharacterGrid',
  data() {
    return {
      cols: 0,
      rows: 0,
      gridText: '',
      chars: '0123456789#$@%&*+=/\\:;.',
      mouseX: -1000,
      mouseY: -1000,
      rafId: null
    };
  },
  computed: {
    gridStyle() {
      return {
        display: 'block',
        width: '100%',
        height: '100%',
        color: 'var(--color-zero-moss)'
      };
    }
  },
  mounted() {
    this.calculateGrid();
    window.addEventListener('resize', this.calculateGrid);
    window.addEventListener('mousemove', this.handleMouseMove);
    this.animate();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateGrid);
    window.removeEventListener('mousemove', this.handleMouseMove);
    cancelAnimationFrame(this.rafId);
  },
  methods: {
    calculateGrid() {
      const container = this.$refs.container;
      if (!container) return;
      
      const charWidth = 6; // Approximate width of a character at 10px
      const charHeight = 10; // Approximate height
      
      this.cols = Math.floor(container.clientWidth / charWidth);
      this.rows = Math.floor(container.clientHeight / charHeight);
      
      this.generateInitialGrid();
    },
    generateInitialGrid() {
      let text = '';
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          text += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        text += '\n';
      }
      this.gridText = text;
    },
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    animate() {
      this.updateGrid();
      this.rafId = requestAnimationFrame(this.animate);
    },
    updateGrid() {
      if (this.cols === 0 || this.rows === 0) return;
      
      const container = this.$refs.container;
      const rect = container.getBoundingClientRect();
      const relX = this.mouseX - rect.left;
      const relY = this.mouseY - rect.top;
      
      const charWidth = 6;
      const charHeight = 10;
      
      const mouseCol = Math.floor(relX / charWidth);
      const mouseRow = Math.floor(relY / charHeight);
      
      let newText = '';
      const gridArray = this.gridText.split('\n');
      
      for (let r = 0; r < this.rows; r++) {
        let rowStr = gridArray[r] || '';
        let newRow = '';
        
        for (let c = 0; c < this.cols; c++) {
          const dist = Math.sqrt(Math.pow(c - mouseCol, 2) + Math.pow(r - mouseRow, 2));
          
          if (dist < 8) {
            // Disturbed by mouse
            newRow += this.chars[Math.floor(Math.random() * this.chars.length)];
          } else if (Math.random() > 0.995) {
            // Random flicker
            newRow += this.chars[Math.floor(Math.random() * this.chars.length)];
          } else {
            newRow += rowStr[c] || ' ';
          }
        }
        newText += newRow + '\n';
      }
      this.gridText = newText;
    }
  }
};
</script>

<style scoped>
.character-grid-container {
  z-index: 1;
}
.character-grid {
  line-height: 10px;
  letter-spacing: 0;
}
</style>
