import { vn } from '@/lib/style'
import type { VariantProps } from '@hulla/style'
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react'

export const css = vn({
  base: 'rounded-md px-md py-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all active:translate-y-0.5',
  props: {
    variant: {
      default:
        'bg-dark text-light hover:bg-dark/85 focus-visible:outline-dark dark:bg-light dark:text-dark dark:hover:bg-light/95 dark:focus-visible:outline-light',
      primary: 'bg-primary-500 text-light hover:bg-primary-500/90 focus-visible:outline-primary-500',
      outline:
        'bg-transparent text-dark border border-dark hover:bg-dark/5 focus-visible:outline-dark dark:text-light dark:border-light dark:hover:bg-light/10 dark:focus-visible:outline-light',
      ghost: 'bg-transparent text-dark shadow-none dark:text-light',
    },
    size: {
      sm: 'text-sm px-sm py-xs',
      md: 'text-md px-md py-sm',
      lg: 'text-lg px-xl py-md',
    },
  },
  defaults: {
    variant: 'default',
    size: 'md',
  },
})

type BaseProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type Props = PropsWithChildren<BaseProps & VariantProps<typeof css>>

export function Button({ children, ...props }: Props) {
  return (
    <button {...props} className={css(props)}>
      {children}
    </button>
  )
}
