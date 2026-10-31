<script setup>
import { ref } from 'vue'
import { portfolioData } from '../data/portfolio'

defineProps({
  className: {
    type: String,
    default: 'w-48 h-auto',
  },
  strokeWidth: {
    type: [Number, String],
    default: 4,
  },
})

const pathRef = ref(null)

defineExpose({
  pathRef,
})
</script>

<template>
  <!--
    ==========================================================================
    HANDWRITTEN SIGNATURE SVG
    ==========================================================================
    To replace your signature SVG path, edit `portfolioData.signature` inside
    `src/data/portfolio.js` or replace the `<path>` below directly.
  -->
  <svg
    :viewBox="portfolioData.signature.viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
    aria-label="Clarence Millares Handwritten Signature"
  >
    <path
      ref="pathRef"
      :d="portfolioData.signature.path"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

