import { createMutableRef, exposeRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
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

export type TreeViewProps = Omit<JSX.IntrinsicElements["ul"], "defaultValue" | "onChange"> & {
  defaultValue?: string
  onExpandedChange?: (value: string, expanded: boolean) => void
  onValueChange?: (value: string) => void
  selectionMode?: TreeViewSelectionMode
  value?: string
}

export function TreeView(props: TreeViewProps) {
  const [local, rest] = splitProps(
    mergeProps({ role: "tree", selectionMode: "single" } as const, props),
    [
      "children",
      "class",
      "defaultValue",
      "onExpandedChange",
      "onValueChange",
      "role",
      "selectionMode",
      "value",
    ]
  )

  const elementRef = createMutableRef<HTMLUListElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLUListElement, [])
  const controllerRef = createMutableRef<TreeViewController>(null)
  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectTreeView(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<TreeViewValueChangeDetail>).detail.value
      local.onValueChange?.(nextValue)

      if (local.value !== undefined) {
        queueMicrotask(() => controller.setValue(local.value ?? ""))
      }
    }

    const handleExpandedChange = (event: Event) => {
      const detail = (event as CustomEvent<TreeViewExpandedChangeDetail>).detail
      local.onExpandedChange?.(detail.value, detail.expanded)
    }

    element.addEventListener(TREE_VIEW_VALUE_CHANGE_EVENT, handleValueChange)
    element.addEventListener(TREE_VIEW_EXPANDED_CHANGE_EVENT, handleExpandedChange)

    return () => {
      element.removeEventListener(TREE_VIEW_VALUE_CHANGE_EVENT, handleValueChange)
      element.removeEventListener(TREE_VIEW_EXPANDED_CHANGE_EVENT, handleExpandedChange)
      controller.destroy()
      controllerRef.current = null
    }
  })

  createLifecycleEffect(
    () => {
      const controller = controllerRef.current
      if (!controller) return
      controller.refresh()
      if (local.value !== undefined) controller.setValue(local.value)
    },
    () => [local.selectionMode, local.value]
  )

  return (
    <ul
      {...rest}
      ref={elementRef}
      role={local.role}
      data-initial-value={local.value ?? local.defaultValue}
      data-selection-mode={local.selectionMode}
      data-slot="tree-view"
      class={cn("m-0 grid min-w-0 list-none gap-0.5 p-0 text-foreground", local.class)}
    >
      {local.children}
    </ul>
  )
}
