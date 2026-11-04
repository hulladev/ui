import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type FileUploadDescriptionProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
}
export function FileUploadDescription({
  children,
  style,
  theme: override,
  ...props
}: FileUploadDescriptionProps) {
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
