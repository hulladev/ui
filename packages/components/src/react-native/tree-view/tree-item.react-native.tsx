import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type TreeItemProps = ComponentPropsWithRef<typeof Pressable> & {
  theme?: NativeTheme
  contentStyle?: ComponentPropsWithRef<typeof Pressable>["style"]
}
export function TreeItem({
  children,
  style,
  contentStyle,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  ...props
}: TreeItemProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  const expanded = props["aria-expanded"] ?? accessibilityState?.expanded
  const selected = props["aria-selected"] ?? accessibilityState?.selected
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      aria-disabled={inactive}
      aria-expanded={expanded}
      aria-selected={selected}
      accessibilityState={{ ...accessibilityState, disabled: inactive, expanded, selected }}
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
        { minHeight: 48, minWidth: 48, justifyContent: "center", outlineWidth: 0 },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="tree-item-surface"
          style={[
            {
              minHeight: 32,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 8,
              paddingVertical: 6,
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
              outlineWidth: focused && !inactive ? 2 : 0,
              outlineOffset: -2,
              outlineColor: theme.colors.focusRing,
            },
            typeof contentStyle === "function" ? contentStyle(state) : contentStyle,
          ]}
        >
          {typeof children === "function" ? children(state) : children}
        </View>
      )}
    </Pressable>
  )
}
