import type { ComponentPropsWithRef } from "react"
import { ActivityIndicator } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type SpinnerProps = ComponentPropsWithRef<typeof ActivityIndicator> & { theme?: NativeTheme }

export function Spinner({ theme: override, color, ...props }: SpinnerProps) {
  const theme = useNativeTheme(override)
  return <ActivityIndicator color={color ?? theme.colors.primary} {...props} />
}
