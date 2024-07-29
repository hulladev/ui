import type { Config } from 'tailwindcss'
import { default as twColors } from 'tailwindcss/colors'

const colors = {
  // these just carry-over the tailwind colors since they're useful utilities
  transparent: twColors.transparent,
  inherit: twColors.inherit,
  current: twColors.current,
  // your theme configuration starts here:
  bg: '#080808',
  fg: '#ededed',
  primary: twColors.blue,
  secondary: twColors.emerald,
  tertiary: twColors.violet,
} as const

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    colors,
  },
} satisfies Config
