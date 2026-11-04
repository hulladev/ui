import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { alpha } from "@hulla/style-native/color"
export type DropdownMenuItemProps = ComponentPropsWithRef<typeof Pressable> & {
  contentStyle?: ComponentPropsWithRef<typeof Pressable>["style"]
  theme?: NativeTheme
  destructive?: boolean
}
export function DropdownMenuItem({
  children,
  style,
  contentStyle,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  destructive = false,
  ...props
}: DropdownMenuItemProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      accessibilityState={{ ...accessibilityState, disabled: inactive }}
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
          justifyContent: "center",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="dropdown-menu-item-surface"
          style={[
            {
              minHeight: 36,
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderRadius: 0,
              backgroundColor: inactive
                ? "transparent"
                : state.pressed || focused
                  ? destructive
                    ? alpha(theme.colors.danger, theme.mode === "dark" ? 0.15 : 0.1)
                    : theme.colors.hoverSurface
                  : "transparent",
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
