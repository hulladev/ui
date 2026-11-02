import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type FieldLabelProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function FieldLabel({ children, style, theme: override, ...props }: FieldLabelProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.foreground,
          letterSpacing: -0.14,
          fontSize: 14,
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
