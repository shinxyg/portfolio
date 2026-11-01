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
            <div class="h-px flex-1 bg-white/10"></div>
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

                <!-- PostgreSQL -->
                <img
                  v-else-if="item.slug === 'postgresql'"
                  src="/icons/postgresql.png"
                  alt="PostgreSQL"
                  class="w-7 h-7 object-contain"
                />

                <!-- MySQL -->
                <svg
                  v-else-if="item.slug === 'mysql'"
                  viewBox="0 0 512 349"
                  class="w-7 h-7"
                >
                  <path fill="#00758F" d="m152.31 230.297l15.56 50.487c3.496 11.463 4.954 19.465 4.37 24.026q12.765-34.188 17.839-74.513h18.71q-12.069 65.65-31.827 95.41c-10.262 15.289-21.504 22.933-33.746 22.933c-3.264 0-7.288-.986-12.063-2.944v-10.55c2.333.342 5.07.525 8.218.525q8.565-.002 13.816-4.742c4.193-3.849 6.292-8.175 6.292-12.97c0-3.274-1.637-9.993-4.896-20.157l-21.68-67.505zM33.223 199.266l28.5 86.956h.176l28.675-86.956h23.428c5.13 43.124 8.16 82.581 9.09 118.346H103.34q-1.044-50.148-5.768-94.32H97.4l-30.078 94.32H52.28l-29.896-94.32h-.176q-3.325 42.422-4.196 94.32H0c1.164-42.08 4.077-81.525 8.739-118.346z"/>
                  <path fill="#F29111" d="M352.498 197.51c30.657 0 45.986 19.586 45.986 58.739c0 21.276-4.61 37.347-13.821 48.204c-1.66 1.984-3.495 3.698-5.427 5.286l21.695 10.727l-.021-.001l-7.703 13.302l-28.253-16.485q-7.026 2.08-15.451 2.08c-15.053 0-26.297-4.387-33.731-13.15c-8.16-9.694-12.238-24.955-12.238-45.757c0-21.156 4.602-37.166 13.816-48.037c8.392-9.944 20.11-14.909 35.148-14.909"/>
                </svg>

                <!-- Railway -->
                <svg
                  v-else-if="item.slug === 'railway'"
                  viewBox="0 0 1024 1024"
                  class="w-7 h-7"
                  fill="none"
                >
                  <path d="M4.8 438.2A520.7 520.7 0 000 489.7h777.8c-2.7-5.3-6.4-10-10-14.7-133-171.8-204.5-157-306.9-161.3-34-1.4-57.2-2-193-2-72.7 0-151.7.2-228.6.4A621 621 0 0015 386.3h398.6v51.9H4.8zm779.1 103.5H.4c.8 13.8 2.1 27.5 4 41h723.4c32.2 0 50.3-18.3 56.1-41zM45 724.3s120 294.5 466.5 299.7c207 0 385-123 465.9-299.7H45z" fill="#ffffff"/>
                  <path d="M511.5 0A512.2 512.2 0 0065.3 260.6l202.7-.2c158.4 0 164.2.6 195.2 2l19.1.6c66.7 2.3 148.7 9.4 213.2 58.2 35 26.5 85.6 85 115.7 126.5 27.9 38.5 35.9 82.8 17 125.2-17.5 39-55 62.2-100.4 62.2H16.7s4.2 18 10.6 37.8h970.6a510.4 510.4 0 0026.1-160.7A512.4 512.4 0 00511.5 0z" fill="#ffffff"/>
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

                <!-- ChatGPT -->
                <svg v-else-if="item.slug === 'chatgpt'" viewBox="0 0 24 24" class="w-7 h-7" fill="#10a37f">
                  <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.946-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
                </svg>

                <!-- Claude -->
                <img
                  v-else-if="item.slug === 'claude'"
                  src="/icons/claude.png"
                  alt="Claude"
                  class="w-7 h-7 object-contain rounded-md"
                />

                <!-- Gemini -->
                <svg v-else-if="item.slug === 'gemini'" viewBox="0 0 24 24" class="w-7 h-7">
                  <defs>
                    <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#1ba0e2" />
                      <stop offset="50%" stop-color="#9b72cb" />
                      <stop offset="100%" stop-color="#d96570" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#gemini-grad)" d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001.503.503 0 000 .93 14.147 14.147 0 014.45 3.001 14.111 14.111 0 013.678 6.452.503.503 0 00.975 0 14.134 14.134 0 013.679-6.452 14.155 14.155 0 014.45-3.001.503.503 0 000-.93z"/>
                </svg>

                <!-- DeepSeek -->
                <img
                  v-else-if="item.slug === 'deepseek'"
                  src="/icons/deepseek.png"
                  alt="DeepSeek"
                  class="w-7 h-7 object-contain"
                />

                <!-- Antigravity -->
                <img
                  v-else-if="item.slug === 'antigravity'"
                  src="/icons/antigravity.png"
                  alt="Antigravity"
                  class="w-7 h-7 object-contain"
                />

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
