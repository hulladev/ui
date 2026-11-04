import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { buttonColors, type ButtonVariant } from "./colors"

export type ButtonTextProps = ComponentPropsWithRef<typeof Text> & {
  variant?: ButtonVariant
  disabled?: boolean
  theme?: NativeTheme
}

export function ButtonText({
  children,
  style,
  variant = "primary",
  disabled = false,
  theme: override,
  ...props
}: ButtonTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          letterSpacing: -0.14,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          color: buttonColors(theme, variant, disabled).foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
