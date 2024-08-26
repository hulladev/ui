/** @jsxImportSource solid-js **/
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'
import { switchCn, switchFace } from '../style/tailwind.switch'

export type SwitchProps = ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>> & {
  checked?: boolean
}

export function Switch({ children, checked, ...props }: SwitchProps) {
  return (
    <button
      {...props}
      type="button"
      aria-checked={!!checked}
      class={cn(
        switchCn,
        checked ? 'bg-primary hover:bg-primary/80 border-primary/20' : 'bg-fg/70 hover:bg-fg/60 border-fg/20'
      )}
    >
      <span class={cn(switchFace, checked ? 'translate-x-lg' : '-translate-x-1')}>{children}</span>
      <span class="sr-only">{checked ? 'On' : 'Off'}</span>
    </button>
  )
}
