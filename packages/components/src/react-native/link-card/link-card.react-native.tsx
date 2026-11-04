import { useState, type ComponentPropsWithRef } from "react"
import { Platform, Pressable } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type LinkCardProps = ComponentPropsWithRef<typeof Pressable> & { theme?: NativeTheme }

export function LinkCard({
  children,
  style,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  onKeyDown,
  onHoverIn,
  onHoverOut,
  ...props
}: LinkCardProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const selected = props["aria-selected"] ?? accessibilityState?.selected
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="link"
      {...props}
      disabled={inactive}
      aria-disabled={inactive}
      accessibilityState={{ ...accessibilityState, disabled: inactive, selected }}
      {...(Platform.OS === "web" ? { "aria-current": selected ? "page" : undefined } : {})}
      onHoverIn={(event) => {
        setHovered(true)
        onHoverIn?.(event)
      }}
      onHoverOut={(event) => {
        setHovered(false)
        onHoverOut?.(event)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (Platform.OS !== "web" || inactive || event.defaultPrevented) return
        const key = event.nativeEvent as { key?: string; repeat?: boolean }
        if (key.key !== "Enter") return
        const host = event.currentTarget as unknown as {
          tagName: string
          getAttribute: (name: string) => string | null
          click: () => void
        }
        // RN Web expects role=link to have anchor activation; a native Pressable has no href.
        if (host.tagName === "A" || host.getAttribute("role") !== "link") return
        event.preventDefault()
        event.stopPropagation()
        if (!key.repeat) host.click()
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
          alignItems: "flex-start",
          padding: 12,
          gap: 12,
          borderRadius: theme.radius.md,
          backgroundColor: inactive
            ? "transparent"
            : selected
              ? hovered || state.pressed
                ? theme.colors.selectedHoverSurface
                : theme.colors.selectedSurface
              : hovered || state.pressed
                ? theme.colors.hoverSurface
                : "transparent",
          transform: [{ translateY: state.pressed && !inactive ? 1 : 0 }],
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
