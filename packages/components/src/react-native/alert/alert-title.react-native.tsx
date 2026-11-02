import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type AlertTitleProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function AlertTitle({ children, style, theme: override, ...props }: AlertTitleProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.foreground,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "600",
          fontFamily: theme.fonts?.semibold,
          letterSpacing: -0.14,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
