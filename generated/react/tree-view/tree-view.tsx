import {
  connectTreeView,
  TREE_VIEW_EXPANDED_CHANGE_EVENT,
  TREE_VIEW_VALUE_CHANGE_EVENT,
  type TreeViewController,
  type TreeViewExpandedChangeDetail,
  type TreeViewSelectionMode,
  type TreeViewValueChangeDetail,
} from "@/lib/tree-view"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type TreeViewProps = Omit<ComponentPropsWithRef<"ul">, "defaultValue" | "onChange"> & {
  defaultValue?: string
  onExpandedChange?: (value: string, expanded: boolean) => void
  onValueChange?: (value: string) => void
  selectionMode?: TreeViewSelectionMode
  value?: string
}

export function TreeView({
  children,
  className,
  defaultValue,
  onExpandedChange,
  onValueChange,
  role = "tree",
  selectionMode = "single",
  value,
  ...props
}: TreeViewProps) {
  const elementRef = useRef<HTMLUListElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLUListElement, [])
  const controllerRef = useRef<TreeViewController>(null)
  const valueRef = useRef(value)
  const onExpandedChangeRef = useRef(onExpandedChange)
  const onValueChangeRef = useRef(onValueChange)
  valueRef.current = value
  onExpandedChangeRef.current = onExpandedChange
  onValueChangeRef.current = onValueChange

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectTreeView(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<TreeViewValueChangeDetail>).detail.value
      onValueChangeRef.current?.(nextValue)

      if (valueRef.current !== undefined) {
        queueMicrotask(() => controller.setValue(valueRef.current ?? ""))
      }
    }

    const handleExpandedChange = (event: Event) => {
      const detail = (event as CustomEvent<TreeViewExpandedChangeDetail>).detail
      onExpandedChangeRef.current?.(detail.value, detail.expanded)
    }

    element.addEventListener(TREE_VIEW_VALUE_CHANGE_EVENT, handleValueChange)
    element.addEventListener(TREE_VIEW_EXPANDED_CHANGE_EVENT, handleExpandedChange)

    return () => {
      element.removeEventListener(TREE_VIEW_VALUE_CHANGE_EVENT, handleValueChange)
      element.removeEventListener(TREE_VIEW_EXPANDED_CHANGE_EVENT, handleExpandedChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
  }, [selectionMode, value])

  return (
    <ul
      {...props}
      ref={elementRef}
      role={role}
      data-initial-value={value ?? defaultValue}
      data-selection-mode={selectionMode}
      data-slot="tree-view"
      className={cn("m-0 grid min-w-0 list-none gap-0.5 p-0 text-foreground", className)}
    >
      {children}
    </ul>
  )
}
