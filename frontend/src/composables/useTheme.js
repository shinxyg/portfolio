import { ref } from 'vue'

const isDark = ref(true)

export function useTheme() {
  const initTheme = () => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = true // default to dark portfolio
    }
    applyTheme(isDark.value)
  }

  const applyTheme = (dark) => {
    if (typeof document === 'undefined') return
    if (dark) {
      document.documentElement.classList.add('dark')
      document.body?.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body?.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = (event) => {
    if (typeof document === 'undefined') return

    const willBeDark = !isDark.value

    // If browser does not support startViewTransition, toggle directly
    if (!document.startViewTransition) {
      isDark.value = willBeDark
      applyTheme(willBeDark)
      return
    }

    let x = window.innerWidth - 60
    let y = 40

    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    document.documentElement.style.setProperty('--ripple-x', `${x}px`)
    document.documentElement.style.setProperty('--ripple-y', `${y}px`)
    document.documentElement.style.setProperty('--ripple-radius', `${endRadius}px`)

    const transition = document.startViewTransition(() => {
      isDark.value = willBeDark
      applyTheme(willBeDark)
    })

    transition.ready.catch(() => {})
  }

  return {
    isDark,
    initTheme,
    toggleTheme,
  }
}

