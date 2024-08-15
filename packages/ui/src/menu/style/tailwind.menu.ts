import { cn } from '@/lib/declare'

export const menu = cn('group flex items-center')
export const menuitem = cn(
  'hover:bg-fg/10 dark:hover:bg-fgdark/20 py-sm px-md text-fg/80 hover:text-fg dark:text-fgdark/80 dark:hover:text-fgdark data-[active]:bg-primary/20 data-[active]:text-primary dark:data-[active]:text-primary data-[active]:hover:bg-primary/30 dark:data-[active]:hover:bg-primary/30 w-full cursor-pointer rounded-md text-sm transition-colors active:animate-pulse active:duration-150 data-[nested]:py-0 data-[nested]:hover:bg-transparent dark:data-[nested]:hover:bg-transparent'
)
export const menulist = cn('space-y-sm w-full')
export const menutitle = cn(
  'gap-md hover:bg-fg/10 dark:hover:bg-fgdark/20 py-sm px-xs group-open:mb-sm text-fg/80 hover:text-fg dark:text-fgdark/80 dark:hover:text-fgdark flex w-full cursor-pointer list-none appearance-none items-center justify-between rounded-md transition-colors'
)
export const menutoggle = cn('h-[1.5rem] w-[2rem] rotate-0 transition-transform group-open:rotate-90')
