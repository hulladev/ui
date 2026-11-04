import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type EmptyStateDescriptionProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
}

export function EmptyStateDescription({
  children,
  style,
  theme: override,
  ...props
}: EmptyStateDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.mutedForeground,
          fontSize: 14,
          lineHeight: 20,
          fontFamily: theme.fonts?.regular,
          textAlign: "center",
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
