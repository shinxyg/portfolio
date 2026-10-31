<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Github, Linkedin, Mail, Link2 } from 'lucide-vue-next'
import SignatureSvg from './SignatureSvg.vue'
import { portfolioData } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const titleWrapRef = ref(null)
const leftColRef = ref(null)
const rightCardRef = ref(null)

const submitted = ref(false)
const form = ref({
  name: '',
  email: '',
  message: '',
})

let mm = null

const iconMap = {
  Github,
  Linkedin,
  Mail,
  Link2,
}

function handleSubmit() {
  submitted.value = true
  setTimeout(() => {
    form.value = { name: '', email: '', message: '' }
  }, 400)
}

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // 1. Giant "CONTACT" title starts large & settles slightly upward (00:43 -> 00:45)
    gsap.fromTo(
      titleWrapRef.value,
      { y: 90, scale: 1.08, opacity: 0.25, transformOrigin: 'left top' },
      {
        y: -25,
        scale: 0.95,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          end: 'top 15%',
          scrub: 0.8,
        },
      }
    )

    // 2. Left unboxed info column & Right "Send a Message" card reveal
    gsap.fromTo(
      [leftColRef.value, rightCardRef.value],
      { opacity: 0, y: 55 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })
})

onBeforeUnmount(() => {
  if (mm) mm.revert()
})
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="relative pt-24 sm:pt-32 pb-20 px-6 sm:px-12 lg:px-20 video-ambient-bg overflow-hidden"
  >
    <div class="max-w-6xl mx-auto">
      <!-- Giant "CONTACT" Title (00:43 -> 00:45) -->
      <div ref="titleWrapRef" class="mb-10 sm:mb-14 select-none pointer-events-none will-change-transform">
        <p class="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.35em] text-zinc-500 mb-2">
          GET IN TOUCH
        </p>
        <h2
          class="text-[clamp(4rem,11.5vw,9.5rem)] font-black uppercase tracking-[-0.04em] leading-[0.86] text-white"
        >
          CONTACT
        </h2>
      </div>

      <!-- 2-Column Content (matching 00:44 - 00:45) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <!-- Left Column: Unboxed Typography + Socials + Summary + Handwritten Signature -->
        <div ref="leftColRef" class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 class="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3.5">
              Let’s build something great.
            </h3>

            <p class="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-md mb-7">
              I’m currently available for freelance work and open to new opportunities. Reach out
              if you have a project in mind or just want to connect.
            </p>

            <!-- 4 Rounded-Square Social Icons -->
            <div class="flex items-center gap-2.5 mb-10">
              <a
                v-for="social in portfolioData.socials"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="social.name"
                class="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                <component :is="iconMap[social.icon]" class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- Personal Summary + Signature at Bottom-Left (matching 00:45) -->
          <div class="pt-6 border-t border-white/10">
            <h4 class="text-sm font-bold text-white mb-1">
              {{ portfolioData.personal.shortName }}
            </h4>
            <p class="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-400 mb-1">
              {{ portfolioData.personal.title }}
            </p>
            <p class="text-[10px] text-zinc-500 mb-5">
              {{ portfolioData.personal.location }} · {{ portfolioData.personal.email }}
            </p>

            <SignatureSvg
              className="w-28 sm:w-32 h-auto text-white/75"
              :strokeWidth="3.8"
            />
          </div>
        </div>

        <!-- Right Column: "Send a Message" Dark Card (matching 00:45) -->
        <div
          ref="rightCardRef"
          class="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0b0d0c]/90 p-7 sm:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
        >
          <h3 class="text-base sm:text-lg font-bold text-white mb-6">
            Send a Message
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  for="contact-name"
                  class="block text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2"
                >
                  NAME
                </label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Clarence Millares"
                  class="w-full rounded-lg border border-white/10 bg-black/70 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-white/40 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  for="contact-email"
                  class="block text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2"
                >
                  EMAIL
                </label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="clarence@example.com"
                  class="w-full rounded-lg border border-white/10 bg-black/70 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-white/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                for="contact-message"
                class="block text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2"
              >
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="4"
                required
                placeholder="Tell me about your project..."
                class="w-full rounded-lg border border-white/10 bg-black/70 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-white/40 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full py-3 rounded-lg bg-white text-black text-xs font-semibold tracking-wide hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Send Message
            </button>

            <p
              v-if="submitted"
              class="text-center text-[11px] text-zinc-300 pt-1"
            >
              Message sent! I will get back to you soon.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
