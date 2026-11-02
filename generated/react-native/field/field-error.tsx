import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type FieldErrorProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function FieldError({ children, style, theme: override, ...props }: FieldErrorProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      {...props}
      style={[
        {
          color: theme.colors.danger,
          fontSize: 13,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
