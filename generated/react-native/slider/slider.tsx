import { useMemo, useRef, useState, type ComponentPropsWithRef } from "react"
import {
  PanResponder,
  Platform,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { isNativeDark, nativeColorAlpha } from "@/lib/native-color"
export type SliderProps = Omit<ComponentPropsWithRef<typeof Pressable>, "children"> & {
  containerStyle?: StyleProp<ViewStyle>
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  onSlidingComplete?: (value: number) => void
  min?: number
  max?: number
  step?: number
  theme?: NativeTheme
}
export function Slider({
  style,
  containerStyle,
  value,
  defaultValue = 0,
  onValueChange,
  onSlidingComplete,
  min = 0,
  max = 100,
  step = 1,
  theme: override,
  disabled,
  accessibilityState,
  onLayout,
  onPress,
  onPressIn,
  onFocus,
  onBlur,
  onKeyDown,
  onAccessibilityAction,
  ...props
}: SliderProps) {
  const theme = useNativeTheme(override)
  const low = Number.isFinite(min) ? min : 0
  const high = Number.isFinite(max) ? Math.max(low, max) : Math.max(low, 100)
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  const normalize = (number: number) =>
    Math.min(
      high,
      Math.max(
        low,
        Number(
          (
            low +
            Math.round(((Number.isFinite(number) ? number : low) - low) / increment) * increment
          ).toFixed(8)
        )
      )
    )
  const [local, setLocal] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const resolved = normalize(value ?? local)
  const inactive = Boolean(
    disabled || accessibilityState?.disabled || props["aria-disabled"] || high === low
  )
  const width = useRef(0)
  const start = useRef(resolved)
  const moved = useRef(false)
  const last = useRef(resolved)
  const publish = (next: number, complete = false) => {
    const normalized = normalize(next)
    last.current = normalized
    if (value === undefined) setLocal(normalized)
    onValueChange?.(normalized)
    if (complete) onSlidingComplete?.(normalized)
  }
  const at = (x: number) =>
    low + Math.min(1, Math.max(0, (x - 10) / Math.max(1, width.current - 20))) * (high - low)
  const current = useRef({ inactive, resolved, publish, at })
  current.current = { inactive, resolved, publish, at }
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          !current.current.inactive &&
          Math.abs(gesture.dx) > 6 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,
        onPanResponderGrant: (event) => {
          if (current.current.inactive) return
          start.current = current.current.resolved
          moved.current = true
          current.current.publish(current.current.at(event.nativeEvent.locationX))
        },
        onPanResponderMove: (event) => {
          if (current.current.inactive) return
          current.current.publish(current.current.at(event.nativeEvent.locationX))
        },
        onPanResponderRelease: (event) => {
          if (current.current.inactive) return
          // The last movement event may be coalesced; release carries the final pointer position.
          const x = event.nativeEvent.locationX
          current.current.publish(Number.isFinite(x) ? current.current.at(x) : last.current, true)
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderTerminate: () => {
          if (current.current.inactive) return
          current.current.publish(start.current)
        },
      }),
    []
  )
  const fraction = high === low ? 0 : (resolved - low) / (high - low)
  return (
    <View {...responder.panHandlers} style={[{ minWidth: 48 }, containerStyle]}>
      <Pressable
        accessible
        accessibilityRole="adjustable"
        {...props}
        {...(Platform.OS === "web"
          ? {
              role: "slider" as const,
              "aria-valuemin": low,
              "aria-valuemax": high,
              "aria-valuenow": resolved,
              "aria-valuetext": props["aria-valuetext"] ?? props.accessibilityValue?.text,
            }
          : {})}
        disabled={inactive}
        accessibilityState={{ ...accessibilityState, disabled: inactive }}
        accessibilityValue={{ ...props.accessibilityValue, min: low, max: high, now: resolved }}
        accessibilityActions={
          inactive
            ? []
            : [...(props.accessibilityActions ?? []), { name: "increment" }, { name: "decrement" }]
        }
        onAccessibilityAction={(event) => {
          onAccessibilityAction?.(event)
          if (inactive || event.defaultPrevented) return
          if (event.nativeEvent.actionName === "increment") publish(resolved + increment, true)
          if (event.nativeEvent.actionName === "decrement") publish(resolved - increment, true)
        }}
        onLayout={(event) => {
          width.current = event.nativeEvent.layout.width
          onLayout?.(event)
        }}
        onPressIn={(event) => {
          moved.current = false
          onPressIn?.(event)
        }}
        onPress={(event) => {
          const prevented = event.defaultPrevented
          onPress?.(event)
          if (inactive || (!prevented && event.defaultPrevented)) return
          if (moved.current) {
            moved.current = false
            return
          }
          const pointer = event.nativeEvent as unknown as
            | { locationX?: number; offsetX?: number }
            | undefined
          const x = Platform.OS === "web" ? pointer?.offsetX : pointer?.locationX
          if (typeof x === "number") publish(at(x), true)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (Platform.OS !== "web" || inactive || event.defaultPrevented) return
          const key = (event.nativeEvent as { key?: string }).key
          let next: number | undefined
          if (key === "ArrowRight" || key === "ArrowUp") next = resolved + increment
          if (key === "ArrowLeft" || key === "ArrowDown") next = resolved - increment
          if (key === "PageUp") next = resolved + increment * 10
          if (key === "PageDown") next = resolved - increment * 10
          if (key === "Home") next = low
          if (key === "End") next = high
          if (next !== undefined) {
            event.preventDefault()
            event.stopPropagation()
            publish(next, true)
          }
        }}
        style={(state) => [
          {
            minHeight: 48,
            minWidth: 48,
            justifyContent: "center",
            paddingHorizontal: 10,
            outlineWidth: 0,
            outlineColor: theme.colors.focusRing,
            outlineOffset: 2,
            ...(Platform.OS === "web" ? { touchAction: "pan-y" as const } : {}),
          },
          typeof style === "function" ? style(state) : style,
        ]}
      >
        <View
          pointerEvents="none"
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: nativeColorAlpha(
              theme.colors.foreground,
              isNativeDark(theme) ? 0.22 : 0.14
            ),
            boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <View
            testID="slider-thumb"
            style={{
              position: "absolute",
              width: 18,
              height: 18,
              top: -6,
              left: `${fraction * 100}%`,
              marginLeft: -9,
              borderRadius: 9,
              borderWidth: 2,
              borderColor: theme.colors.surfaceRaised,
              backgroundColor: inactive ? theme.colors.disabledForeground : theme.colors.primary,
              boxShadow: inactive
                ? undefined
                : "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
              outlineWidth: focused && !inactive ? 2 : 0,
              outlineColor: theme.colors.focusRing,
              outlineOffset: 2,
            }}
          />
        </View>
      </Pressable>
    </View>
  )
}
