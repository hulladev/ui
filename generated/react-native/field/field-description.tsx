import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type FieldDescriptionProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function FieldDescription({
  children,
  style,
  theme: override,
  ...props
}: FieldDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.mutedForeground,
          fontSize: 13,
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
