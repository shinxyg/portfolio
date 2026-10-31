<script setup>
import { ref, watch, nextTick } from 'vue'
import gsap from 'gsap'
import { Menu, X } from 'lucide-vue-next'
import SignatureSvg from './SignatureSvg.vue'
import { portfolioData } from '../data/portfolio'

const props = defineProps({
  isReady: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const navLinksRef = ref([])
const mobileMenuOpen = ref(false)

watch(
  () => props.isReady,
  async (ready) => {
    if (!ready) return
    await nextTick()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set(navLinksRef.value, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      navLinksRef.value,
      { opacity: 0, y: -10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      }
    )
  },
  { immediate: true }
)

function handleNavClick(e, href) {
  e.preventDefault()
  mobileMenuOpen.value = false
  emit('navigate', href)
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 px-6 sm:px-10 lg:px-14 py-5 flex items-center justify-between pointer-events-none"
  >
    <!-- Top-Left Signature Logo Anchor -->
    <a
      id="navbar-logo-anchor"
      href="#hero"
      @click="(e) => handleNavClick(e, '#hero')"
      class="pointer-events-auto relative inline-flex items-center text-white hover:opacity-80 transition-opacity duration-300 focus:outline-none"
      :class="isReady ? 'opacity-100' : 'opacity-0'"
      aria-label="Scroll to top"
    >
      <SignatureSvg className="w-16 sm:w-20 h-auto" :strokeWidth="4.2" />
    </a>

    <!-- Top-Right Navigation Links -->
    <nav
      class="pointer-events-auto hidden md:flex items-center gap-6 lg:gap-8"
      aria-label="Primary Navigation"
    >
      <a
        v-for="(item, index) in portfolioData.navLinks"
        :key="item.label"
        :ref="(el) => { if (el) navLinksRef[index] = el }"
        :href="item.href"
        @click="(e) => handleNavClick(e, item.href)"
        class="opacity-0 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-300 hover:text-white transition-colors duration-300"
      >
        {{ item.label }}
      </a>
    </nav>

    <!-- Mobile Menu Toggle -->
    <button
      type="button"
      class="pointer-events-auto md:hidden text-zinc-200 hover:text-white p-2 focus:outline-none"
      :class="isReady ? 'opacity-100' : 'opacity-0'"
      @click="mobileMenuOpen = !mobileMenuOpen"
      aria-label="Toggle Menu"
    >
      <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
      <X v-else class="w-5 h-5" />
    </button>

    <!-- Mobile Dropdown -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="pointer-events-auto fixed inset-x-0 top-16 bg-black/95 border-b border-white/10 px-6 py-7 flex flex-col gap-4 md:hidden backdrop-blur-lg"
      >
        <a
          v-for="item in portfolioData.navLinks"
          :key="item.label"
          :href="item.href"
          @click="(e) => handleNavClick(e, item.href)"
          class="text-[11px] font-medium uppercase tracking-[0.3em] text-zinc-300 hover:text-white py-2 border-b border-white/5"
        >
          {{ item.label }}
        </a>
      </div>
    </transition>
  </header>
</template>
