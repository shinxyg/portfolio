<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SocialIcon from './SocialIcon.vue'
import SignatureSvg from './SignatureSvg.vue'
import { portfolioData } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const titleWrapRef = ref(null)
const leftColRef = ref(null)
const rightCardRef = ref(null)
const signatureComponentRef = ref(null)

const isSubmitting = ref(false)
const submitStatus = ref(null) // 'success' | 'error' | null
const statusMessage = ref('')
const form = ref({
  name: '',
  email: '',
  message: '',
})

let mm = null

// iconMap replaced by SocialIcon component

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  submitStatus.value = null
  statusMessage.value = ''

  const payload = {
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    message: form.value.message.trim(),
    access_key: '8a8b3878-f063-4da4-a3bf-464c024a1591',
    subject: `Portfolio Message from ${form.value.name.trim()}`,
    from_name: 'Portfolio Contact',
  }

  try {
    // 1. Direct submit to Web3Forms (browser client-side delivery to Gmail)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (response.ok && data.success !== false) {
      submitStatus.value = 'success'
      statusMessage.value = "Message sent successfully! I'll get back to you soon."
      form.value = { name: '', email: '', message: '' }

      // 2. Also log to local backend database asynchronously if running
      try {
        fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            message: payload.message,
          }),
        }).catch(() => {})
      } catch {}
    } else {
      submitStatus.value = 'error'
      statusMessage.value = data.error || data.message || 'Failed to send message. Please try again.'
    }
  } catch (err) {
    submitStatus.value = 'error'
    statusMessage.value = 'Network error. Please try again or email me directly at renmillares111@gmail.com.'
  } finally {
    isSubmitting.value = false
    if (submitStatus.value) {
      setTimeout(() => {
        submitStatus.value = null
      }, 5000)
    }
  }
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

    // 3. Live handwriting ink tracing animation for signature on scroll
    const pathEl = signatureComponentRef.value?.pathRef || signatureComponentRef.value?.$el?.querySelector('path')
    if (pathEl && typeof pathEl.getTotalLength === 'function') {
      const pathLength = pathEl.getTotalLength()
      gsap.set(pathEl, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      })

      gsap.to(pathEl, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: pathEl,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      })
    }
  })
})

function replaySignature() {
  const pathEl = signatureComponentRef.value?.pathRef || signatureComponentRef.value?.$el?.querySelector('path')
  if (pathEl && typeof pathEl.getTotalLength === 'function') {
    const pathLength = pathEl.getTotalLength()
    gsap.fromTo(
      pathEl,
      { strokeDashoffset: pathLength },
      { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }
    )
  }
}

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
          class="text-[clamp(4rem,11.5vw,9.5rem)] font-black uppercase tracking-[-0.04em] leading-[0.86] text-zinc-950 dark:text-white transition-colors duration-300"
        >
          CONTACT
        </h2>
      </div>

      <!-- 2-Column Content (matching 00:44 - 00:45) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <!-- Left Column: Unboxed Typography + Socials + Summary + Handwritten Signature -->
        <div ref="leftColRef" class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3.5 transition-colors duration-300">
              Let’s build something great.
            </h3>

            <p class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-md mb-7 transition-colors duration-300">
              I'm actively looking for junior full-stack or frontend opportunities. Feel free to reach out if you're hiring, want to collaborate, or just want to connect.
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
                class="w-9 h-9 rounded-lg border border-zinc-300 bg-white/80 dark:border-white/15 dark:bg-white/3 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-500 dark:hover:border-white/40 transition-all duration-300 shadow-sm"
              >
                <SocialIcon :name="social.name" className="w-4 h-4" />
              </a>
            </div>
          </div>

          <!-- Personal Summary + Signature at Bottom-Left (matching 00:45) -->
          <div class="pt-6 border-t border-black/10 dark:border-white/10">
            <h4 class="text-sm font-bold text-zinc-900 dark:text-white mb-1 transition-colors duration-300">
              {{ portfolioData.personal.shortName }}
            </h4>
            <p class="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400 mb-1 transition-colors duration-300">
              {{ portfolioData.personal.title }}
            </p>
            <p class="text-[10px] text-zinc-500 mb-5">
              {{ portfolioData.personal.location }} · {{ portfolioData.personal.email }}
            </p>

            <SignatureSvg
              ref="signatureComponentRef"
              @click="replaySignature"
              title="Click to replay signature animation"
              className="w-28 sm:w-32 h-auto text-zinc-900/80 dark:text-white/75 transition-colors duration-300 cursor-pointer hover:opacity-100"
              :strokeWidth="3.8"
            />
          </div>
        </div>

        <!-- Right Column: "Send a Message" Dark Card (matching 00:45) -->
        <div
          ref="rightCardRef"
          class="lg:col-span-7 rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0b0d0c]/90 p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.8)] transition-colors duration-300"
        >
          <h3 class="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mb-6 transition-colors duration-300">
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
                  class="w-full rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-black/70 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-zinc-500 dark:focus:border-white/40 focus:outline-none transition-colors"
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
                  class="w-full rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-black/70 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-zinc-500 dark:focus:border-white/40 focus:outline-none transition-colors"
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
                class="w-full rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-black/70 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-zinc-500 dark:focus:border-white/40 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black text-xs font-semibold tracking-wide hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin h-3.5 w-3.5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isSubmitting ? 'Sending Message...' : 'Send Message' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Minimalist Floating Bottom Toast Popup (No Icons) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-6 opacity-0 scale-95"
        enter-to-class="transform translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100 scale-100"
        leave-to-class="transform translate-y-6 opacity-0 scale-95"
      >
        <div
          v-if="submitStatus"
          class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <div
            :class="[
              'px-6 py-3 rounded-full backdrop-blur-2xl shadow-2xl text-xs sm:text-[13px] font-medium tracking-wide border transition-all duration-300 select-none text-center whitespace-nowrap',
              submitStatus === 'success'
                ? 'bg-white/95 text-zinc-900 border-emerald-600/30 shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:bg-[#090b0a]/95 dark:text-zinc-100 dark:border-emerald-500/40 dark:shadow-[0_15px_45px_rgba(16,185,129,0.18),0_25px_60px_rgba(0,0,0,0.9)]'
                : 'bg-white/95 text-red-700 border-red-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:bg-[#0d0909]/95 dark:text-red-300 dark:border-red-500/40 dark:shadow-[0_15px_45px_rgba(239,68,68,0.18),0_25px_60px_rgba(0,0,0,0.9)]'
            ]"
          >
            {{ statusMessage }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
