import { cn } from '@/lib/style'
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

export type SwitchProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  checked?: boolean
}

export function Switch({ children, checked, ...props }: SwitchProps) {
  return (
    <button
      {...props}
      type="button"
      aria-checked={!!checked}
      className={cn(
        'min-w-xl group relative inline-flex h-[1.25rem] flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out',
        'dark:border-fgdark/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-55 disabled:opacity-70',
        checked ? 'bg-primary hover:bg-primary/80 border-primary/20' : 'bg-fg/70 hover:bg-fg/60 border-fg/20'
      )}
    >
      <span
        className={cn(
          'bg-bg shadow-shadow dark:bg-fgdark pointer-events-none flex h-[1.4rem] w-[1.4rem] -translate-y-1 transform items-center justify-center rounded-full leading-none shadow-inner ring-0 drop-shadow-lg transition-all duration-200 ease-in-out',
          checked ? 'translate-x-lg' : '-translate-x-1'
        )}
      >
        {children}
      </span>
      <span className="sr-only">{checked ? 'On' : 'Off'}</span>
    </button>
  )
}
