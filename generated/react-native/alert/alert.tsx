import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { mix } from "@hulla/style-native/color"

export type AlertProps = ComponentPropsWithRef<typeof View> & {
  theme?: NativeTheme
  variant?: "note" | "success" | "important" | "warning" | "danger"
}

export function Alert({
  children,
  style,
  theme: override,
  variant = "note",
  ...props
}: AlertProps) {
  const theme = useNativeTheme(override)
  const accent =
    variant === "note"
      ? theme.colors.mutedForeground
      : variant === "important"
        ? theme.colors.primary
        : theme.colors[variant]
  return (
    <View
      accessibilityRole="summary"
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: mix(theme.colors.border, accent, 0.16),
          backgroundColor: mix(theme.colors.surface, accent, 0.03),
          borderRadius: theme.radius.md,
          paddingHorizontal: 16,
          paddingVertical: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
