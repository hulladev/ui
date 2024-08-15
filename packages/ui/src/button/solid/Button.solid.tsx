/** @jsxImportSource solid-js **/
import { vn } from '@/lib/style'
import type { VariantProps } from '@hulla/style'
import type { ParentProps } from 'solid-js'
import { button } from '../style/tailwind.button'

const css = vn(button)

export type Props = ParentProps<VariantProps<typeof css>>

export function Button({ children, ...props }: Props) {
  return (
    <button {...props} class={css(props)}>
      {children}
    </button>
  )
}
