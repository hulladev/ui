import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type TabProps = ComponentPropsWithRef<typeof Pressable> & {
  selected: boolean
  theme?: NativeTheme
}
export function Tab({
  children,
  style,
  selected,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  ...props
}: TabProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="tab"
      {...props}
      disabled={inactive}
      accessibilityState={{ ...accessibilityState, selected, disabled: inactive }}
      aria-selected={selected}
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
          paddingTop: 8,
          alignItems: "center",
          justifyContent: "flex-end",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          style={{
            minHeight: 40,
            alignSelf: "stretch",
            paddingHorizontal: 12,
            paddingVertical: 8,
            alignItems: "center",
            justifyContent: "center",
            borderTopLeftRadius: theme.radius.sm,
            borderTopRightRadius: theme.radius.sm,
            backgroundColor: selected && !inactive ? theme.colors.selectedSurface : "transparent",
            outlineWidth: focused && !inactive ? 2 : 0,
            outlineColor: theme.colors.focusRing,
            outlineOffset: -2,
            opacity: state.pressed && !inactive ? 0.8 : 1,
          }}
        >
          {typeof children === "function" ? children(state) : children}
          {selected ? (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 2,
                borderRadius: 1,
                backgroundColor: inactive ? theme.colors.disabledForeground : theme.colors.primary,
              }}
            />
          ) : null}
        </View>
      )}
    </Pressable>
  )
}
