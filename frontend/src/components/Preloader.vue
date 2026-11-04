<script setup>
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'
import SignatureSvg from './SignatureSvg.vue'

const emit = defineEmits(['complete'])

const overlayRef = ref(null)
const backdropRef = ref(null)
const sigWrapperRef = ref(null)
const signatureCompRef = ref(null)
const progressContainerRef = ref(null)
const progressBarRef = ref(null)

const progress = ref(0)
const isDone = ref(false)

const statusText = computed(() => {
  const val = Math.round(progress.value)
  return val >= 100 ? 'READY 100%' : `LOADING ${val}%`
})

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const pathEl = signatureCompRef.value?.pathRef

  if (prefersReducedMotion || !pathEl) {
    progress.value = 100
    isDone.value = true
    emit('complete')
    return
  }

  const totalLength = pathEl.getTotalLength ? pathEl.getTotalLength() : 650

  gsap.set(pathEl, {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength,
  })

  const state = { value: 0 }

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
  })

  // 1. Draw handwritten signature (~3.5s) + fill progress bar 0 -> 100%
  tl.to(
    pathEl,
    {
      strokeDashoffset: 0,
      duration: 3.5,
      ease: 'power2.inOut',
    },
    0
  )

  tl.to(
    state,
    {
      value: 100,
      duration: 3.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        progress.value = state.value
      },
    },
    0
  )

  tl.to(
    progressBarRef.value,
    {
      scaleX: 1,
      duration: 3.5,
      ease: 'power2.inOut',
    },
    0
  )

  // Hold briefly at READY 100% (5.0s total preloader choreography)
  tl.to({}, { duration: 0.5 })

  // 2. Fade out progress line & text
  tl.to(
    progressContainerRef.value,
    {
      opacity: 0,
      y: 8,
      duration: 0.35,
      ease: 'power2.in',
    },
    'flyToNav'
  )

  // 3. Scale down and fly signature to top-left navbar logo anchor (00:05 -> 00:06)
  tl.to(
    sigWrapperRef.value,
    {
      x: () => {
        const anchor = document.getElementById('navbar-logo-anchor')
        if (!anchor || !sigWrapperRef.value) return -window.innerWidth * 0.4
        const anchorRect = anchor.getBoundingClientRect()
        const sigRect = sigWrapperRef.value.getBoundingClientRect()
        return anchorRect.left + anchorRect.width / 2 - (sigRect.left + sigRect.width / 2)
      },
      y: () => {
        const anchor = document.getElementById('navbar-logo-anchor')
        if (!anchor || !sigWrapperRef.value) return -window.innerHeight * 0.42
        const anchorRect = anchor.getBoundingClientRect()
        const sigRect = sigWrapperRef.value.getBoundingClientRect()
        return anchorRect.top + anchorRect.height / 2 - (sigRect.top + sigRect.height / 2)
      },
      scale: () => {
        const anchor = document.getElementById('navbar-logo-anchor')
        if (!anchor || !sigWrapperRef.value) return 0.28
        const anchorRect = anchor.getBoundingClientRect()
        const sigRect = sigWrapperRef.value.getBoundingClientRect()
        return anchorRect.width / sigRect.width
      },
      duration: 1.0,
      ease: 'expo.inOut',
    },
    'flyToNav'
  )

  // 4. Fade out dark backdrop
  tl.to(
    backdropRef.value,
    {
      opacity: 0,
      duration: 0.9,
      ease: 'power3.inOut',
    },
    'flyToNav+=0.18'
  )

  tl.add(() => {
    isDone.value = true
    emit('complete')
  })
})
</script>

<template>
  <div
    v-if="!isDone"
    ref="overlayRef"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto select-none"
    aria-live="polite"
  >
    <!-- Pure Black + Subtle Dark Forest-Green Radial Backdrop (matching video 00:00-00:05) -->
    <div
      ref="backdropRef"
      class="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(12,48,26,0.35)_0%,#000000_70%)] bg-black"
    ></div>

    <!-- Center Handwritten Signature SVG -->
    <div ref="sigWrapperRef" class="relative z-10 flex items-center justify-center text-white">
      <SignatureSvg
        ref="signatureCompRef"
        className="w-60 sm:w-72 md:w-80 h-auto text-white"
        :strokeWidth="3.6"
      />
    </div>

    <!-- Thin Progress Line + Tiny Uppercase Status Text -->
    <div
      ref="progressContainerRef"
      class="relative z-10 mt-7 flex flex-col items-center w-44 sm:w-52"
    >
      <div class="w-full h-px bg-white/15 overflow-hidden">
        <div
          ref="progressBarRef"
          class="w-full h-full bg-white origin-left scale-x-0"
        ></div>
      </div>

      <p class="mt-2.5 text-[9px] font-medium uppercase tracking-[0.38em] text-zinc-400">
        {{ statusText }}
      </p>
    </div>
  </div>
</template>
