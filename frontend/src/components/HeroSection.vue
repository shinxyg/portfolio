<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SocialIcon from './SocialIcon.vue'
import SignatureSvg from './SignatureSvg.vue'
import { portfolioData } from '../data/portfolio'
import { useTheme } from '../composables/useTheme'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  isReady: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const { isDark } = useTheme()

const heroSectionRef = ref(null)
const videoContainerRef = ref(null)
const videoElRef = ref(null)
const leftTextColRef = ref(null)
const textItemsRef = ref([])
const overlaySigCompRef = ref(null)
const overlaySigWrapRef = ref(null)

let matchMediaCtx = null

// iconMap replaced by SocialIcon component

const currentVideoUrl = computed(() => portfolioData.personal.heroVideoUrl)

function setTextItemRef(el, idx) {
  if (el) textItemsRef.value[idx] = el
}

function handleVideoLoaded() {
  const vid = videoElRef.value
  if (!vid) return
  // Keep strictly paused on the first frame until the user scrolls
  vid.pause()
  vid.currentTime = 0
}

// Stage 1: When preloader finishes (00:06), fade in the still first frame from black (NO autoplay!)
watch(
  () => props.isReady,
  async (ready) => {
    if (!ready) return
    await nextTick()

    const vid = videoElRef.value
    if (vid) {
      vid.pause()
      vid.currentTime = 0
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set(videoContainerRef.value, { opacity: 1 })
      gsap.set(textItemsRef.value, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      videoContainerRef.value,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.35,
        ease: 'power3.out',
      }
    )
  },
  { immediate: true }
)

onMounted(() => {
  const vid = videoElRef.value
  if (vid) {
    vid.pause()
    vid.currentTime = 0
  }

  matchMediaCtx = gsap.matchMedia()

  matchMediaCtx.add('(prefers-reduced-motion: no-preference)', () => {
    const sigPath = overlaySigCompRef.value?.pathRef
    const sigLen = sigPath?.getTotalLength ? sigPath.getTotalLength() : 650

    if (sigPath) {
      gsap.set(sigPath, {
        strokeDasharray: sigLen,
        strokeDashoffset: sigLen,
      })
    }

    gsap.set(textItemsRef.value, { opacity: 0, y: 36 })
    gsap.set(overlaySigWrapRef.value, { opacity: 0 })

    // 100% Scroll-Controlled Pinned Timeline (Video ONLY moves when scrolling!)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSectionRef.value,
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const v = videoElRef.value
          if (!v || !v.duration) return
          v.pause()
          // Scrub video frames from 0.0s to end strictly based on scroll progress (0 -> 1)
          const targetTime = self.progress * Math.max(v.duration - 0.08, 0.1)
          if (Math.abs(v.currentTime - targetTime) > 0.01) {
            v.currentTime = targetTime
          }
        },
      },
    })

    // -----------------------------------------------------------------------
    // STAGE 2 (First half of scroll):
    // Video frames advance (0.0s -> ~2.8s) + subtle zoom & shift right while
    // Left-side text ("Frontend Developer", "Clarence Millares", buttons, icons)
    // reveals with stagger.
    // -----------------------------------------------------------------------
    tl.to(
      videoElRef.value,
      {
        scale: 1.16,
        yPercent: 4,
        duration: 1.15,
        ease: 'power2.inOut',
      },
      0
    )

    tl.to(
      videoContainerRef.value,
      {
        x: () => (window.innerWidth >= 768 ? window.innerWidth * 0.23 : window.innerWidth * 0.08),
        duration: 1.15,
        ease: 'power2.inOut',
      },
      0
    )

    tl.to(
      textItemsRef.value,
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
      },
      0.18
    )

    tl.to({}, { duration: 0.45 })

    // -----------------------------------------------------------------------
    // STAGE 3 (Second half of scroll):
    // Video centers back while drawing sword; text disappears.
    // -----------------------------------------------------------------------
    tl.addLabel('stage3')

    tl.to(
      textItemsRef.value,
      {
        opacity: 0,
        y: -24,
        stagger: 0.05,
        duration: 0.65,
        ease: 'power2.in',
      },
      'stage3'
    )

    tl.to(
      videoContainerRef.value,
      {
        x: 0,
        duration: 1.0,
        ease: 'power2.inOut',
      },
      'stage3'
    )

    tl.to(
      videoElRef.value,
      {
        scale: 1.08,
        yPercent: 0,
        duration: 1.0,
        ease: 'power2.inOut',
      },
      'stage3'
    )

    tl.to(
      overlaySigWrapRef.value,
      {
        opacity: 1,
        duration: 0.2,
      },
      'stage3+=0.45'
    )

    if (sigPath) {
      tl.to(
        sigPath,
        {
          strokeDashoffset: 0,
          duration: 1.15,
          ease: 'power2.out',
        },
        'stage3+=0.48'
      )
    }

    tl.to({}, { duration: 0.55 })
  })
})

onBeforeUnmount(() => {
  if (matchMediaCtx) matchMediaCtx.revert()
})
</script>

<template>
  <section
    id="hero"
    ref="heroSectionRef"
    class="relative w-full h-screen min-h-170 bg-[#f8fafc] dark:bg-black overflow-hidden flex items-center justify-center transition-colors duration-300"
  >
    <!--
      ========================================================================
      CENTER SCROLL-SCRUBBED HERO VIDEO (Solution A: Transparent WebM Ready)
      ========================================================================
    -->
    <div
      ref="videoContainerRef"
      class="relative z-10 w-[92vw] sm:w-[420px] max-w-[420px] h-[82vh] max-h-[720px] rounded-3xl overflow-hidden bg-black shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-black/10 dark:w-[92vw] dark:sm:w-140 dark:md:w-165 dark:max-w-none dark:h-[85vh] dark:max-h-195 dark:rounded-none dark:overflow-visible dark:bg-transparent dark:shadow-none dark:border-transparent opacity-0 flex items-center justify-center select-none pointer-events-none will-change-transform transition-all duration-300"
    >
      <video
        ref="videoElRef"
        :src="currentVideoUrl"
        muted
        playsinline
        preload="auto"
        @loadedmetadata="handleVideoLoaded"
        class="w-full h-full object-cover dark:object-contain will-change-transform"
        :style="isDark ? {
          mixBlendMode: 'lighten',
          WebkitMaskImage: 'radial-gradient(ellipse 68% 76% at 50% 46%, #000 52%, transparent 96%)',
          maskImage: 'radial-gradient(ellipse 68% 76% at 50% 46%, #000 52%, transparent 96%)'
        } : {}"
      ></video>

      <!-- Stage 3 Giant Handwritten Signature Drawn Over the Sword Climax -->
      <div
        ref="overlaySigWrapRef"
        class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        <SignatureSvg
          ref="overlaySigCompRef"
          className="w-64 sm:w-80 md:w-96 h-auto text-emerald-500 dark:text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)] transition-colors duration-300"
          :strokeWidth="4.2"
        />
      </div>
    </div>

    <!--
      ========================================================================
      STAGE 2 LEFT-SIDE HERO TEXT OVERLAY
      ========================================================================
    -->
    <div
      ref="leftTextColRef"
      class="absolute inset-0 z-20 max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-center pointer-events-none"
    >
      <div class="max-w-xl pointer-events-auto">
        <!-- Subtitle: "Frontend Developer & UI/UX Engineer" -->
        <p
          :ref="(el) => setTextItemRef(el, 0)"
          class="text-sm sm:text-base md:text-lg font-normal text-zinc-600 dark:text-zinc-300 tracking-wide mb-1.5 transition-colors duration-300"
        >
          {{ portfolioData.personal.title }}
        </p>

        <!-- Huge Bold Name: "Clarence Millares" -->
        <h1
          :ref="(el) => setTextItemRef(el, 1)"
          class="text-[clamp(2.75rem,6.5vw,5.6rem)] font-bold tracking-[-0.03em] leading-[1.02] text-zinc-950 dark:text-white mb-4 transition-colors duration-300"
        >
          {{ portfolioData.personal.name }}
        </h1>

        <!-- Short Description -->
        <p
          :ref="(el) => setTextItemRef(el, 2)"
          class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-md mb-7 transition-colors duration-300"
        >
          {{ portfolioData.personal.description }}
        </p>

        <!-- 2 Buttons: Solid "DOWNLOAD CV" & Outlined "CONTACT ME" -->
        <div
          :ref="(el) => setTextItemRef(el, 3)"
          class="flex flex-wrap items-center gap-3.5 mb-7"
        >
          <a
            :href="portfolioData.personal.cvUrl"
            @click.prevent="emit('navigate', '#contact')"
            class="px-6 py-2.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 shadow-sm"
          >
            DOWNLOAD CV
          </a>

          <a
            href="#contact"
            @click.prevent="emit('navigate', '#contact')"
            class="px-6 py-2.5 rounded-md border border-zinc-300 bg-white/80 text-zinc-800 hover:bg-zinc-100 hover:border-zinc-400 dark:border-white/25 dark:bg-black/50 dark:text-white dark:hover:border-white dark:hover:bg-white/10 backdrop-blur-sm text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300 shadow-sm"
          >
            CONTACT ME
          </a>
        </div>

        <!-- 4 Rounded-Square Social Icons -->
        <div
          :ref="(el) => setTextItemRef(el, 4)"
          class="flex items-center gap-2.5"
        >
          <a
            v-for="social in portfolioData.socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
            class="w-9 h-9 rounded-lg border border-zinc-300 bg-white/80 dark:border-white/15 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-500 dark:hover:border-white/40 transition-all duration-300 shadow-sm"
          >
            <SocialIcon :name="social.name" className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
