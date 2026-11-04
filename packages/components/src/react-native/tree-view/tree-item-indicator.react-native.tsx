import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type TreeItemIndicatorProps = ComponentPropsWithRef<typeof View> & {
  theme?: NativeTheme
  expanded?: boolean
  selected?: boolean
  disabled?: boolean
}
export function TreeItemIndicator({
  children,
  style,
  expanded,
  selected = false,
  disabled = false,
  theme: override,
  ...props
}: TreeItemIndicatorProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      accessible={false}
      {...props}
      style={[
        {
          width: 14,
          height: 14,
          alignItems: "center",
          justifyContent: "center",
          opacity: expanded === undefined ? 0 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderColor: disabled
            ? theme.colors.disabledForeground
            : selected
              ? theme.colors.primaryText
              : theme.colors.mutedForeground,
          transform: [{ rotate: expanded ? "135deg" : "45deg" }],
        }}
      />
      {children}
    </View>
  )
}
