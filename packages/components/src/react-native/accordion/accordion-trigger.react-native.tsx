import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type AccordionTriggerProps = ComponentPropsWithRef<typeof Pressable> & {
  expanded: boolean
  onExpandedChange?: (expanded: boolean) => void
  theme?: NativeTheme
}
export function AccordionTrigger({
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
}: AccordionTriggerProps) {
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
          paddingVertical: 16,
          paddingRight: 40,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          outlineWidth: focused && !inactive ? 2 : 0,
          outlineOffset: 2,
          outlineColor: theme.colors.focusRing,
          opacity: state.pressed && !inactive ? 0.8 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <>
          <View style={{ flexShrink: 1 }}>
            {typeof children === "function" ? children(state) : children}
          </View>
          <View
            accessible={false}
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 20.8,
              right: 4,
              width: 8,
              height: 8,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: inactive ? theme.colors.disabledForeground : theme.colors.foreground,
              transform: [
                { translateY: expanded ? 4 : -2 },
                { rotate: expanded ? "225deg" : "45deg" },
              ],
            }}
          />
        </>
      )}
    </Pressable>
  )
}
