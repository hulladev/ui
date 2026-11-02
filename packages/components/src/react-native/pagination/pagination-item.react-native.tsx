import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type PaginationItemProps = ComponentPropsWithRef<typeof Pressable> & {
  current?: boolean
  theme?: NativeTheme
}
export function PaginationItem({
  children,
  style,
  current = false,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  ...props
}: PaginationItemProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      aria-current={current ? "page" : undefined}
      accessibilityState={{ ...accessibilityState, disabled: inactive, selected: current }}
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
          paddingVertical: 6,
          alignItems: "center",
          justifyContent: "center",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="pagination-surface"
          style={{
            minHeight: 36,
            minWidth: 36,
            borderRadius: theme.radius.md,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
            backgroundColor:
              current && !inactive
                ? theme.colors.foreground
                : state.pressed && !inactive
                  ? theme.colors.hoverSurface
                  : "transparent",
            boxShadow:
              current && !inactive
                ? "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)"
                : undefined,
            outlineWidth: focused && !inactive ? 2 : 0,
            outlineColor: theme.colors.focusRing,
            outlineOffset: 2,
          }}
        >
          {typeof children === "function" ? children(state) : children}
        </View>
      )}
    </Pressable>
  )
}
