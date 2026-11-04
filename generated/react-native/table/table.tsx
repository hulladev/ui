import type { ComponentPropsWithRef } from "react"
import { ScrollView } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type TableProps = Omit<ComponentPropsWithRef<typeof ScrollView>, "horizontal"> & {
  theme?: NativeTheme
}

export function Table({
  children,
  style,
  contentContainerStyle,
  theme: override,
  ...props
}: TableProps) {
  const theme = useNativeTheme(override)
  return (
    <ScrollView
      accessibilityLabel="Scrollable data table"
      {...props}
      horizontal
      style={[{ backgroundColor: theme.colors.surface }, style]}
      contentContainerStyle={[{ flexDirection: "column" }, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  )
}
