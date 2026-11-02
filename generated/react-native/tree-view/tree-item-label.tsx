import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type TreeItemLabelProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  selected?: boolean
  disabled?: boolean
}

export function TreeItemLabel({
  children,
  style,
  selected = false,
  disabled = false,
  theme: override,
  ...props
}: TreeItemLabelProps) {
  const theme = useNativeTheme(override)
  const inactive = disabled || Boolean(props["aria-disabled"])
  return (
    <Text
      {...props}
      style={[
        {
          color: inactive
            ? theme.colors.disabledForeground
            : selected
              ? theme.colors.primaryText
              : theme.colors.mutedForeground,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: selected ? "500" : "400",
          fontFamily: selected ? theme.fonts?.medium : theme.fonts?.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
