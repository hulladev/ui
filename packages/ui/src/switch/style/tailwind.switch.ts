import { cn } from '@/lib/declare'

export const switchCn = cn(
  'min-w-xl group relative inline-flex h-[1.25rem] flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out',
  'dark:border-fgdark/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-55 disabled:opacity-70'
)

export const switchFace = cn(
  'bg-bg shadow-shadow dark:bg-fgdark pointer-events-none flex h-[1.4rem] w-[1.4rem] -translate-y-1 transform items-center justify-center rounded-full leading-none shadow-inner ring-0 drop-shadow-lg transition-all duration-200 ease-in-out'
)
