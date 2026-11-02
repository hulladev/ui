import { useState, type ComponentPropsWithRef } from "react"
import { Platform, Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { isNativeDark, nativeColorAlpha } from "@/lib/native-color"
export type RadioProps = ComponentPropsWithRef<typeof Pressable> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: true) => void
  invalid?: boolean
  theme?: NativeTheme
}
export function Radio({
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
}: RadioProps) {
  const theme = useNativeTheme(override)
  const [local, setLocal] = useState(defaultChecked)
  const [focused, setFocused] = useState(false)
  const selected = checked ?? local
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  const accent = invalid ? theme.colors.danger : theme.colors.primary
  return (
    <Pressable
      accessible
      accessibilityRole="radio"
      {...props}
      disabled={inactive}
      aria-disabled={inactive}
      aria-checked={selected}
      accessibilityState={{ ...accessibilityState, disabled: inactive, checked: selected }}
      {...(Platform.OS === "web" ? { "aria-invalid": invalid || undefined } : {})}
      onPress={(event) => {
        if (inactive) return
        const prevented = event.defaultPrevented
        onPress?.(event)
        if (!prevented && event.defaultPrevented) return
        if (checked === undefined) setLocal(true)
        onCheckedChange?.(true)
      }}
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
            testID="radio-indicator"
            accessible={false}
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 1,
              borderColor: inactive
                ? selected
                  ? theme.colors.disabledForeground
                  : theme.colors.disabledBorder
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
              boxShadow: inactive ? undefined : "0px 1px 2px rgba(0,0,0,0.05)",
              alignItems: "center",
              justifyContent: "center",
              outlineWidth: focused && !inactive ? 2 : 0,
              outlineOffset: 2,
              outlineColor: invalid ? theme.colors.danger : theme.colors.focusRing,
              opacity: state.pressed && !inactive ? 0.8 : 1,
            }}
          >
            {selected ? (
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: theme.colors.primaryForeground,
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
