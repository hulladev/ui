import { useState, type ComponentPropsWithRef } from "react"
import { Pressable } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type BreadcrumbProps = ComponentPropsWithRef<typeof Pressable> & {
  current?: boolean
  theme?: NativeTheme
}
export function Breadcrumb({
  children,
  style,
  current = false,
  theme: override,
  onFocus,
  onBlur,
  disabled,
  ...props
}: BreadcrumbProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || props.accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole={current ? "text" : "link"}
      {...props}
      disabled={inactive || current}
      aria-current={current ? "page" : undefined}
      accessibilityState={{
        ...props.accessibilityState,
        disabled: inactive,
        selected: current,
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      style={(state) => [
        {
          minHeight: 48,
          minWidth: 48,
          paddingHorizontal: 6,
          justifyContent: "center",
          outlineWidth: focused && !inactive ? 2 : 0,
          outlineColor: theme.colors.focusRing,
          outlineOffset: 2,
          opacity: inactive ? 0.5 : state.pressed ? 0.8 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {children}
    </Pressable>
  )
}
