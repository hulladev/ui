import { vn } from '@/style'
import type { VariantProps } from '@hulla/style'
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react'

const css = vn({})

type BaseProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type Props = PropsWithChildren<BaseProps & VariantProps<typeof css>>

export function Button({ children, ...props }: Props) {
  return (
    <button {...props} className={css(props)}>
      {children}
    </button>
  )
}
