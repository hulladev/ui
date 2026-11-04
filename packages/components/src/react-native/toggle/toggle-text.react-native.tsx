import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type ToggleTextProps = ComponentPropsWithRef<typeof Text> & {
  pressed?: boolean
  disabled?: boolean
  variant?: "outline" | "ghost" | "inverted"
  theme?: NativeTheme
}
export function ToggleText({
  children,
  style,
  pressed = false,
  disabled = false,
  variant = "outline",
  theme: override,
  ...props
}: ToggleTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          color: disabled
            ? theme.colors.disabledForeground
            : pressed
              ? variant === "inverted"
                ? theme.colors.background
                : theme.colors.primaryText
              : variant === "ghost"
                ? theme.colors.mutedForeground
                : theme.colors.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
