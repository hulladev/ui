import type { Config } from 'tailwindcss'

// You can adjust these values to change the color scheme of the site
const theme = {
  hue: 215,
  saturation: 90,
  lightness: 50,
}

// ^ autocalculated based on theme values
export const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  // standard values
  primary: `hsl(${theme.hue}, ${theme.saturation}%, ${theme.lightness}%)`,
  secondary: `hsl(${theme.hue + 65}, ${theme.saturation}%, ${theme.lightness}%)`,
  fg: `hsl(${theme.hue}, ${theme.saturation}%, 10%)`,
  bg: `hsl(${theme.hue}, ${theme.saturation - 90}%, 85%)`,
  // value states
  success: `hsl(145.5, ${theme.saturation - 30}%, ${theme.lightness}%)`,
  warning: `hsl(36.8, ${theme.saturation - 10}%, ${theme.lightness}%)`,
  error: `hsl(5.61, ${theme.saturation - 10}%, ${theme.lightness}%)`,
  // dark mode values
  bgdark: `hsl(${theme.hue}, ${theme.saturation - 20}%, 5%)`,
  fgdark: `hsl(${theme.hue}, ${theme.saturation - 50}%, 90%)`,
  shadowdark: `hsl(${theme.hue}, 30% 92%)`,
}

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    colors,
    extend: {
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
        '4xl': '8rem',
        '5xl': '10rem',
        '6xl': '12rem',
        '7xl': '16rem',
        '8xl': '20rem',
        '9xl': '32rem',
      },
      transitionProperty: {
        height: 'height, max-height min-height',
        width: 'width, max-width, min-width',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animated')],
} satisfies Config
