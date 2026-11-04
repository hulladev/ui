import { useState, type ComponentPropsWithRef } from "react"
import { Pressable } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type ListItemProps = ComponentPropsWithRef<typeof Pressable> & { theme?: NativeTheme }

export function ListItem({
  children,
  style,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  ...props
}: ListItemProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      aria-disabled={inactive}
      aria-selected={props["aria-selected"] ?? accessibilityState?.selected}
      aria-expanded={props["aria-expanded"] ?? accessibilityState?.expanded}
      aria-busy={props["aria-busy"] ?? accessibilityState?.busy}
      accessibilityState={{ ...accessibilityState, disabled: inactive }}
      onHoverIn={(event) => {
        setHovered(true)
        onHoverIn?.(event)
      }}
      onHoverOut={(event) => {
        setHovered(false)
        onHoverOut?.(event)
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
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 12,
          borderRadius: theme.radius.md,
          backgroundColor:
            (hovered || state.pressed) && !inactive ? theme.colors.hoverSurface : "transparent",

          outlineWidth: focused && !inactive ? 2 : 0,
          outlineColor: theme.colors.focusRing,
          outlineOffset: -2,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (typeof children === "function" ? children(state) : children)}
    </Pressable>
  )
}
