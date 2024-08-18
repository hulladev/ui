import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'
import tw from './downloads/tailwind/config'

export default {
  ...tw,
  plugins: [forms],
} satisfies Config
