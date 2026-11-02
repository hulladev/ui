import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type AvatarFallbackProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function AvatarFallback({
  children,
  style,
  theme: override,
  ...props
}: AvatarFallbackProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.mutedForeground,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          letterSpacing: -0.28,
          textTransform: "uppercase",
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
