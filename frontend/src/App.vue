<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useTheme } from './composables/useTheme'

import Preloader from './components/Preloader.vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'

gsap.registerPlugin(ScrollTrigger)

const isReady = ref(false)
const { initTheme } = useTheme()
let lenis = null
let tickerCallback = null

function handlePreloaderComplete() {
  isReady.value = true
  if (lenis) {
    lenis.start()
  }
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 100)
}

function scrollToSection(target) {
  if (lenis) {
    lenis.scrollTo(target, {
      offset: 0,
      duration: 1.25,
    })
  } else {
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  initTheme()
  window.scrollTo(0, 0)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Lock scrolling while preloader signature animation plays
    lenis.stop()

    lenis.on('scroll', ScrollTrigger.update)

    tickerCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)
  }
})

onBeforeUnmount(() => {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback)
  }
  if (lenis) {
    lenis.destroy()
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-black dark:text-white transition-colors duration-300">
    <!-- 1. Pure Black SVG Signature Preloader (00:00 - 00:06) -->
    <Preloader @complete="handlePreloaderComplete" />

    <!-- 2. Minimal Top Navbar with Signature Logo & Staggered Links -->
    <Navbar :isReady="isReady" @navigate="scrollToSection" />

    <!-- 3. Main Smooth-Scrolled Portfolio Sections (1:1 Video Choreography) -->
    <main>
      <HeroSection :isReady="isReady" @navigate="scrollToSection" />
      <ServicesSection @navigate="scrollToSection" />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </main>
  </div>
</template>
