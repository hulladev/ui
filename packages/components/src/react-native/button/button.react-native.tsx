import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
import { buttonColors, type ButtonVariant } from "./colors"
import { alpha, mix } from "@hulla/style-native/color"

export type ButtonProps = ComponentPropsWithRef<typeof Pressable> & {
  contentStyle?: ComponentPropsWithRef<typeof Pressable>["style"]
  variant?: ButtonVariant
  theme?: NativeTheme
}

export function Button({
  children,
  style,
  contentStyle,
  variant = "primary",
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  ...props
}: ButtonProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  const colors = buttonColors(theme, variant, inactive)
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
          paddingVertical: 8,
          alignItems: "center",
          justifyContent: "center",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="button-surface"
          style={[
            {
              minHeight: 32,
              minWidth: 32,
              alignSelf: "stretch",
              borderRadius: theme.radius.sm,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor:
                state.pressed && !inactive
                  ? variant === "primary" || (variant === "danger" && theme.mode !== "dark")
                    ? mix(
                        colors.background,
                        theme.mode === "dark" ? theme.colors.background : theme.colors.foreground,
                        0.24
                      )
                    : variant === "inverted"
                      ? alpha(theme.colors.foreground, 0.7)
                      : variant === "secondary"
                        ? alpha(theme.colors.foreground, theme.mode === "dark" ? 0.25 : 0.15)
                        : variant === "danger"
                          ? alpha(theme.colors.danger, 0.25)
                          : alpha(theme.colors.foreground, 0.12)
                  : colors.background,
              paddingHorizontal: 12,
              paddingVertical: 5,
              boxShadow:
                !inactive &&
                !state.pressed &&
                (variant === "primary" ||
                  variant === "inverted" ||
                  (variant === "danger" && theme.mode !== "dark"))
                  ? theme.mode === "dark"
                    ? "0px 1px 2px rgba(0,0,0,0.3), inset 0px 1px 0px rgba(255,255,255,0.1)"
                    : "0px 1px 2px rgba(0,0,0,0.1), inset 0px 1px 0px rgba(255,255,255,0.12)"
                  : undefined,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              outlineWidth: focused && !inactive ? 2 : 0,
              outlineColor: theme.colors.focusRing,
              outlineOffset: 2,
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
