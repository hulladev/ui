import type { FrameworksKeys } from './types'

export const intros = [
  'What will be your next masterpiece?',
  'Seems like a perfect day for some breathtaking UI!',
  'At your service!',
  'Ready to create something amazing?',
  "Let's make your application shine!",
  'Time to bring your ideas to life!',
  'Creating stunning UI has never been easier!',
  "Let's add some magic to your application!",
  'Ready to transform your ideas into reality?',
  'Time to create something extraordinary!',
  'Ready to take your application to the next level?',
  'Your creativity is the limit!',
  "Let's make your application unforgettable!",
  'Time to elevate your application!',
  'Ready to craft some stunning UI?',
  "Let's bring your vision to life!",
  'Creating beautiful UI is just a few clicks away!',
  'Ready to make your application the talk of the town?',
  'Time to give your application a fresh look!',
  'Time to wow your next visitor!',
  'Your design journey starts here!',
  'Unleash your creativity!',
  'Accessibility? No problem!',
  'Bring your UI ideas to life!',
  'I believe in you! ❤️',
  'Keep up the great work! ❤️',
  'Resposiveness? No problem!',
  'How can I assist you today?',
]

export const required_config_properties = ['framework', 'output', 'style', 'config']
export const supported_frameworks = ['react', 'react-native', 'astro', 'solid'] satisfies FrameworksKeys[]

export const GH_API = {
  availableComponents: 'repos/hulladev/ui/contents/packages/ui/src',
  generated: 'repos/hulladev/ui/contents/generated',
  https: {
    standard: 'https://api.github.com/',
    raw: 'https://raw.githubusercontent.com/hulladev/ui/master/',
  },
  api: {
    standard: 'gh api ',
    raw: 'gh api ',
  },
}

export const extensions = {
  astro: '.astro',
  react: '.tsx',
  'react-native': '.tsx',
  solid: '.tsx',
} as Record<FrameworksKeys, string>
