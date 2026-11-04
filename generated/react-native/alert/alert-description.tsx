import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type AlertDescriptionProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function AlertDescription({
  children,
  style,
  theme: override,
  ...props
}: AlertDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          marginTop: 4,
          color: theme.colors.mutedForeground,
          fontSize: 14,
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
