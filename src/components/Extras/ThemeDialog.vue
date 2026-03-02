<template>
  <v-btn
    icon
    rounded="circle"
    class="mr-2"  
    height="40"
    width="40"
  >
    <v-icon size="22" @click="toggleTheme">
      {{ isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
    </v-icon>
  </v-btn>
</template>

<script>
import { useTheme } from 'vuetify'

export default {
  setup() {
    const theme = useTheme()
    return { theme }
  },

  data() {
    return {
      isDark: false,
    }
  },

  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      const newTheme = this.isDark ? 'dark' : 'light'

      this.theme.change(newTheme)
      localStorage.setItem('APP_THEME', newTheme)
    },
  },

  mounted() {
    const savedTheme = localStorage.getItem('APP_THEME')

    // 1️⃣ If user already chose a theme → use it
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.isDark = savedTheme === 'dark'
      this.theme.change(savedTheme)
      return
    }

    // 2️⃣ First time → use system theme
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    this.isDark = prefersDark
    this.theme.change(prefersDark ? 'dark' : 'light')
  },
}
</script>

<style >
  
</style>