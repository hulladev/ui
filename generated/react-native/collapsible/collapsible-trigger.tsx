import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type CollapsibleTriggerProps = ComponentPropsWithRef<typeof Pressable> & {
  expanded: boolean
  onExpandedChange?: (expanded: boolean) => void
  theme?: NativeTheme
}
export function CollapsibleTrigger({
  children,
  style,
  expanded,
  onExpandedChange,
  theme: override,
  disabled,
  accessibilityState,
  onPress,
  onFocus,
  onBlur,
  ...props
}: CollapsibleTriggerProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      accessibilityState={{ ...accessibilityState, expanded, disabled: inactive }}
      aria-expanded={expanded}
      onPress={(event) => {
        if (inactive) return
        const prevented = event.defaultPrevented
        onPress?.(event)
        if (!prevented && event.defaultPrevented) return
        onExpandedChange?.(!expanded)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      style={(state) => [
        {
          minHeight: 48,
          minWidth: 48,
          paddingVertical: 6,
          justifyContent: "center",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          style={{
            minHeight: 36,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: theme.radius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: state.pressed && !inactive ? theme.colors.hoverSurface : "transparent",
            outlineWidth: focused && !inactive ? 2 : 0,
            outlineOffset: 2,
            outlineColor: theme.colors.focusRing,
          }}
        >
          <View style={{ flexShrink: 1 }}>
            {typeof children === "function" ? children(state) : children}
          </View>
          <View
            accessible={false}
            pointerEvents="none"
            style={{
              marginLeft: "auto",
              width: 8,
              height: 8,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: inactive ? theme.colors.disabledForeground : theme.colors.foreground,
              transform: [
                { translateX: expanded ? 0 : -2 },
                { translateY: expanded ? -2 : 0 },
                { rotate: expanded ? "45deg" : "-45deg" },
              ],
            }}
          />
        </View>
      )}
    </Pressable>
  )
}
