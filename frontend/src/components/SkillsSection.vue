<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const headerRef = ref(null)
const categoryRefs = ref([])

let mm = null

function setCategoryRef(el, idx) {
  if (el) categoryRefs.value[idx] = el
}

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(
      headerRef.value,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 78%',
        },
      }
    )

    categoryRefs.value.forEach((groupEl) => {
      const cards = groupEl.querySelectorAll('.tech-badge-card')
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 35,
          scale: 0.86,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: groupEl,
            start: 'top 82%',
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
    id="skills"
    ref="sectionRef"
    class="relative py-28 sm:py-36 px-6 sm:px-12 lg:px-20 video-ambient-bg"
  >
    <div class="max-w-5xl mx-auto">
      <!-- Centered "TECH STACK" Heading (matching 00:38-00:40) -->
      <h2
        ref="headerRef"
        class="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[-0.02em] text-white mb-16 sm:mb-20"
      >
        TECH STACK
      </h2>

      <!-- Categorized Tech Stack Rows (matching 00:38-00:42) -->
      <div class="space-y-12 sm:space-y-14">
        <div
          v-for="(group, idx) in portfolioData.techStackCategories"
          :key="group.category"
          :ref="(el) => setCategoryRef(el, idx)"
        >
          <!-- Category Title + Horizontal Divider Line -->
          <div class="flex items-center gap-5 mb-6">
            <h3 class="text-sm sm:text-base font-semibold text-zinc-200 shrink-0">
              {{ group.category }}
            </h3>
            <div class="h-[1px] flex-1 bg-white/10"></div>
          </div>

          <!-- Square Dark Tech Icon Cards -->
          <div class="flex flex-wrap items-center gap-4 sm:gap-5">
            <div
              v-for="item in group.items"
              :key="item.name"
              class="tech-badge-card w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-white/10 bg-[#0b0d0c] hover:border-white/30 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 p-3"
            >
              <!-- Official Colored Tech Logos -->
              <div class="w-8 h-8 flex items-center justify-center">
                <!-- Vue.js -->
                <svg v-if="item.slug === 'vue'" viewBox="0 0 256 221" class="w-7 h-7">
                  <path fill="#41B883" d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36Z" />
                  <path fill="#35495E" d="M0 0l128 220.8L256 0h-51.2L128 132.48 50.56 0H0Z" />
                </svg>

                <!-- Next.js -->
                <svg v-else-if="item.slug === 'nextjs'" viewBox="0 0 128 128" class="w-7 h-7">
                  <circle cx="64" cy="64" r="60" fill="#ffffff" />
                  <path
                    fill="#000000"
                    d="M44 40h10v48H44V40zm30 0h10v32L51 40h-7l42 54c2.5-1.5 5-3.2 7-5.2L60 46v42h-6V40h20z"
                  />
                </svg>

                <!-- React -->
                <svg v-else-if="item.slug === 'react'" viewBox="-11.5 -10.23 23 20.46" class="w-7 h-7">
                  <circle r="2.05" fill="#61dafb" />
                  <g stroke="#61dafb" stroke-width="1" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                  </g>
                </svg>

                <!-- Tailwind CSS -->
                <svg v-else-if="item.slug === 'tailwind'" viewBox="0 0 24 24" class="w-7 h-7" fill="#38bdf8">
                  <path
                    d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"
                  />
                </svg>

                <!-- GSAP -->
                <div
                  v-else-if="item.slug === 'gsap'"
                  class="w-7 h-7 rounded-full bg-[#0ae448] text-black font-black text-[9px] flex items-center justify-center tracking-tighter"
                >
                  GSAP
                </div>

                <!-- Framer Motion -->
                <svg v-else-if="item.slug === 'framer'" viewBox="0 0 24 24" class="w-6 h-6" fill="#ffffff">
                  <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
                </svg>

                <!-- Bootstrap -->
                <div
                  v-else-if="item.slug === 'bootstrap'"
                  class="w-7 h-7 rounded-md bg-[#7952b3] text-white font-bold text-sm flex items-center justify-center"
                >
                  B
                </div>

                <!-- JavaScript -->
                <div
                  v-else-if="item.slug === 'javascript'"
                  class="w-7 h-7 rounded bg-[#f7df1e] text-black font-extrabold text-xs flex items-end justify-end p-1 leading-none"
                >
                  JS
                </div>

                <!-- TypeScript -->
                <div
                  v-else-if="item.slug === 'typescript'"
                  class="w-7 h-7 rounded bg-[#3178c6] text-white font-extrabold text-xs flex items-end justify-end p-1 leading-none"
                >
                  TS
                </div>

                <!-- Node.js -->
                <svg v-else-if="item.slug === 'nodejs'" viewBox="0 0 24 24" class="w-7 h-7" fill="#5fa04e">
                  <path d="M12 1.85 3 7.05v10.4l9 5.2 9-5.2V7.05l-9-5.2zm0 2.31 6.8 3.93v7.82L12 19.84l-6.8-3.93V8.09L12 4.16z" />
                </svg>

                <!-- Supabase -->
                <svg v-else-if="item.slug === 'supabase'" viewBox="0 0 24 24" class="w-7 h-7" fill="#3ecf8e">
                  <path d="M13.5 2 4.5 13.5h6.75L10.5 22l9-11.5h-6.75L13.5 2z" />
                </svg>

                <!-- Firebase -->
                <svg v-else-if="item.slug === 'firebase'" viewBox="0 0 24 24" class="w-7 h-7" fill="#ffca28">
                  <path d="M4.5 18.5 7.5 3.5l4.2 7.5 2.8-4.5 5 12-7.5 4-7.5-4z" />
                </svg>

                <!-- Figma -->
                <svg v-else-if="item.slug === 'figma'" viewBox="0 0 24 24" class="w-6 h-6">
                  <circle cx="15" cy="12" r="3" fill="#1abcfe" />
                  <path d="M6 15a3 3 0 0 1 3-3h3v3a3 3 0 1 1-6 0z" fill="#0acf83" />
                  <path d="M6 9a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z" fill="#a259ff" />
                  <path d="M6 3a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z" fill="#f24e1e" />
                  <path d="M12 0h3a3 3 0 1 1 0 6h-3V0z" fill="#ff7262" />
                </svg>

                <!-- Git -->
                <svg v-else-if="item.slug === 'git'" viewBox="0 0 24 24" class="w-7 h-7" fill="#f05032">
                  <path
                    d="M21.62 11.11 12.89 2.38a1.3 1.3 0 0 0-1.84 0L9.22 4.21l2.3 2.3a1.55 1.55 0 0 1 1.96 1.98l2.22 2.22a1.55 1.55 0 1 1-.93.93L12.7 9.57v5.45a1.55 1.55 0 1 1-1.28-.04V9.43a1.55 1.55 0 0 1-.84-2.03L8.3 5.13 2.38 11.05a1.3 1.3 0 0 0 0 1.84l8.73 8.73a1.3 1.3 0 0 0 1.84 0l8.67-8.67a1.3 1.3 0 0 0 0-1.84z"
                  />
                </svg>

                <!-- GitHub -->
                <svg v-else-if="item.slug === 'github'" viewBox="0 0 24 24" class="w-7 h-7" fill="#ffffff">
                  <path
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.39-3.87-1.39-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11.02 11.02 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
                  />
                </svg>

                <!-- Vercel -->
                <svg v-else viewBox="0 0 24 24" class="w-6 h-6" fill="#ffffff">
                  <path d="M12 2 1 21h22L12 2z" />
                </svg>
              </div>

              <span class="text-[10px] sm:text-[11px] font-medium text-zinc-400 text-center">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
