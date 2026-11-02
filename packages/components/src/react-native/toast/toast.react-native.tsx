import { useEffect, useRef, useState, type ComponentPropsWithRef } from "react"
import { AccessibilityInfo, Platform, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { isNativeDark, nativeColorMix } from "@/lib/native-color"
export type ToastProps = ComponentPropsWithRef<typeof View> & {
  visible: boolean
  onDismiss: () => void
  duration?: number
  announcement: string
  theme?: NativeTheme
}
/** Screen reader users dismiss explicitly. duration=0 also keeps the notice open. */
export function Toast({
  children,
  style,
  visible,
  onDismiss,
  duration = 5000,
  announcement,
  theme: override,
  onFocus,
  onBlur,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  onPointerEnter,
  onPointerLeave,
  ...props
}: ToastProps) {
  const theme = useNativeTheme(override)
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss
  const [screenReader, setScreenReader] = useState<boolean | null>(null)
  const [focused, setFocused] = useState(false)
  const [touching, setTouching] = useState(false)
  const [hovered, setHovered] = useState(false)
  const paused = focused || touching || hovered
  useEffect(() => {
    let mounted = true
    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (mounted) setScreenReader(value)
      })
      .catch(() => {
        if (mounted) setScreenReader(true)
      })
    const subscription = AccessibilityInfo.addEventListener("screenReaderChanged", setScreenReader)
    return () => {
      mounted = false
      subscription.remove()
    }
  }, [])
  useEffect(() => {
    if (!visible) {
      setFocused(false)
      setTouching(false)
      setHovered(false)
    }
  }, [visible])
  useEffect(() => {
    if (!visible || screenReader !== false || paused || !Number.isFinite(duration) || duration <= 0)
      return
    const timer = setTimeout(() => dismissRef.current(), duration)
    return () => clearTimeout(timer)
  }, [visible, duration, screenReader, paused])
  useEffect(() => {
    if (visible && announcement && Platform.OS === "ios")
      AccessibilityInfo.announceForAccessibility(announcement)
  }, [visible, announcement])
  if (!visible) return null
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      {...props}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        const related = (event as unknown as { relatedTarget?: unknown }).relatedTarget
        const host = event.currentTarget as unknown as { contains?: (target: unknown) => boolean }
        if (!related || !host.contains?.(related)) setFocused(false)
        onBlur?.(event)
      }}
      onTouchStart={(event) => {
        setTouching(true)
        onTouchStart?.(event)
      }}
      onTouchEnd={(event) => {
        setTouching(false)
        onTouchEnd?.(event)
      }}
      onTouchCancel={(event) => {
        setTouching(false)
        onTouchCancel?.(event)
      }}
      onPointerEnter={(event) => {
        setHovered(true)
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        onPointerLeave?.(event)
      }}
      style={[
        {
          backgroundColor: nativeColorMix(
            theme.colors.surfaceRaised,
            theme.colors.primary,
            isNativeDark(theme) ? 0.04 : 0.03
          ),
          borderWidth: 1,
          borderColor: nativeColorMix(theme.colors.border, theme.colors.primary, 0.14),
          borderRadius: theme.radius.lg,
          boxShadow: isNativeDark(theme)
            ? "0 2px 4px -2px rgba(0,0,0,0.24), 0 16px 48px -16px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 2px 4px -2px rgba(0,0,0,0.1), 0 16px 48px -16px rgba(0,0,0,0.26)",
          padding: 16,
          paddingBottom: 26,
          gap: 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
