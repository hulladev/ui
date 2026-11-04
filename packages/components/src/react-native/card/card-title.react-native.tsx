import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type CardTitleProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function CardTitle({ children, style, theme: override, ...props }: CardTitleProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      accessibilityRole="header"
      {...props}
      style={[
        {
          color: theme.colors.foreground,
          letterSpacing: -0.5,
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "600",
          fontFamily: theme.fonts?.semibold,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
