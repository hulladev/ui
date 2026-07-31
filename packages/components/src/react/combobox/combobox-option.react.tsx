import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, ReactNode } from "react"

export type ComboboxOptionProps = Omit<ComponentPropsWithRef<"div">, "value"> & {
  disabled?: boolean
  indicator?: ReactNode
  textValue?: string
  value: string
}

export function ComboboxOption({
  children,
  className,
  disabled = false,
  indicator,
  textValue,
  value,
  ...props
}: ComboboxOptionProps) {
  return (
    <div
      {...props}
      aria-disabled={disabled ? "true" : undefined}
      aria-selected="false"
      role="option"
      data-disabled={disabled ? "true" : "false"}
      data-slot="combobox-option"
      data-text-value={textValue}
      data-value={value}
      className={cn(
        "group/combobox-option flex min-h-8 w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 data-[highlighted]:bg-foreground/[0.06] data-[selected]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-45 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
    >
      {children}
      <span
        aria-hidden="true"
        data-slot="combobox-option-indicator"
        className="ml-auto flex size-4 shrink-0 items-center justify-center text-primary opacity-0 transition-opacity duration-100 group-data-[selected]/combobox-option:opacity-100 motion-reduce:transition-none"
      >
        {indicator === undefined ? (
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="m3.25 8.25 3 3 6.5-6.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
            />
          </svg>
        ) : (
          indicator
        )}
      </span>
    </div>
  )
}
