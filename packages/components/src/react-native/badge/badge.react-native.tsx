import type { ComponentPropsWithRef } from "react"
import { Platform, Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
import { alpha } from "@hulla/style-native/color"

export type BadgeProps = ComponentPropsWithRef<typeof Text> & {
  variant?: "neutral" | "primary" | "success" | "warning" | "danger"
  theme?: NativeTheme
}

export function Badge({
  children,
  style,
  variant = "neutral",
  theme: override,
  ...props
}: BadgeProps) {
  const theme = useNativeTheme(override)
  const dark = theme.mode === "dark"
  const accent = variant === "neutral" ? theme.colors.foreground : theme.colors[variant]
  return (
    <Text
      {...(Platform.OS === "web" ? { dataSet: { variant } } : {})}
      {...props}
      style={[
        {
          alignSelf: "flex-start",
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "transparent",
          backgroundColor:
            variant === "neutral"
              ? alpha(accent, dark ? 0.15 : 0.1)
              : dark
                ? alpha(accent, 0.15)
                : accent,
          color:
            variant === "neutral"
              ? theme.colors.foreground
              : dark
                ? variant === "primary"
                  ? theme.colors.primaryText
                  : accent
                : variant === "primary"
                  ? theme.colors.primaryForeground
                  : theme.colors.onEmphasis,
          fontFamily: theme.fonts?.medium,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "500",
          paddingHorizontal: 8,
          paddingVertical: 2,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
