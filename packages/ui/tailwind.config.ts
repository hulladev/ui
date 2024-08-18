import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'
import tw from './tailwind.config.base'

export default {
  ...tw,
  plugins: [forms],
} satisfies Config
