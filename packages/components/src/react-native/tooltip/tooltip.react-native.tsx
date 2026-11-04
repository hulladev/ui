import { useState, type ReactNode, type ComponentPropsWithRef } from "react"
import { Platform, Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type TooltipProps = ComponentPropsWithRef<typeof Pressable> & {
  content: ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  theme?: NativeTheme
}
/** Native help is a visible tap disclosure. Essential instructions belong inline. */
export function Tooltip({
  children,
  content,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  theme: override,
  style,
  disabled,
  accessibilityState,
  onPress,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: TooltipProps) {
  const theme = useNativeTheme(override)
  const [local, setLocal] = useState(defaultExpanded)
  const [focused, setFocused] = useState(false)
  const open = expanded ?? local
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  function change(next: boolean) {
    if (expanded === undefined) setLocal(next)
    onExpandedChange?.(next)
  }
  return (
    <>
      <Pressable
        accessibilityRole="button"
        {...props}
        disabled={inactive}
        aria-expanded={open}
        accessibilityState={{ ...accessibilityState, expanded: open, disabled: inactive }}
        onPress={(event) => {
          const prevented = event.defaultPrevented
          onPress?.(event)
          if (inactive || (!prevented && event.defaultPrevented)) return
          change(!open)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            Platform.OS === "web" &&
            !event.defaultPrevented &&
            (event.nativeEvent as { key?: string }).key === "Escape" &&
            open
          ) {
            event.preventDefault()
            change(false)
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
            alignSelf: "flex-start",
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: inactive ? theme.colors.disabledBorder : theme.colors.primaryText,
            borderStyle: "dotted",
            outlineWidth: focused && !inactive ? 2 : 0,
            outlineColor: theme.colors.focusRing,
            outlineOffset: 2,
            opacity: inactive ? 0.5 : state.pressed ? 0.8 : 1,
          },
          typeof style === "function" ? style(state) : style,
        ]}
      >
        {(state) => (typeof children === "function" ? children(state) : children)}
      </Pressable>
      {open ? (
        <View testID="tooltip-content" accessibilityLiveRegion="polite">
          {content}
        </View>
      ) : null}
    </>
  )
}
