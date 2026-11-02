import { useState, type ComponentPropsWithRef } from "react"
import { Platform, Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { isNativeDark, nativeColorAlpha } from "@/lib/native-color"

export type CheckboxProps = ComponentPropsWithRef<typeof Pressable> & {
  checked?: boolean | "mixed"
  defaultChecked?: boolean | "mixed"
  onCheckedChange?: (checked: boolean) => void
  invalid?: boolean
  theme?: NativeTheme
}

export function Checkbox({
  children,
  style,
  checked,
  defaultChecked = false,
  onCheckedChange,
  invalid = false,
  theme: override,
  disabled,
  accessibilityState,
  onPress,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}: CheckboxProps) {
  const theme = useNativeTheme(override)
  const [localChecked, setLocalChecked] = useState(defaultChecked)
  const [focused, setFocused] = useState(false)
  const value = checked ?? localChecked
  const selected = value === true || value === "mixed"
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  const accent = invalid ? theme.colors.danger : theme.colors.primary
  return (
    <Pressable
      accessible
      accessibilityRole="checkbox"
      {...props}
      {...(Platform.OS === "web" ? { "aria-invalid": invalid || undefined } : {})}
      disabled={inactive}
      aria-disabled={inactive}
      aria-checked={value}
      accessibilityState={{ ...accessibilityState, disabled: inactive, checked: value }}
      onPress={(event) => {
        if (inactive) return
        const alreadyPrevented = event.defaultPrevented
        onPress?.(event)
        if (!alreadyPrevented && event.defaultPrevented) return
        const next = value !== true
        if (checked === undefined) setLocalChecked(next)
        onCheckedChange?.(next)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (Platform.OS !== "web" || inactive || event.defaultPrevented) return
        // React Native Web supplies Space activation for button roles, not checkbox roles.
        const key = event.nativeEvent as { key?: string; repeat?: boolean }
        if (key.key === " " || key.key === "Spacebar") {
          event.preventDefault()
          event.stopPropagation()
          if (!key.repeat) {
            const host = event.currentTarget as unknown as { click: () => void }
            host.click()
          }
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
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <>
          <View
            accessible={false}
            testID="checkbox-indicator"
            style={{
              width: 18,
              height: 18,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: inactive
                ? theme.colors.disabledBorder
                : selected || invalid
                  ? accent
                  : theme.colors.border,
              backgroundColor: inactive
                ? selected
                  ? theme.colors.disabledForeground
                  : theme.colors.disabledSurface
                : selected
                  ? accent
                  : isNativeDark(theme)
                    ? nativeColorAlpha(theme.colors.foreground, 0.1)
                    : theme.colors.surface,
              outlineWidth: focused && !inactive ? 2 : 0,
              outlineOffset: 2,
              outlineColor: invalid ? theme.colors.danger : theme.colors.focusRing,
              boxShadow: inactive ? undefined : "0px 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {value === "mixed" ? (
              <View
                style={{
                  width: 8,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: theme.colors.primaryForeground,
                }}
              />
            ) : value === true ? (
              <View
                style={{
                  width: 5,
                  height: 9,
                  marginTop: -2,
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: theme.colors.primaryForeground,
                  transform: [{ rotate: "45deg" }],
                }}
              />
            ) : null}
          </View>
          {typeof children === "function" ? children(state) : children}
        </>
      )}
    </Pressable>
  )
}
