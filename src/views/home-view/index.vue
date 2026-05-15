<template>
  <div class="home-container">
    <!-- 自定义光标（仅首页）-->
    <CustomCursor />

    <home-zero2x></home-zero2x>
    <home-021></home-021>
    <home-models></home-models>
    <home-haina></home-haina>
    <home-constellation />
    <home-cases></home-cases>
    <home-events></home-events>
  </div>
</template>

<script setup lang="ts">
import HomeZero2x from './home-zero2x.vue';
import Home021 from './home-021.vue';
import HomeModels from './home-models.vue';
import HomeHaina from './home-haina.vue';
import HomeConstellation from './home-constellation.vue';
import HomeCases from './home-cases.vue';
import HomeEvents from './home-events.vue';
import CustomCursor from '../../components/CustomCursor.vue';
</script>

<style scoped>
.home-container {
  /* 基础背景色 */
  background: #f9faf9;
  color: var(--text-primary);
}
</style>
