import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type ComboboxOptionProps = Omit<JSX.IntrinsicElements["div"], "value"> & {
  disabled?: boolean
  indicator?: JSX.Element
  textValue?: string
  value: string
}

export function ComboboxOption(props: ComboboxOptionProps) {
  const [local, rest] = splitProps(mergeProps({ disabled: false } as const, props), [
    "children",
    "class",
    "disabled",
    "indicator",
    "textValue",
    "value",
  ])

  return (
    <div
      {...rest}
      aria-disabled={local.disabled ? "true" : undefined}
      aria-selected="false"
      role="option"
      data-disabled={local.disabled ? "true" : "false"}
      data-slot="combobox-option"
      data-text-value={local.textValue}
      data-value={local.value}
      class={cn(
        "group/combobox-option flex min-h-8 w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 data-[highlighted]:bg-foreground/[0.06] data-[selected]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-45 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        local.class
      )}
    >
      {local.children}
      <span
        aria-hidden="true"
        data-slot="combobox-option-indicator"
        class="ml-auto flex size-4 shrink-0 items-center justify-center text-primary opacity-0 transition-opacity duration-100 group-data-[selected]/combobox-option:opacity-100 motion-reduce:transition-none"
      >
        {local.indicator === undefined ? (
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="m3.25 8.25 3 3 6.5-6.5"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
            />
          </svg>
        ) : (
          local.indicator
        )}
      </span>
    </div>
  )
}
