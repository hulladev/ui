import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { alpha } from "@hulla/style-native/color"
export type ToggleProps = ComponentPropsWithRef<typeof Pressable> & {
  variant?: "outline" | "ghost" | "inverted"
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  theme?: NativeTheme
}
export function Toggle({
  children,
  style,
  pressed,
  variant = "outline",
  defaultPressed = false,
  onPressedChange,
  theme: override,
  disabled,
  accessibilityState,
  onPress,
  onFocus,
  onBlur,
  ...props
}: ToggleProps) {
  const theme = useNativeTheme(override)
  const [local, setLocal] = useState(defaultPressed)
  const [focused, setFocused] = useState(false)
  const selected = pressed ?? local
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      aria-disabled={inactive}
      aria-pressed={selected}
      accessibilityState={{ ...accessibilityState, disabled: inactive, selected }}
      onPress={(event) => {
        if (inactive) return
        const prevented = event.defaultPrevented
        onPress?.(event)
        if (!prevented && event.defaultPrevented) return
        if (pressed === undefined) setLocal(!selected)
        onPressedChange?.(!selected)
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
          paddingVertical: 8,
          justifyContent: "center",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="toggle-surface"
          style={{
            minHeight: 32,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: theme.radius.sm,
            borderWidth: 1,
            borderColor: inactive
              ? selected
                ? alpha(theme.colors.disabledForeground, 0.4)
                : theme.colors.disabledBorder
              : selected && variant === "inverted"
                ? theme.colors.foreground
                : selected && variant === "outline"
                  ? alpha(theme.colors.primary, 0.6)
                  : variant === "ghost"
                    ? "transparent"
                    : alpha(theme.colors.foreground, 0.2),
            backgroundColor: inactive
              ? selected
                ? alpha(theme.colors.foreground, 0.1)
                : theme.colors.disabledSurface
              : selected
                ? variant === "inverted"
                  ? theme.colors.foreground
                  : theme.colors.selectedSurface
                : "transparent",
            alignItems: "center",
            justifyContent: "center",
            outlineWidth: focused && !inactive ? 2 : 0,
            outlineOffset: 2,
            outlineColor: theme.colors.focusRing,
            opacity: state.pressed && !inactive ? 0.8 : 1,
          }}
        >
          {typeof children === "function" ? children(state) : children}
        </View>
      )}
    </Pressable>
  )
}
