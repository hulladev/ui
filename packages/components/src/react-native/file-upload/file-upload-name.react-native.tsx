import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type FileUploadNameProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function FileUploadName({
  children,
  style,
  theme: override,
  ...props
}: FileUploadNameProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          flex: 1,
          minWidth: 0,
          color: theme.colors.foreground,
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
