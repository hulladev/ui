import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type EmptyStateTitleProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function EmptyStateTitle({
  children,
  style,
  theme: override,
  ...props
}: EmptyStateTitleProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      accessibilityRole="header"
      {...props}
      style={[
        {
          color: theme.colors.foreground,
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "600",
          fontFamily: theme.fonts?.semibold,
          letterSpacing: -0.5,
          textAlign: "center",
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
