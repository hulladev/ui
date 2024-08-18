import { cn } from '@/lib/style'
import type { DetailedHTMLProps, DetailsHTMLAttributes, PropsWithChildren } from 'react'
import { menutitle } from '../style/tailwind.menu'

type BaseProps = DetailedHTMLProps<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>
export type MenuTitleProps = PropsWithChildren<BaseProps>

export function MenuTitle({ children, className, ...props }: MenuTitleProps) {
  return (
    <summary {...props} className={cn(menutitle, className)}>
      {children}
      <svg viewBox="0 -9 3 24" className="h-[1.5rem] w-[2rem] rotate-0 transition-transform group-open:rotate-90">
        <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      </svg>
    </summary>
  )
}
