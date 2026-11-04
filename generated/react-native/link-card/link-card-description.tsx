import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type LinkCardDescriptionProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
}

export function LinkCardDescription({
  children,
  disabled = false,
  style,
  theme: override,
  ...props
}: LinkCardDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: disabled ? theme.colors.disabledForeground : theme.colors.mutedForeground,
          fontSize: 12,
          lineHeight: 20,
          fontFamily: theme.fonts?.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
