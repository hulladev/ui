import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CommandItemProps = Omit<ComponentPropsWithRef<"div">, "value"> & {
  disabled?: boolean
  keywords?: string[]
  textValue?: string
  value: string
}

export function CommandItem({
  children,
  className,
  disabled = false,
  keywords = [],
  textValue,
  value,
  ...props
}: CommandItemProps) {
  return (
    <div
      {...props}
      aria-disabled={disabled ? "true" : undefined}
      aria-selected="false"
      role="option"
      data-disabled={disabled ? "true" : "false"}
      data-keywords={keywords.join(" ")}
      data-slot="command-item"
      data-text-value={textValue}
      data-value={value}
      className={cn(
        "group/command-item relative flex min-h-9 w-full cursor-pointer select-none items-center gap-2.5 rounded-md px-2 py-2 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 data-[selected]:bg-hover-surface data-[selected]:text-foreground data-[disabled=true]:cursor-not-allowed aria-disabled:cursor-not-allowed data-[disabled=true]:text-disabled-foreground motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
    >
      {children}
    </div>
  )
}
