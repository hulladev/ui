import { cn } from '@/lib/style'
import type { DetailedHTMLProps, DetailsHTMLAttributes, PropsWithChildren } from 'react'
import { menu } from '../style/tailwind.menu'

type BaseProps = DetailedHTMLProps<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>
export type MenuProps = PropsWithChildren<BaseProps>

export function Menu({ children, className, ...props }: MenuProps) {
  return (
    <details {...props} className={cn(menu, className)}>
      {children}
    </details>
  )
}
