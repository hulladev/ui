import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, ReactNode } from "react"

export type CommandInputProps = ComponentPropsWithRef<"input"> & {
  icon?: ReactNode
}

export function CommandInput({
  autoComplete = "off",
  className,
  icon,
  placeholder = "Type a command or search…",
  role = "combobox",
  spellCheck = false,
  type = "search",
  ...props
}: CommandInputProps) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-3.5"
    >
      <span
        aria-hidden="true"
        data-slot="command-input-icon"
        className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
      >
        {icon === undefined ? (
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="m10.25 10.25 3 3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
        ) : (
          icon
        )}
      </span>
      <input
        {...props}
        aria-autocomplete="list"
        aria-expanded="true"
        autoComplete={autoComplete}
        placeholder={placeholder}
        role={role}
        spellCheck={spellCheck}
        type={type}
        data-slot="command-input"
        className={cn(
          "h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-sm text-foreground caret-primary outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
          className
        )}
      />
    </div>
  )
}
