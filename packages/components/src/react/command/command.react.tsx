import { COMMAND_SELECT_EVENT, connectCommand, type CommandSelectDetail } from "@/lib/command"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type CommandProps = Omit<ComponentPropsWithRef<"div">, "onSelect"> & {
  filter?: boolean
  loop?: boolean
  onSelect?: (value: string) => void
}

export function Command({
  children,
  className,
  filter = true,
  loop = true,
  onSelect,
  ...props
}: CommandProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectCommand(element)
    const handleSelect = (event: Event) => {
      onSelectRef.current?.((event as CustomEvent<CommandSelectDetail>).detail.value)
    }
    element.addEventListener(COMMAND_SELECT_EVENT, handleSelect)

    return () => {
      element.removeEventListener(COMMAND_SELECT_EVENT, handleSelect)
      controller.destroy()
    }
  }, [])

  return (
    <div
      {...props}
      ref={elementRef}
      data-filter={filter ? "true" : "false"}
      data-loop={loop ? "true" : "false"}
      data-slot="command"
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface-raised text-foreground shadow-lg",
        className
      )}
    >
      {children}
    </div>
  )
}
