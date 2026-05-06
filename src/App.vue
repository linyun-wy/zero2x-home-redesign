<template>
  <div class="font-sans bg-[#F9FAF9]" style="overflow-x:hidden;">
    <!-- 全局头部导航 -->
    <Header />

    <!-- 主视图区域（顶部留出 80px 给 fixed 导航） -->
    <main style="padding-top:80px;">
      <router-view />
    </main>

    <!-- 全局页尾 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './components/views/common/Header.vue';
import Footer from './components/views/common/Footer.vue';
</script>

<style>
/* 全局平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>
