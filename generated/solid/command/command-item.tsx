import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CommandItemProps = Omit<JSX.IntrinsicElements["div"], "value"> & {
  disabled?: boolean
  keywords?: string[]
  textValue?: string
  value: string
}

export function CommandItem(props: CommandItemProps) {
  const [local, rest] = splitProps(mergeProps({ disabled: false, keywords: [] } as const, props), [
    "children",
    "class",
    "disabled",
    "keywords",
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
      data-keywords={local.keywords.join(" ")}
      data-slot="command-item"
      data-text-value={local.textValue}
      data-value={local.value}
      class={cn(
        "group/command-item relative flex min-h-9 w-full cursor-default select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 data-[selected]:bg-foreground/[0.065] data-[selected]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-42 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
