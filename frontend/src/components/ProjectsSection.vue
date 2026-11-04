<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, ArrowUpRight, X, Code2, Layers, Zap } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const splitHeaderWrapRef = ref(null)
const popularLabelRef = ref(null)
const proLeftRef = ref(null)
const jectsRightRef = ref(null)
const cardsStageRef = ref(null)

// Track which project cards have their "DETAILS" view open and which tab is active
const openDetails = reactive({})
const activeTab = reactive({})
const currentOrder = ref([0, 1, 2])

let mm = null

portfolioData.projects.forEach((p) => {
  openDetails[p.id] = false
  activeTab[p.id] = 'OVERVIEW'
})

function toggleDetails(projectId) {
  openDetails[projectId] = !openDetails[projectId]
  if (!activeTab[projectId]) {
    activeTab[projectId] = 'OVERVIEW'
  }
}

function setTab(projectId, tabName) {
  activeTab[projectId] = tabName
}

const cardsRowRef = ref(null)
let isRotating = false

// Arrow click: cards glide from their old slot to the new slot (GSAP FLIP)
async function rotateCarousel(dir) {
  if (isRotating) return
  isRotating = true

  const row = cardsRowRef.value
  const before = {}
  if (row) {
    row.querySelectorAll('[data-card]').forEach((el) => {
      const r = el.getBoundingClientRect()
      before[el.dataset.card] = { left: r.left, width: r.width }
    })
  }

  const arr = [...currentOrder.value]
  if (dir > 0) {
    arr.push(arr.shift())
  } else {
    arr.unshift(arr.pop())
  }
  currentOrder.value = arr

  await nextTick()

  if (!row || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isRotating = false
    return
  }

  const centerId = portfolioData.projects[currentOrder.value[1]]?.id
  const els = row.querySelectorAll('[data-card]')
  els.forEach((el) => {
    const prev = before[el.dataset.card]
    const now = el.getBoundingClientRect()
    let dx = dir > 0 ? 90 : -90
    if (prev && prev.width > 0 && now.width > 0) {
      dx = prev.left - now.left
      if (Math.abs(dx) > now.width * 1.1) {
        dx = dir > 0 ? 80 : -80
      }
    }
    const isEnteringCenter = el.dataset.card === centerId
    gsap.fromTo(
      el,
      { x: dx, y: isEnteringCenter ? -14 : 6 },
      {
        x: 0,
        y: 0,
        duration: isEnteringCenter ? 0.6 : 0.52,
        ease: isEnteringCenter ? 'back.out(1.2)' : 'power3.out',
        clearProps: 'transform',
      }
    )
  })

  gsap.delayedCall(0.58, () => {
    isRotating = false
  })
}

// Click on side cards (blurred ones) smoothly rotates that card to center
function onSideCardClick(slotIdx) {
  if (slotIdx === 0) {
    rotateCarousel(-1)
  } else if (slotIdx === 2) {
    rotateCarousel(1)
  }
}

// Direct jump via pagination dots
function goToProjectIndex(targetIdx) {
  const currentCenterIdx = currentOrder.value[1]
  if (currentCenterIdx === targetIdx) return
  if (currentOrder.value[0] === targetIdx) {
    rotateCarousel(-1)
  } else if (currentOrder.value[2] === targetIdx) {
    rotateCarousel(1)
  }
}

// Mobile touch swipe gestures
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e) {
  if (!e.touches || e.touches.length === 0) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e) {
  if (!e.changedTouches || e.changedTouches.length === 0) return
  const diffX = e.changedTouches[0].clientX - touchStartX
  const diffY = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX < 0) {
      rotateCarousel(1)
    } else {
      rotateCarousel(-1)
    }
  }
}

// Details panel <-> poster card: shrink + fade
function onCardSwapLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    scale: 0.92,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done,
  })
}

function onCardSwapEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.92 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      onComplete: done,
    }
  )
}

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.set(cardsStageRef.value, {
      y: 240,
      scale: 0.9,
      opacity: 0,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '+=155%',
        pin: true,
        scrub: 0.85,
        anticipatePin: 1,
      },
    })

    // Hold complete "POPULAR PROJECTS" briefly at start (00:26)
    tl.to({}, { duration: 0.2 })

    // Split "PRO" to the left and "JECTS" to the right (00:27)
    tl.to(
      proLeftRef.value,
      {
        xPercent: -115,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.inOut',
      },
      'split'
    )

    tl.to(
      jectsRightRef.value,
      {
        xPercent: 115,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.inOut',
      },
      'split'
    )

    tl.to(
      popularLabelRef.value,
      {
        y: -45,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      },
      'split'
    )

    // Rise 3-card showcase up through the center gap (00:27 -> 00:28)
    tl.to(
      cardsStageRef.value,
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.05,
        ease: 'power3.out',
      },
      'split+=0.18'
    )

    tl.to({}, { duration: 0.45 })
  })
})

onBeforeUnmount(() => {
  if (mm) mm.revert()
})
</script>

<template>
  <section
    id="projects"
    ref="sectionRef"
    class="relative w-full h-screen min-h-175 video-ambient-bg overflow-hidden flex items-center justify-center"
  >
    <!--
      ========================================================================
      GIANT CENTERED "POPULAR PROJECTS" THAT SPLITSInto "PRO" | "JECTS" (00:26-00:27)
      ========================================================================
    -->
    <div
      ref="splitHeaderWrapRef"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none px-4"
    >
      <p
        ref="popularLabelRef"
        class="text-xs sm:text-sm md:text-base font-normal uppercase tracking-[0.55em] text-zinc-400 mb-3"
      >
        FEATURED
      </p>

      <div
        class="flex items-center justify-center text-[clamp(3.6rem,12.5vw,10.5rem)] font-black uppercase tracking-[-0.04em] leading-none text-zinc-950 dark:text-white transition-colors duration-300"
      >
        <span ref="proLeftRef" class="inline-block will-change-transform">PRO</span>
        <span ref="jectsRightRef" class="inline-block will-change-transform">JECTS</span>
      </div>
    </div>

    <!--
      ========================================================================
      3-CARD INTERACTIVE SHOWCASE CAROUSEL (00:28 - 00:37)
      ========================================================================
    -->
    <div
      ref="cardsStageRef"
      class="relative z-20 w-full max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center will-change-transform"
    >
      <div class="relative w-full flex items-center justify-center gap-5 lg:gap-7">
        <!-- Left Carousel Arrow (<) -->
        <button
          type="button"
          @click="rotateCarousel(-1)"
          class="hidden sm:flex shrink-0 w-9 h-9 rounded-full border border-black/15 bg-white/80 dark:border-white/15 dark:bg-black/70 items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white transition-all cursor-pointer shadow-sm"
          aria-label="Previous project"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <!-- 3 Project Cards: Overlapping Stacked Deck with Touch Swipe & 3D Tilt -->
        <div
          ref="cardsRowRef"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
          class="flex items-center justify-center w-full max-w-4xl mx-auto py-2 select-none touch-pan-y"
        >
          <div
            v-for="(projIndex, slotIdx) in currentOrder"
            :key="portfolioData.projects[projIndex].id"
            :data-card="portfolioData.projects[projIndex].id"
            class="shrink-0 w-full max-w-[300px] sm:max-w-[320px] h-87.5 sm:h-92.5 relative flex items-center justify-center will-change-transform"
            :class="[
              slotIdx === 1 ? 'flex z-20' : 'hidden md:flex z-10',
              slotIdx === 0 ? 'md:-mr-16 lg:-mr-24' : '',
              slotIdx === 2 ? 'md:-ml-16 lg:-ml-24' : ''
            ]"
          >
            <!-- Inner Card: 3D Tilt, Arc Lift, Depth Blur, and Perspective Transition -->
            <div
              class="w-full h-full rounded-2xl overflow-hidden border bg-white dark:bg-[#0b0d0c] relative transition-all duration-500 ease-out select-none transform-gpu"
              :class="[
                slotIdx === 1
                  ? 'scale-100 md:scale-[1.06] rotate-0 opacity-100 blur-none border-black/20 dark:border-white/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(255,255,255,0.08)]'
                  : 'md:scale-[0.88] md:opacity-25 md:hover:opacity-55 md:blur-[4.5px] md:hover:blur-[1.5px] border-black/10 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer',
                slotIdx === 0 ? 'md:-rotate-3' : '',
                slotIdx === 2 ? 'md:rotate-3' : ''
              ]"
            >
              <!-- Click catcher overlay on blurred side cards to smoothly focus them to center -->
              <div
                v-if="slotIdx !== 1"
                @click.stop="onSideCardClick(slotIdx)"
                class="absolute inset-0 z-30 cursor-pointer"
                :title="slotIdx === 0 ? 'Click to view previous project' : 'Click to view next project'"
              ></div>

              <Transition
              :css="false"
              mode="out-in"
              @leave="onCardSwapLeave"
              @enter="onCardSwapEnter"
            >
            <!-- ============================================================= -->
            <!-- STATE A: VISUAL POSTER CARD WITH "DETAILS ↗" PILL (00:28)     -->
            <!-- ============================================================= -->
            <div
              v-if="!openDetails[portfolioData.projects[projIndex].id]"
              class="relative w-full h-full flex flex-col justify-between overflow-hidden group"
            >
              <!-- Card 1 Visual: Executive Corporate Portrait / Insurance Theme -->
              <div
                v-if="portfolioData.projects[projIndex].visualType === 'executive'"
                class="absolute inset-0 bg-[#0b0d0c] overflow-hidden"
              >
                <img
                  :src="portfolioData.projects[projIndex].imageUrl || portfolioData.personal.portraitUrl"
                  :alt="portfolioData.projects[projIndex].title"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div class="absolute top-4 left-4">
                  <span
                    class="px-2.5 py-1 rounded bg-black/70 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm"
                  >
                    {{ portfolioData.projects[projIndex].title }}
                  </span>
                </div>
              </div>

              <!-- Card 2 Visual: "FRIES LAB" Dark Graphic Poster with Hanging Lights & Moon (matching 00:28!) -->
              <div
                v-else-if="portfolioData.projects[projIndex].visualType === 'frieslab'"
                class="absolute inset-0 bg-[#070707] flex flex-col items-center justify-between p-6 overflow-hidden"
              >
                <!-- Hanging warm lights + crescent moon SVG (matching center card in video 00:28) -->
                <svg
                  class="w-full h-24 text-amber-400/90"
                  viewBox="0 0 300 95"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Hanging cords -->
                  <line x1="35" y1="0" x2="35" y2="42" stroke="#52525b" stroke-width="1" />
                  <line x1="75" y1="0" x2="75" y2="28" stroke="#52525b" stroke-width="1" />
                  <line x1="225" y1="0" x2="225" y2="30" stroke="#52525b" stroke-width="1" />
                  <line x1="265" y1="0" x2="265" y2="45" stroke="#52525b" stroke-width="1" />
                  <!-- Glowing bulbs -->
                  <circle cx="35" cy="46" r="5" fill="#fbbf24" />
                  <circle cx="75" cy="32" r="4.5" fill="#f59e0b" />
                  <circle cx="225" cy="34" r="4.5" fill="#f59e0b" />
                  <circle cx="265" cy="49" r="5" fill="#fbbf24" />
                  <!-- Crescent Moon in center -->
                  <path
                    d="M156 26C149 26 143 32 143 40C143 48 149 54 156 54C151 52 148 46.5 148 40C148 33.5 151 28 156 26Z"
                    fill="#fbbf24"
                  />
                </svg>

                <!-- Bold Distressed "FRIES LAB" Typography -->
                <div class="text-center my-auto select-none group-hover:scale-105 transition-transform duration-500">
                  <div
                    class="text-5xl font-black uppercase tracking-tight leading-[0.88] text-transparent bg-clip-text bg-linear-to-b from-amber-400 via-orange-500 to-red-600 drop-shadow-[0_4px_20px_rgba(234,88,12,0.35)]"
                  >
                    FRIES
                  </div>
                  <div
                    class="text-5xl font-black uppercase tracking-tight leading-[0.88] text-transparent bg-clip-text bg-linear-to-b from-orange-500 to-red-700"
                  >
                    LAB
                  </div>
                </div>

                <div class="w-full h-8"></div>
              </div>

              <!-- Card 3 Visual: Editorial Fashion / Lifestyle Storefront -->
              <div
                v-else
                class="absolute inset-0 bg-linear-to-b from-[#d6d3cd] via-[#b8b4ac] to-[#78746d] flex flex-col justify-between p-6 overflow-hidden"
              >
                <div class="flex justify-between items-start">
                  <span
                    class="px-2.5 py-1 rounded bg-black/75 text-[9px] font-semibold uppercase tracking-[0.2em] text-white"
                  >
                    {{ portfolioData.projects[projIndex].title }}
                  </span>
                </div>

                <div class="my-auto text-center">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-zinc-800 font-semibold mb-1">
                    COLLECTION 2025
                  </p>
                  <h4 class="text-3xl font-extrabold tracking-tighter text-zinc-900 uppercase">
                    ATELIER
                  </h4>
                  <p class="text-xs text-zinc-700 mt-1">Minimalist E-Commerce</p>
                </div>

                <div
                  class="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent"
                ></div>
              </div>

              <!-- Bottom-Right "DETAILS ↗" White Pill Button (matching 00:28) -->
              <div class="relative z-10 mt-auto p-4 flex justify-end">
                <button
                  type="button"
                  @click="toggleDetails(portfolioData.projects[projIndex].id)"
                  class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-[0.16em] shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>DETAILS</span>
                  <ArrowUpRight class="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <!-- ============================================================= -->
            <!-- STATE B: INTERACTIVE DARK DETAILS PANEL (matching 00:29-00:35) -->
            <!-- ============================================================= -->
            <div
              v-else
              class="w-full h-full bg-[#f8fafc] dark:bg-[#0d110f] p-6 flex flex-col justify-between text-left transition-colors duration-300"
            >
              <div>
                <!-- Header + Close Button -->
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white transition-colors duration-300">
                    {{ portfolioData.projects[projIndex].title }}
                  </h3>
                  <button
                    type="button"
                    @click="toggleDetails(portfolioData.projects[projIndex].id)"
                    class="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors duration-300"
                    aria-label="Close details"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- 3 Tabs: OVERVIEW | TECH | FEATURES (matching 00:30 & 00:35) -->
                <div class="flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-2 mb-3.5">
                  <button
                    v-for="tab in ['OVERVIEW', 'TECH', 'FEATURES']"
                    :key="tab"
                    type="button"
                    @click="setTab(portfolioData.projects[projIndex].id, tab)"
                    class="text-[9px] font-semibold uppercase tracking-[0.22em] transition-colors cursor-pointer pb-1 -mb-2.25 border-b"
                    :class="
                      activeTab[portfolioData.projects[projIndex].id] === tab
                        ? 'text-zinc-950 dark:text-white border-zinc-950 dark:border-white'
                        : 'text-zinc-500 dark:text-zinc-500 border-transparent hover:text-zinc-800 dark:hover:text-zinc-300'
                    "
                  >
                    {{ tab }}
                  </button>
                </div>

                <!-- Tab Content -->
                <div class="min-h-28.75">
                  <p
                    v-if="activeTab[portfolioData.projects[projIndex].id] === 'OVERVIEW'"
                    class="text-xs text-zinc-700 dark:text-zinc-300 font-light leading-relaxed"
                  >
                    {{ portfolioData.projects[projIndex].overview }}
                  </p>

                  <div
                    v-else-if="activeTab[portfolioData.projects[projIndex].id] === 'TECH'"
                    class="flex flex-wrap gap-1.5 pt-1"
                  >
                    <span
                      v-for="t in portfolioData.projects[projIndex].tech"
                      :key="t"
                      class="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/6 border border-black/10 dark:border-white/10 text-[10px] text-zinc-800 dark:text-zinc-200"
                    >
                      {{ t }}
                    </span>
                  </div>

                  <ul v-else class="space-y-1.5 text-[11px] text-zinc-700 dark:text-zinc-300">
                    <li
                      v-for="feat in portfolioData.projects[projIndex].features"
                      :key="feat"
                      class="flex items-start gap-2"
                    >
                      <span class="mt-1.5 w-1 h-1 rounded-full bg-zinc-800 dark:bg-white shrink-0"></span>
                      <span>{{ feat }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Mini Tech Badges Row (matching 00:30 & 00:35) -->
                <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                  <div
                    v-for="stat in portfolioData.projects[projIndex].stats"
                    :key="stat.label"
                    class="flex items-center gap-1.5 text-[10px] text-zinc-700 dark:text-zinc-300"
                  >
                    <!-- Official Vue Logo -->
                    <svg
                      v-if="stat.icon === 'vue' || stat.label.toLowerCase().includes('vue')"
                      viewBox="0 0 256 221"
                      class="w-3.5 h-3.5 shrink-0"
                    >
                      <path fill="#41B883" d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36Z" />
                      <path fill="#35495E" d="M0 0l128 220.8L256 0h-51.2L128 132.48 50.56 0H0Z" />
                    </svg>

                    <!-- Official TypeScript Logo -->
                    <svg
                      v-else-if="stat.icon === 'typescript' || stat.label.toLowerCase().includes('typescript')"
                      viewBox="0 0 128 128"
                      class="w-3.5 h-3.5 shrink-0 rounded-xs overflow-hidden"
                    >
                      <rect width="128" height="128" fill="#3178c6" />
                      <path fill="#fff" d="M38 46h52v12H68v46H52V58H38V46zm60 28c0-8 6-12 14-12 5 0 9 2 12 5l-6 8c-2-2-4-3-6-3-3 0-4 1-4 3 0 4 16 3 16 16 0 8-6 13-16 13-6 0-11-2-15-6l6-8c3 3 5 4 8 4 3 0 5-1 5-3 0-5-15-4-15-17z" />
                    </svg>

                    <!-- Official PostgreSQL Elephant Logo -->
                    <img
                      v-else-if="stat.icon === 'postgresql' || stat.label.toLowerCase().includes('postgres')"
                      src="/icons/postgresql.png"
                      alt="PostgreSQL"
                      class="w-3.5 h-3.5 object-contain shrink-0"
                    />

                    <!-- Generic / Fallback Lucide Icons -->
                    <Code2 v-else-if="stat.icon === 'code'" class="w-3 h-3 text-emerald-400" />
                    <Layers v-else-if="stat.icon === 'layers'" class="w-3 h-3 text-sky-400" />
                    <Zap v-else class="w-3 h-3 text-amber-400" />

                    <span>{{ stat.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Full-Width Solid White "VISIT WEBSITE ↗" Button (matching 00:30 & 00:35) -->
              <a
                :href="portfolioData.projects[projIndex].liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-4 w-full py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
              >
                <span>VISIT WEBSITE</span>
                <ArrowUpRight class="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            </div>
            </Transition>
            </div>
          </div>
        </div>

        <!-- Right Carousel Arrow (>) -->
        <button
          type="button"
          @click="rotateCarousel(1)"
          class="hidden sm:flex shrink-0 w-9 h-9 rounded-full border border-black/15 bg-white/80 dark:border-white/15 dark:bg-black/70 items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white transition-all cursor-pointer shadow-sm"
          aria-label="Next project"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Dot Pagination (Indicates active center card & allows direct jump) -->
      <div class="flex items-center justify-center gap-2 mt-6">
        <button
          v-for="(proj, idx) in portfolioData.projects"
          :key="proj.id"
          type="button"
          @click="goToProjectIndex(idx)"
          class="transition-all duration-300 rounded-full cursor-pointer"
          :class="
            currentOrder[1] === idx
              ? 'w-7 h-2 bg-zinc-900 dark:bg-white'
              : 'w-2 h-2 bg-black/25 dark:bg-white/25 hover:bg-black/50 dark:hover:bg-white/50'
          "
          :aria-label="`Go to ${proj.title}`"
        ></button>
      </div>

      <!-- Mobile Carousel Arrows -->
      <div class="flex sm:hidden items-center gap-4 mt-4">
        <button
          type="button"
          @click="rotateCarousel(-1)"
          class="w-9 h-9 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 cursor-pointer"
          aria-label="Previous project"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="rotateCarousel(1)"
          class="w-9 h-9 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 cursor-pointer"
          aria-label="Next project"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Bottom Centered "VIEW ALL PROJECTS" White Pill Button (matching 00:28-00:37) -->
      <div class="mt-8">
        <a
          href="#contact"
          class="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
        >
          VIEW ALL PROJECTS
        </a>
      </div>
    </div>
  </section>
</template>
