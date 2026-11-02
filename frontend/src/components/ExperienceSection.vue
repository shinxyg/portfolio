<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const titleWrapRef = ref(null)
const timelineContainerRef = ref(null)
const lineFillRef = ref(null)
const arrowFollowerRef = ref(null)
const itemsRef = ref([])

let mm = null

function setItemRef(el, idx) {
  if (el) itemsRef.value[idx] = el
}

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // 1. Giant "Experience" title starts large & settles toward top-left
    gsap.fromTo(
      titleWrapRef.value,
      { y: 120, scale: 1.12, transformOrigin: 'left top' },
      {
        y: -45,
        scale: 0.92,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%',
          end: 'top 5%',
          scrub: 0.8,
        },
      }
    )

    // 2. Center vertical line fill + traveling white circle arrow (00:21 -> 00:25)
    gsap.fromTo(
      lineFillRef.value,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainerRef.value,
          start: 'top 55%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      }
    )

    gsap.fromTo(
      arrowFollowerRef.value,
      { top: '0%' },
      {
        top: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainerRef.value,
          start: 'top 55%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      }
    )

    // 3. Alternating left/right items reveal smoothly as the arrow passes them
    itemsRef.value.forEach((itemEl, idx) => {
      const isLeft = portfolioData.experience[idx]?.side === 'left'
      gsap.fromTo(
        itemEl,
        {
          opacity: 0,
          x: isLeft ? -45 : 45,
          y: 30,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: itemEl,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  })
})

onBeforeUnmount(() => {
  if (mm) mm.revert()
})
</script>

<template>
  <section
    id="experience"
    ref="sectionRef"
    class="relative py-28 sm:py-36 px-6 sm:px-12 lg:px-20 video-ambient-bg overflow-hidden"
  >
    <!-- Sticky/Top-Left Giant "Experience" Title (matching 00:19 -> 00:25) -->
    <div class="max-w-7xl mx-auto mb-16 sm:mb-24">
      <div ref="titleWrapRef" class="select-none pointer-events-none will-change-transform">
        <p class="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.35em] text-zinc-500 mb-2">
          MY JOURNEY
        </p>
        <h2
          class="text-[clamp(3.8rem,10.5vw,9rem)] font-extrabold tracking-[-0.04em] leading-[0.88] text-zinc-950 dark:text-white transition-colors duration-300"
        >
          Experience
        </h2>
      </div>
    </div>

    <!-- Center Vertical Line + Alternating Left/Right Entries -->
    <div ref="timelineContainerRef" class="relative max-w-5xl mx-auto py-8">
      <!-- Vertical Center Track Line -->
      <div
        class="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-black/15 dark:bg-white/15"
      >
        <!-- Filled Progress Line -->
        <div
          ref="lineFillRef"
          class="w-full h-full bg-black/60 dark:bg-white/60 origin-top"
        ></div>

        <!-- Traveling White Circle with Down Arrow (↓) matching 00:21 -> 00:25 -->
        <div
          ref="arrowFollowerRef"
          class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.25)] dark:shadow-[0_0_20px_rgba(255,255,255,0.65)] transition-colors duration-300"
        >
          <ArrowDown class="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      </div>

      <!-- Alternating Timeline Items -->
      <div class="space-y-20 sm:space-y-28">
        <div
          v-for="(item, idx) in portfolioData.experience"
          :key="idx"
          :ref="(el) => setItemRef(el, idx)"
          class="relative grid grid-cols-1 md:grid-cols-2 items-start"
        >
          <!-- Left Side Item (Right-aligned on desktop, matching video 00:21, 00:23, 00:25) -->
          <div
            v-if="item.side === 'left'"
            class="pl-12 md:pl-0 md:pr-14 md:text-right"
          >
            <p class="text-[9px] font-mono uppercase tracking-[0.28em] text-zinc-500 mb-1.5">
              {{ item.period }}
            </p>
            <h3 class="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 transition-colors duration-300">
              {{ item.role }}
            </h3>
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400 mb-3 transition-colors duration-300">
              {{ item.company }}
            </p>
            <p class="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-sm md:ml-auto transition-colors duration-300">
              {{ item.description }}
            </p>
          </div>

          <!-- Empty spacer column for alternating layout -->
          <div v-if="item.side === 'left'" class="hidden md:block"></div>
          <div v-if="item.side === 'right'" class="hidden md:block"></div>

          <!-- Right Side Item (Left-aligned on desktop, matching video 00:22, 00:24) -->
          <div
            v-if="item.side === 'right'"
            class="pl-12 md:pl-14 text-left"
          >
            <p class="text-[9px] font-mono uppercase tracking-[0.28em] text-zinc-500 mb-1.5">
              {{ item.period }}
            </p>
            <h3 class="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 transition-colors duration-300">
              {{ item.role }}
            </h3>
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400 mb-3 transition-colors duration-300">
              {{ item.company }}
            </p>
            <p class="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-sm transition-colors duration-300">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
