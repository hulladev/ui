import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type CardDescriptionProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function CardDescription({
  children,
  style,
  theme: override,
  ...props
}: CardDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.mutedForeground,
          fontSize: 14,
          lineHeight: 24,
          fontFamily: theme.fonts?.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
