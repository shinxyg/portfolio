<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SignatureSvg from './SignatureSvg.vue'
import { portfolioData } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['navigate'])

const sectionRef = ref(null)
const titleBlockRef = ref(null)
const cardsRef = ref([])

let mm = null

function setCardRef(el, idx) {
  if (el) cardsRef.value[idx] = el
}

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const cards = cardsRef.value
    // Initial states: card 0 starts slightly below center, cards 1..4 wait off-screen bottom-right
    cards.forEach((card, i) => {
      if (i === 0) {
        gsap.set(card, {
          y: 180,
          x: 40,
          rotateZ: 6,
          opacity: 0,
          scale: 0.94,
        })
      } else {
        gsap.set(card, {
          x: 420,
          y: 180,
          rotateZ: 16,
          opacity: 0,
          scale: 0.95,
        })
      }
    })

    // Prepare SVG signature paths for animated stroke handwriting

    const signaturePaths = cards.map((card) => {

      const p = card ? card.querySelector('path') : null

      if (p) {

        const len = (p.getTotalLength && p.getTotalLength() > 0) ? Math.ceil(p.getTotalLength()) : 1200

        gsap.set(p, {

          strokeDasharray: len,

          strokeDashoffset: len,

        })

      }

      return p

    })



    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: () => `+=${cards.length * 75}%`,
        pin: true,
        scrub: 0.85,
        anticipatePin: 1,
      },
    })

    // 1. Giant "Services" title moves up to top-left corner (00:12 -> 00:13)
    tl.to(
      titleBlockRef.value,
      {
        y: () => -window.innerHeight * 0.34,
        scale: 0.92,
        transformOrigin: 'left top',
        duration: 0.9,
        ease: 'power2.inOut',
      },
      0
    )

    // 2. First card rises into center stack
    tl.to(
      cards[0],
      {
        x: 0,
        y: 0,
        rotateZ: portfolioData.services[0].rotation,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
      },
      0.15
    )

    // Live handwriting draw animation on Card 0
    if (signaturePaths[0]) {
      tl.to(
        signaturePaths[0],
        {
          strokeDashoffset: 0,
          duration: 0.75,
          ease: 'power1.inOut',
        },
        0.3
      )
    }

    // 3. Subsequent cards slide in from right with 3D/tilt and stack on top in the center (00:13 -> 00:18)
    for (let i = 1; i < cards.length; i++) {
      const stepLabel = `card_${i}`
      tl.addLabel(stepLabel, `+=0.15`)

      // Previous card settles slightly deeper into the deck
      tl.to(
        cards[i - 1],
        {
          scale: 0.96,
          opacity: 0.55,
          x: -12,
          y: -6,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        stepLabel
      )

      // Current card deals in from right and straightens onto the stack
      tl.to(
        cards[i],
        {
          x: 0,
          y: 0,
          rotateZ: portfolioData.services[i].rotation,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
        },
        stepLabel
      )

      // Live handwriting draw animation on current card as it lands
      if (signaturePaths[i]) {
        tl.to(
          signaturePaths[i],
          {
            strokeDashoffset: 0,
            duration: 0.75,
            ease: 'power1.inOut',
          },
          stepLabel + '+=0.25'
        )
      }
    }

    tl.to({}, { duration: 0.3 })
  })
})

onBeforeUnmount(() => {
  if (mm) mm.revert()
})
</script>

<template>
  <section
    id="services"
    ref="sectionRef"
    class="relative w-full h-screen min-h-170 video-ambient-bg overflow-hidden flex items-center justify-center"
  >
    <!-- Faint Geometric Diagonal Lines in Background (matching video 00:12 - 00:18) -->
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none opacity-25"
       xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 1440 900"
    >
      <line x1="0" y1="900" x2="1440" y2="120" stroke="#14532d" stroke-width="1" />
      <line x1="200" y1="0" x2="1150" y2="900" stroke="#14532d" stroke-width="1" />
      <line x1="0" y1="560" x2="1440" y2="620" stroke="#14532d" stroke-width="0.75" />
    </svg>

    <!-- Giant "Services" Title that starts middle-left and settles at top-left (00:12 -> 00:13) -->
    <div
      ref="titleBlockRef"
      class="absolute left-6 sm:left-12 lg:left-20 top-[28%] z-10 pointer-events-none select-none will-change-transform"
    >
      <p class="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.35em] text-zinc-500 mb-2">
        CORE SKILLS
      </p>
      <h2
        class="text-[clamp(3.2rem,8vw,7rem)] font-extrabold tracking-[-0.04em] leading-[0.88] text-zinc-950 dark:text-white whitespace-nowrap transition-colors duration-300"
      >
        Focus Areas
      </h2>
    </div>

    <!-- Center Stacking Deck of Square Dark Cards (00:12 -> 00:18) -->
    <div class="relative z-20 w-77.5 sm:w-92.5 h-85 sm:h-95 flex items-center justify-center">
      <article
        v-for="(service, idx) in portfolioData.services"
        :key="service.id"
        :ref="(el) => setCardRef(el, idx)"
        :style="{ zIndex: idx + 1 }"
        class="absolute inset-0 rounded-2xl border border-black/10 dark:border-white/15 bg-white/95 dark:bg-[#0b0d0c]/95 backdrop-blur-md p-7 sm:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.85)] will-change-transform transition-colors duration-300"
      >
        <div>
          <h3 class="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-snug mb-4 transition-colors duration-300">
            {{ service.title }}
          </h3>

          <p class="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 font-light leading-relaxed transition-colors duration-300">
            {{ service.description }}
          </p>
        </div>

        <!-- Card Footer: Optional CTA pill on left + Signature Watermark on bottom-right -->
        <div class="flex items-end justify-between pt-4">
          <div>
            <button
              v-if="service.cta"
              type="button"
              @click="emit('navigate', '#skills')"
              class="px-4 py-2 rounded-full border border-black/15 dark:border-white/25 bg-black/5 dark:bg-white/5 text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-800 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 cursor-pointer"
            >
              {{ service.cta }}
            </button>
          </div>

          <SignatureSvg
            className="w-16 sm:w-20 h-auto text-zinc-900/50 dark:text-zinc-100/65 ml-auto transition-colors duration-300"
            :strokeWidth="4"
          />
        </div>
      </article>
    </div>
  </section>
</template>
