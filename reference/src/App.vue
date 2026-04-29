<template>
  <div class="relative min-h-screen font-sans selection:bg-zero-ink selection:text-zero-paper overflow-x-hidden">
    <!-- Global Grid Overlay -->
    <div class="fixed inset-0 grid-lines pointer-events-none z-0 opacity-20"></div>
    
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 w-full z-50 bg-zero-paper border-b border-zero-line">
      <div class="flex h-20 items-center px-8 justify-between">
        <div class="flex items-center gap-6">
          <div class="w-8 h-8 bg-zero-ink flex items-center justify-center">
            <span class="text-zero-paper font-mono text-xs font-bold">Z</span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold tracking-tighter uppercase text-sm">zero2x</span>
            <span class="text-micro text-zero-moss opacity-50">Scientific Research Lab</span>
          </div>
        </div>
        
        <div class="hidden lg:flex items-center h-full">
          <a v-for="item in ['Vision', 'Infrastructure', 'Models', 'Contact']" 
             :key="item" 
             href="#" 
             class="px-10 h-20 flex items-center text-micro hover:bg-zero-ink hover:text-zero-paper transition-all duration-300 border-l border-zero-line">
            {{ item }}
          </a>
          <div class="border-l border-r border-zero-line h-20 flex items-center px-10">
             <span class="text-micro opacity-40">v2.1.0_vue</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-micro text-zero-moss hidden sm:block opacity-40">UTC+8 / 07:33:29</span>
          <button class="w-10 h-10 border border-zero-line flex items-center justify-center hover:bg-zero-ink hover:text-white transition-colors">
            <PlusIcon :size="16" />
          </button>
        </div>
      </div>
    </nav>

    <main class="relative z-10 pt-20">
      <!-- HERO SECTION: AINO STYLE -->
      <section class="relative border-b border-zero-line min-h-screen flex flex-col">
        <div class="grid-marker absolute"></div>
        <div class="flex justify-between items-center px-8 py-5 border-b border-zero-line bg-zero-paper/80 backdrop-blur-sm sticky top-20 z-20">
          <div class="flex items-center gap-4">
            <span class="font-mono text-[10px] opacity-30">SECTION_ID</span>
            <span class="text-micro font-bold text-zero-ink">MISSION_STATEMENT</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-micro text-zero-moss">001</span>
            <div class="w-2 h-2 bg-zero-ink/10 rounded-full"></div>
          </div>
        </div>

        <div class="flex-1 flex flex-col relative">
          <!-- Character Grid Background (Geek Style) -->
          <CharacterGrid />

          <!-- Hero Content: Integrated zero2x, Vision, and Features -->
          <div class="flex-1 relative z-10 border-b border-zero-line flex flex-col">
            <div class="p-8 md:p-16 flex-1 flex flex-col justify-center">
              <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                
                <!-- Left: zero2x + Vision -->
                <div class="lg:col-span-7">
                  <div class="group cursor-crosshair relative overflow-hidden inline-block mb-6">
                    <div class="absolute inset-0 bg-zero-moss translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]"></div>
                    <h1 class="text-[8vw] font-bold leading-[0.8] uppercase tracking-tighter relative z-10 group-hover:text-zero-paper transition-colors duration-500 pr-4">
                      zero2x
                    </h1>
                  </div>

                  <h2 class="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.85] mb-12">
                    重新定义<br />
                    <span class="text-zero-moss">科研的未来</span>
                  </h2>
                  
                  <div class="flex flex-col md:flex-row gap-12 items-start md:items-center">
                    <div class="max-w-xs">
                      <span class="text-micro text-zero-moss mb-4 block font-bold tracking-[0.3em]">Manifesto v2.4</span>
                      <p class="text-sm text-white/40 leading-relaxed">
                        我们致力于为科研工作者提供更智能、更集成的工具与环境，打破传统科研的边界。
                      </p>
                    </div>
                    <button class="shrink-0 w-28 h-28 rounded-full border border-zero-moss text-zero-moss flex flex-col items-center justify-center gap-2 hover:bg-zero-moss hover:text-zero-paper transition-all duration-500 group">
                      <ArrowDownIcon :size="18" class="group-hover:translate-y-1 transition-transform" />
                      <span class="text-[9px] font-mono uppercase tracking-widest">Explore</span>
                    </button>
                  </div>
                </div>

                <!-- Right: Hero Features (Integrated) -->
                <div class="lg:col-span-5 grid grid-cols-1 gap-6">
                  <div v-for="(item, idx) in heroFeatures" :key="idx"
                       class="p-8 border border-zero-line bg-zero-paper/40 backdrop-blur-md flex flex-col justify-between group cursor-pointer hover:border-zero-moss transition-all duration-500 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:text-zero-moss transition-all">
                      <ArrowUpRightIcon :size="20" />
                    </div>
                    <div class="mb-8">
                      <span class="text-micro text-zero-moss mb-4 block">{{ item.tag }}</span>
                      <h3 class="text-2xl font-bold uppercase tracking-tighter mb-2">{{ item.title }}</h3>
                      <p class="text-xs text-white/40 group-hover:text-white/70 leading-relaxed">{{ item.desc }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-1 h-1 bg-zero-moss rounded-full animate-pulse"></div>
                      <span class="text-micro text-zero-moss/60">{{ item.status }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ORBITAL SECTION -->
      <section class="relative border-b border-zero-line min-h-screen flex flex-col bg-zero-paper text-zero-ink group/orbital">
        <div class="grid-marker absolute"></div>
        <div class="flex justify-between items-center px-8 py-5 border-b border-white/10 bg-zero-paper/80 backdrop-blur-sm sticky top-20 z-20">
          <div class="flex items-center gap-4">
            <span class="font-mono text-[10px] opacity-30">SECTION_ID</span>
            <span class="text-micro font-bold text-zero-moss">ORBITAL_INFRASTRUCTURE</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-micro text-zero-moss">002</span>
            <div class="w-2 h-2 bg-zero-moss/20 rounded-full"></div>
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-center p-8 md:p-16 relative overflow-hidden">
          <div class="absolute inset-0 opacity-5 pointer-events-none">
            <div class="grid-lines w-full h-full"></div>
          </div>
          
          <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            <!-- Left: Text Content + Integrated Animation -->
            <div class="lg:col-span-8">
              <span class="text-micro text-zero-sand mb-8 block tracking-[0.4em]">Infrastructure_Module_02</span>
              
              <div class="flex flex-col md:flex-row items-start md:items-center gap-12 mb-12">
                <h2 class="text-6xl md:text-8xl font-bold leading-[0.85] uppercase tracking-tighter">
                  天基计算<br />
                  <span class="text-zero-moss">研发环境</span>
                </h2>
                
                <!-- Integrated Floating Satellite Animation -->
                <div class="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group/sat cursor-pointer">
                  <!-- Orbital Rings -->
                  <div class="absolute inset-0 border border-dashed border-zero-moss/10 rounded-full animate-spin-slow group-hover/sat:border-zero-moss/30 transition-colors duration-700"></div>
                  <div class="absolute inset-8 border border-dashed border-zero-sand/10 rounded-full animate-spin-reverse-slow group-hover/sat:border-zero-sand/30 transition-colors duration-700"></div>
                  
                  <!-- Floating Satellite Image -->
                  <div class="relative z-10 w-48 h-48 md:w-56 md:h-56 transition-all duration-1000 ease-out group-hover/sat:animate-float-space">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Iridium_Satellite.png/640px-Iridium_Satellite.png" 
                      alt="Satellite" 
                      class="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,255,65,0.4)] filter brightness-110 group-hover/sat:brightness-125 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    
                    <!-- Data Link Pulse -->
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-0 group-hover/sat:opacity-100 transition-opacity duration-700">
                      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-zero-moss rounded-full animate-ping"></div>
                      <div class="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-zero-sand rounded-full animate-ping" style="animation-delay: 0.5s"></div>
                    </div>
                  </div>
                  
                  <!-- Orbiting HUD Elements -->
                  <div class="absolute inset-0 pointer-events-none">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div class="w-[1px] h-8 bg-gradient-to-b from-transparent to-zero-moss"></div>
                      <span class="text-[8px] font-mono text-zero-moss mt-2">LINK_ESTABLISHED</span>
                    </div>
                  </div>
                </div>
              </div>

              <p class="text-xl text-white/60 max-w-xl mb-16 leading-snug">
                确保您在地面调试好的模型，能够无缝部署并稳定运行于太空环境中。天地无缝衔接，实现真正的全球化科研协同。
              </p>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-12">
                <div class="flex flex-col gap-2">
                  <span class="text-micro opacity-40">Sync Protocol</span>
                  <span class="text-lg font-bold text-zero-moss">L_ORBIT_V4</span>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="text-micro opacity-40">Latency Target</span>
                  <span class="text-lg font-bold text-zero-sand">&lt; 20MS</span>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="text-micro opacity-40">Uplink Speed</span>
                  <span class="text-lg font-bold text-zero-moss">10 GBPS</span>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="text-micro opacity-40">Nodes Active</span>
                  <span class="text-lg font-bold text-zero-sand">1,024+</span>
                </div>
              </div>
            </div>

            <!-- Right: Secondary Visual / Stats -->
            <div class="lg:col-span-4 hidden lg:block">
              <div class="p-8 border border-zero-line bg-zero-paper/40 backdrop-blur-md">
                <div class="flex justify-between items-center mb-8">
                  <span class="text-micro text-zero-moss">Real-time Telemetry</span>
                  <div class="flex gap-1">
                    <div class="w-1 h-3 bg-zero-moss animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-1 h-5 bg-zero-moss animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-1 h-2 bg-zero-moss animate-bounce" style="animation-delay: 0.3s"></div>
                  </div>
                </div>
                <div class="space-y-6">
                  <div v-for="i in 3" :key="i" class="flex justify-between items-end border-b border-zero-line pb-4">
                    <div class="flex flex-col">
                      <span class="text-[10px] opacity-40 uppercase tracking-widest">Channel_0{{i}}</span>
                      <span class="text-sm font-mono">ACTIVE_LINK_STABLE</span>
                    </div>
                    <span class="text-zero-moss font-mono text-xs">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MODELS SECTION -->
      <section class="relative border-b border-zero-line min-h-screen flex flex-col bg-zero-paper">
        <div class="grid-marker absolute"></div>
        <div class="flex justify-between items-center px-8 py-5 border-b border-zero-line bg-zero-paper/80 backdrop-blur-sm sticky top-20 z-20">
          <div class="flex items-center gap-4">
            <span class="font-mono text-[10px] opacity-30">SECTION_ID</span>
            <span class="text-micro font-bold text-zero-moss">SCIENTIFIC_INTELLIGENCE</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-micro text-zero-moss">003</span>
            <div class="w-2 h-2 bg-zero-moss/20 rounded-full"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 divide-x divide-zero-line flex-1">
          <div v-for="(item, idx) in modelFeatures" :key="idx"
               class="p-16 flex flex-col gap-16 group cursor-pointer hover:bg-zero-moss hover:text-zero-paper transition-all duration-700">
            <div class="flex justify-between items-center">
              <span class="text-micro text-zero-moss group-hover:text-zero-paper/50">{{ item.tag }}</span>
              <div class="w-2 h-2 bg-zero-moss/10 group-hover:bg-zero-paper/20 rounded-full"></div>
            </div>
            <div class="flex-1">
              <h3 class="text-4xl lg:text-5xl font-bold mb-8 uppercase tracking-tighter">{{ item.title }}</h3>
              <p class="text-base leading-relaxed opacity-40 group-hover:opacity-80">{{ item.desc }}</p>
            </div>
            <div class="flex justify-between items-end">
              <div class="w-12 h-12 border border-current opacity-20 flex items-center justify-center group-hover:opacity-100 transition-opacity">
                <ChevronRightIcon :size="18" />
              </div>
              <div class="flex flex-col items-end">
                <span class="text-micro opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Request Access</span>
                <span class="font-mono text-[10px] opacity-20">MODEL_ID: {{ 104 + idx }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="bg-zero-paper text-zero-ink p-16 md:p-32 relative overflow-hidden border-t border-zero-line">
        <div class="absolute inset-0 opacity-5 pointer-events-none">
          <div class="grid-lines w-full h-full"></div>
        </div>
        
        <div class="max-w-7xl mx-auto relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-24">
            <div class="lg:col-span-7">
              <h2 class="text-7xl md:text-9xl font-bold leading-[0.8] mb-16 uppercase tracking-tighter">
                JOIN THE<br />
                <span class="text-zero-moss">REVOLUTION</span>
              </h2>
              <div class="flex flex-wrap gap-6">
                <button class="border border-white/20 px-12 py-6 text-micro hover:bg-zero-moss hover:text-zero-paper transition-all duration-500">
                  Contact Us
                </button>
                <button class="bg-zero-moss text-zero-paper px-12 py-6 text-micro hover:bg-zero-sand transition-all duration-500">
                  Get Started
                </button>
              </div>
            </div>
            
            <div class="lg:col-span-5 grid grid-cols-2 gap-16">
              <div class="flex flex-col gap-8">
                <span class="text-micro text-white/30 border-b border-white/10 pb-4">Navigation</span>
                <div class="flex flex-col gap-4 text-sm font-medium">
                  <a href="#" class="hover:text-zero-sand transition-colors">Platform</a>
                  <a href="#" class="hover:text-zero-sand transition-colors">Research</a>
                  <a href="#" class="hover:text-zero-sand transition-colors">Infrastructure</a>
                  <a href="#" class="hover:text-zero-sand transition-colors">About</a>
                </div>
              </div>
              <div class="flex flex-col gap-8">
                <span class="text-micro text-white/30 border-b border-white/10 pb-4">Connect</span>
                <div class="flex flex-col gap-4 text-sm font-medium">
                  <a href="#" class="hover:text-zero-sand transition-colors">Twitter / X</a>
                  <a href="#" class="hover:text-zero-sand transition-colors">LinkedIn</a>
                  <a href="#" class="hover:text-zero-sand transition-colors">GitHub</a>
                  <a href="#" class="hover:text-zero-sand transition-colors">Discord</a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-40 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div class="flex items-center gap-6">
              <div class="w-8 h-8 bg-white flex items-center justify-center">
                <span class="text-zero-ink font-mono text-xs font-bold">Z</span>
              </div>
              <div class="flex flex-col">
                <span class="text-micro text-white/40">© 2026 zero2x corp.</span>
                <span class="text-micro text-white/20">Built for the future of science.</span>
              </div>
            </div>
            <div class="flex gap-12">
              <span class="text-micro opacity-30 hover:opacity-100 transition-opacity cursor-pointer">Privacy</span>
              <span class="text-micro opacity-30 hover:opacity-100 transition-opacity cursor-pointer">Terms</span>
              <span class="text-micro opacity-30 hover:opacity-100 transition-opacity cursor-pointer">Legal</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import CharacterGrid from './components/CharacterGrid.vue';
import { 
  Plus as PlusIcon, 
  ArrowUpRight as ArrowUpRightIcon, 
  ArrowDown as ArrowDownIcon,
  Satellite as SatelliteIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue';

export default {
  name: 'App',
  components: {
    CharacterGrid,
    PlusIcon,
    ArrowUpRightIcon,
    ArrowDownIcon,
    SatelliteIcon,
    ChevronRightIcon
  },
  data() {
    return {
      heroFeatures: [
        { 
          tag: "01.1 / COMPUTE", 
          title: "开放算力", 
          desc: "共享大算力资源池，灵活调用大规模计算资源，轻松完成高复杂度实验。",
          status: "Resource Pool Active"
        },
        { 
          tag: "01.2 / DATA_FLOW", 
          title: "开放数据", 
          desc: "从“下载数据”到“在线科研”的转变，无需下载即可直接分析与处理。",
          status: "Data Stream Live"
        }
      ],
      modelFeatures: [
        { 
          tag: "03.1 / PREDICTION", 
          title: "精准预测", 
          desc: "基于海量科研数据训练，提供物理、生物、材料等多学科的高精度预测能力。" 
        },
        { 
          tag: "03.2 / ASSISTANCE", 
          title: "智能辅助", 
          desc: "自动识别实验异常，辅助论文撰写与专利检索，全方位提升科研产出效率。" 
        },
        { 
          tag: "03.3 / CROSS_DOMAIN", 
          title: "跨域融合", 
          desc: "打破学科壁垒，通过多模态大模型实现跨领域知识的深度关联与创新启发。" 
        }
      ]
    };
  }
};
</script>

<style>
.animate-spin-slow {
  animation: spin 40s linear infinite;
}
.animate-spin-fast {
  animation: spin 10s linear infinite;
}
.animate-spin-reverse-slow {
  animation: spin-reverse 60s linear infinite;
}
.animate-spin-reverse-fast {
  animation: spin-reverse 15s linear infinite;
}
.animate-float-space {
  animation: float-space 6s ease-in-out infinite;
}
@keyframes float-space {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(2deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
</style>
