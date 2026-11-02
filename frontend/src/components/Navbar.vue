<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { Menu, X, Sun, Moon } from 'lucide-vue-next'
import SignatureSvg from './SignatureSvg.vue'
import { portfolioData } from '../data/portfolio'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  isReady: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const { isDark, toggleTheme } = useTheme()
const navLinksRef = ref([])
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 45
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

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
    class="fixed top-0 left-0 right-0 z-40 px-6 sm:px-10 lg:px-14 py-4 sm:py-5 flex items-center justify-between pointer-events-none transition-all duration-300"
    :class="isScrolled ? 'bg-white/85 dark:bg-black/85 backdrop-blur-md shadow-xs border-b border-black/5 dark:border-white/5' : ''"
  >
    <!-- Top-Left Signature Logo Anchor -->
    <a
      id="navbar-logo-anchor"
      href="#hero"
      @click="(e) => handleNavClick(e, '#hero')"
      class="pointer-events-auto relative inline-flex items-center text-zinc-900 dark:text-white hover:opacity-80 transition-all duration-300 focus:outline-none"
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
        class="opacity-0 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white transition-colors duration-300"
      >
        {{ item.label }}
      </a>

      <!-- Dark / Light Mode Toggle Button -->
      <button
        type="button"
        @click="toggleTheme"
        class="opacity-0 relative inline-flex items-center justify-center w-8 h-8 rounded-full border border-zinc-300 dark:border-white/15 bg-white/90 dark:bg-white/5 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-white/30 transition-all duration-300 shadow-sm cursor-pointer ml-1"
        :ref="(el) => { if (el) navLinksRef[portfolioData.navLinks.length] = el }"
        :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Sun v-if="isDark" class="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
        <Moon v-else class="w-4 h-4 text-zinc-700 transition-transform duration-300 hover:-rotate-12" />
      </button>
    </nav>

    <!-- Mobile Menu Toggle & Theme Button -->
    <div
      class="pointer-events-auto md:hidden flex items-center gap-1.5"
      :class="isReady ? 'opacity-100' : 'opacity-0'"
    >
      <button
        type="button"
        @click="toggleTheme"
        class="p-2 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white focus:outline-none cursor-pointer transition-colors duration-300"
        :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
        <Moon v-else class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-2 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white focus:outline-none cursor-pointer transition-colors duration-300"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle Menu"
      >
        <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
        <X v-else class="w-5 h-5" />
      </button>
    </div>

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
        class="pointer-events-auto fixed inset-x-0 top-16 bg-white/95 dark:bg-black/95 border-b border-zinc-200 dark:border-white/10 px-6 py-7 flex flex-col gap-4 md:hidden backdrop-blur-lg shadow-xl"
      >
        <a
          v-for="item in portfolioData.navLinks"
          :key="item.label"
          :href="item.href"
          @click="(e) => handleNavClick(e, item.href)"
          class="text-[11px] font-medium uppercase tracking-[0.3em] text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white py-2 border-b border-zinc-100 dark:border-white/5"
        >
          {{ item.label }}
        </a>
      </div>
    </transition>
  </header>
</template>
