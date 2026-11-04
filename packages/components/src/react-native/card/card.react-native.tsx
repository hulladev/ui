import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type CardProps = ComponentPropsWithRef<typeof View> & {
  theme?: NativeTheme
  variant?: "outline" | "elevated" | "ghost"
}

export function Card({
  children,
  style,
  theme: override,
  variant = "outline",
  ...props
}: CardProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor:
            variant === "ghost"
              ? "transparent"
              : variant === "elevated"
                ? theme.colors.surfaceRaised
                : theme.colors.surface,
          borderColor: variant === "ghost" ? "transparent" : theme.colors.border,
          borderWidth: 1,
          borderRadius: theme.radius.lg,
          padding: 24,
          gap: 24,
          boxShadow:
            variant === "ghost"
              ? undefined
              : variant === "elevated"
                ? theme.mode === "dark"
                  ? "0px 2px 4px -2px rgba(0,0,0,0.18), 0px 12px 32px -12px rgba(0,0,0,0.5), inset 0px 1px 0px rgba(255,255,255,0.05)"
                  : "0px 2px 4px -2px rgba(0,0,0,0.08), 0px 12px 32px -12px rgba(0,0,0,0.14)"
                : "0px 1px 2px rgba(0,0,0,0.05)",
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
