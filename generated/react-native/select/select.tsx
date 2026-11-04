import { useState, type ComponentPropsWithRef, type ReactNode } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { alpha } from "@hulla/style-native/color"
export type SelectProps = ComponentPropsWithRef<typeof Pressable> & {
  contentStyle?: ComponentPropsWithRef<typeof Pressable>["style"]
  theme?: NativeTheme
  expanded?: boolean
  indicator?: ReactNode
}
export function Select({
  children,
  style,
  contentStyle,
  theme: override,
  expanded = false,
  indicator,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  ...props
}: SelectProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      aria-expanded={expanded}
      accessibilityState={{ ...accessibilityState, disabled: inactive, expanded }}
      onFocus={(e) => {
        setFocused(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        onBlur?.(e)
      }}
      style={(state) => [
        {
          minHeight: 48,
          minWidth: 48,
          paddingVertical: 4,
          justifyContent: "center",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="select-surface"
          style={[
            {
              minHeight: 40,
              borderWidth: 1,
              borderColor: inactive
                ? theme.colors.disabledBorder
                : focused
                  ? theme.colors.focusRing
                  : alpha(theme.colors.foreground, 0.25),
              borderRadius: theme.radius.md,
              paddingHorizontal: 12,
              paddingVertical: 9,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: inactive ? theme.colors.disabledSurface : theme.colors.surface,
              boxShadow: inactive ? "none" : "inset 0 1px 2px rgba(0,0,0,0.025)",
              outlineWidth: focused && !inactive ? 2 : 0,
              outlineOffset: 0,
              outlineColor: alpha(theme.colors.focusRing, 0.25),
            },
            typeof contentStyle === "function" ? contentStyle(state) : contentStyle,
          ]}
        >
          {typeof children === "function" ? children(state) : children}
          {indicator === undefined ? (
            <View
              accessible={false}
              style={{
                marginLeft: "auto",
                marginRight: 2,
                width: 8,
                height: 8,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderColor: inactive ? theme.colors.disabledForeground : theme.colors.foreground,
                opacity: 0.55,
                transform: [
                  { translateY: expanded ? 1 : -2 },
                  { rotate: expanded ? "225deg" : "45deg" },
                ],
              }}
            />
          ) : (
            <View accessible={false} style={{ marginLeft: "auto", justifyContent: "center" }}>
              {indicator}
            </View>
          )}
        </View>
      )}
    </Pressable>
  )
}
