import { useState, type ComponentPropsWithRef } from "react"
import { Platform, Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type SelectItemProps = ComponentPropsWithRef<typeof Pressable> & {
  contentStyle?: ComponentPropsWithRef<typeof Pressable>["style"]
  theme?: NativeTheme
  selected?: boolean
}
export function SelectItem({
  children,
  style,
  contentStyle,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  onKeyDown,
  selected = false,
  ...props
}: SelectItemProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="radio"
      {...props}
      disabled={inactive}
      accessibilityState={{ ...accessibilityState, disabled: inactive, checked: selected }}
      aria-checked={selected}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (Platform.OS !== "web" || inactive || event.defaultPrevented) return
        const key = event.nativeEvent as { key?: string; repeat?: boolean }
        if (key.key === " " || key.key === "Spacebar") {
          event.preventDefault()
          event.stopPropagation()
          if (!key.repeat) (event.currentTarget as unknown as { click: () => void }).click()
        }
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
          testID="select-item-surface"
          style={[
            {
              minHeight: 36,
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderRadius: 0,
              backgroundColor: inactive
                ? "transparent"
                : selected
                  ? state.pressed || focused
                    ? theme.colors.selectedHoverSurface
                    : theme.colors.selectedSurface
                  : state.pressed || focused
                    ? theme.colors.hoverSurface
                    : "transparent",
            },
            typeof contentStyle === "function" ? contentStyle(state) : contentStyle,
          ]}
        >
          {typeof children === "function" ? children(state) : children}
          <View
            accessible={false}
            testID="selection-mark"
            style={{
              marginLeft: "auto",
              width: 16,
              height: 16,
              alignItems: "center",
              justifyContent: "center",
              opacity: selected ? 1 : 0,
            }}
          >
            <View
              style={{
                width: 6,
                height: 11,
                borderRightWidth: 1.75,
                borderBottomWidth: 1.75,
                borderColor: inactive ? theme.colors.disabledForeground : theme.colors.primaryText,
                transform: [{ rotate: "45deg" }],
                marginTop: -3,
              }}
            />
          </View>
        </View>
      )}
    </Pressable>
  )
}
