<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mouse = ref({ x: -1000, y: -1000 });

let animationFrameId: number;
let width = window.innerWidth;
let height = window.innerHeight;

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const fontSize = 16;
let columns = Math.ceil(width / fontSize);
let rows = Math.ceil(height / fontSize);

// English keywords for science and research
const keywords = [
  'EMPOWERING RESEARCH', 'OPEN SCIENCE', 'COMPUTING POWER', 'DATA', 'DRIVING INNOVATION',
  'DEEP INTEGRATION', 'SCIENTIFIC INNOVATION', 'MODEL', 'ONLINE RESEARCH'
];

interface ActiveKeyword {
  word: string;
  x: number;
  y: number;
  startTime: number;
  duration: number;
  opacity: number;
}

const activeKeyword = ref<ActiveKeyword | null>(null);
let lastKeywordTime = 0;

interface Cell {
  char: string;
  opacity: number;
}

let grid: Cell[][] = [];

const isDarkMode = () => document.documentElement.classList.contains('dark');

// Cache card bounding rect to avoid querying the DOM every frame
let cachedCardRect: DOMRect | null = null;
let lastCardRectUpdate = 0;

const getCardRect = (): DOMRect | null => {
  const now = Date.now();
  if (now - lastCardRectUpdate > 300) {
    const card = document.querySelector('.glass-card');
    cachedCardRect = card ? card.getBoundingClientRect() : null;
    lastCardRectUpdate = now;
  }
  return cachedCardRect;
};

// Returns true if pixel coords (px, py) fall inside the card + padding
const isInsideCard = (px: number, py: number, padding = 16): boolean => {
  const rect = getCardRect();
  if (!rect) return false;
  return px >= rect.left - padding && px <= rect.right + padding &&
         py >= rect.top  - padding && py <= rect.bottom + padding;
};

const initGrid = () => {
  columns = Math.ceil(width / fontSize);
  rows = Math.ceil(height / fontSize);
  grid = [];
  for (let i = 0; i < columns; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: 0.05
      };
    }
  }
};

const resize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  if (canvasRef.value) {
    canvasRef.value.width = width;
    canvasRef.value.height = height;
    initGrid();
  }
};

const handleMouseMove = (e: MouseEvent) => {
  mouse.value = { x: e.clientX, y: e.clientY };

  const now = Date.now();
  // Don't trigger keywords when mouse is hovering over the card
  if (!activeKeyword.value && now - lastKeywordTime > 1500 && !isInsideCard(e.clientX, e.clientY)) {
    const col = Math.floor(e.clientX / fontSize);
    const row = Math.floor(e.clientY / fontSize);
    const word = keywords[Math.floor(Math.random() * keywords.length)];
    const startCol = col - Math.floor(word.length / 2);

    activeKeyword.value = {
      word,
      x: startCol,
      y: row,
      startTime: now,
      duration: 3500,
      opacity: 0
    };
    lastKeywordTime = now;
  }
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', handleMouseMove);
  resize();

  const render = (time: number) => {
    ctx.clearRect(0, 0, width, height);

    const now = Date.now();
    const dark = isDarkMode();

    // Theme-aware colors
    // Light: deep blue on white  Dark: light blue-gray on near-black
    const charColor = dark ? '180, 200, 255' : '37, 99, 235';
    const keywordColor = dark ? '120, 170, 255' : '37, 99, 235';

    // In dark mode keep same density as light, only change color
    const baseWaveAmp = 0.04;
    const baseWaveMid = dark ? 0.10 : 0.08;
    const mouseBoost   = dark ? 0.45 : 0.40;
    const keywordBoost = 0.9;

    // Active keyword: only track fade-out; reveal is handled per-character below
    if (activeKeyword.value) {
      const elapsed = now - activeKeyword.value.startTime;
      const { duration } = activeKeyword.value;

      if (elapsed > duration - 900) {
        // Fade out
        activeKeyword.value.opacity = Math.max(0, (duration - elapsed) / 900);
      } else {
        activeKeyword.value.opacity = 1;
      }

      if (elapsed >= duration) {
        activeKeyword.value = null;
      }
    }

    // Scramble speed: a new random char every ~70ms, offset per column so chars differ
    const scrambleTickBase = Math.floor(now / 70);

    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const cell = grid[i][j];
        if (!cell) continue;

        const x = i * fontSize + fontSize / 2;
        const y = j * fontSize + fontSize / 2;

        const distToMouse = Math.sqrt((x - mouse.value.x) ** 2 + (y - mouse.value.y) ** 2);
        const wave = Math.sin(time * 0.0015 + i * 0.15 + j * 0.1) * baseWaveAmp + baseWaveMid;

        let targetOpacity = wave;
        let isKeywordCell = false;
        let keywordChar = '';
        let keywordOpacity = 0;
        let isScrambling = false;

        if (activeKeyword.value && j === activeKeyword.value.y) {
          const { x: kwX, word, opacity: fadeOpacity, startTime } = activeKeyword.value;
          if (i >= kwX && i < kwX + word.length) {
            const charIndex = i - kwX;
            const elapsed = now - startTime;

            // Each character locks in sequentially; total reveal takes 800ms
            const revealDuration = 800;
            const charLockTime = (charIndex / word.length) * revealDuration;

            isKeywordCell = true;

            if (elapsed >= charLockTime) {
              // Locked: show the correct character
              keywordChar = word[charIndex];
              // Snap in quickly after locking (80ms micro fade-in)
              const lockRatio = Math.min(1, (elapsed - charLockTime) / 80);
              keywordOpacity = fadeOpacity * lockRatio;
            } else {
              // Still scrambling: cycle through random chars
              isScrambling = true;
              keywordChar = chars[(scrambleTickBase + charIndex * 7 + i * 3) % chars.length];
              keywordOpacity = fadeOpacity * 0.5;
            }

            targetOpacity = wave + keywordBoost;
          }
        }

        if (distToMouse < 150) {
          const proximity = 1 - distToMouse / 150;
          targetOpacity = Math.max(targetOpacity, wave + proximity * mouseBoost);
        }

        // Skip keyword chars that fall inside the card
        const cellInCard = isInsideCard(x, y);

        if (isKeywordCell && !cellInCard && keywordOpacity > 0.02) {
          if (isScrambling) {
            // Scrambling chars: smaller, dimmer, no bold — subtle "flipping" feel
            ctx.fillStyle = `rgba(${keywordColor}, ${keywordOpacity})`;
            ctx.font = `${fontSize - 3}px "JetBrains Mono", monospace`;
          } else {
            // Locked chars: bold, full color
            ctx.fillStyle = `rgba(${keywordColor}, ${keywordOpacity})`;
            ctx.font = `bold ${fontSize - 2}px "JetBrains Mono", monospace`;
          }
          ctx.fillText(keywordChar, x, y);
        } else {
          if (distToMouse < 150 && Math.random() > 0.95) {
            cell.char = chars[Math.floor(Math.random() * chars.length)];
          } else if (Math.random() > 0.9995) {
            cell.char = chars[Math.floor(Math.random() * chars.length)];
          }
          ctx.fillStyle = `rgba(${charColor}, ${cell.opacity})`;
          ctx.font = `${fontSize - 4}px "JetBrains Mono"`;
          ctx.fillText(cell.char, x, y);
        }

        cell.opacity += (targetOpacity - cell.opacity) * 0.1;
      }
    }

    animationFrameId = requestAnimationFrame(render);
  };

  animationFrameId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  window.removeEventListener('mousemove', handleMouseMove);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-50 dark:opacity-55"
  />
</template>
