<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps({
  index: {
    type: String,
    default: '01',
  },
  subtitle: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
})

const wrapperRef = ref(null)
const giantTitleRef = ref(null)
const metaRef = ref(null)

let mm = null

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.value,
        start: 'top 88%',
        end: 'top 30%',
        scrub: 0.8,
      },
    })

    // Giant bold title starts huge & settles into place
    tl.fromTo(
      giantTitleRef.value,
      {
        scale: 1.48,
        y: 65,
        opacity: 0.12,
        transformOrigin: 'left center',
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out',
      },
      0
    )

    tl.fromTo(
      metaRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, ease: 'power2.out' },
      0.15
    )
  })
})

onBeforeUnmount(() => {
  if (mm) mm.revert()
})
</script>

<template>
  <div ref="wrapperRef" class="mb-14 sm:mb-20 overflow-hidden">
    <div
      ref="metaRef"
      class="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-emerald-400 mb-3"
    >
      <span class="font-mono text-zinc-500">// {{ index }}</span>
      <span>{{ subtitle }}</span>
    </div>

    <h2
      ref="giantTitleRef"
      class="text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold uppercase tracking-[-0.04em] leading-[0.92] text-white will-change-transform"
    >
      {{ title }}
    </h2>

    <div class="mt-6 w-full h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent"></div>
  </div>
</template>

