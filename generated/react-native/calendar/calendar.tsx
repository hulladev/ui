import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { formatNativeDate, nativeDateDisabled, parseNativeDate } from "@/lib/native-date"

export type CalendarProps = ComponentPropsWithRef<typeof View> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  month?: string
  defaultMonth?: string
  onMonthChange?: (month: string) => void
  min?: string
  max?: string
  disabled?: boolean
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  theme?: NativeTheme
}

export function Calendar({
  children,
  style,
  value,
  defaultValue,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  min,
  max,
  disabled = false,
  locale = "en",
  weekStartsOn = 1,
  theme: override,
  ...props
}: CalendarProps) {
  const theme = useNativeTheme(override)
  const [localValue, setLocalValue] = useState(defaultValue)
  const selected = value === undefined ? localValue : value
  const [localMonth, setLocalMonth] = useState(
    () => defaultMonth ?? selected ?? formatNativeDate(new Date())
  )
  const [focused, setFocused] = useState<string | null>(null)
  const displayed = parseNativeDate(month ?? localMonth) ?? new Date()
  const first = new Date(displayed.getFullYear(), displayed.getMonth(), 1, 12)
  const offset = (first.getDay() - weekStartsOn + 7) % 7
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const rows = Math.ceil((offset + days) / 7)
  const previous = new Date(first.getFullYear(), first.getMonth() - 1, 1, 12)
  const next = new Date(first.getFullYear(), first.getMonth() + 1, 1, 12)
  const previousDisabled =
    disabled ||
    Boolean(
      parseNativeDate(min) &&
      formatNativeDate(new Date(first.getFullYear(), first.getMonth(), 0, 12)) < min!
    )
  const nextDisabled = disabled || Boolean(parseNativeDate(max) && formatNativeDate(next) > max!)
  const changeMonth = (date: Date) => {
    const nextMonth = formatNativeDate(date)
    if (month === undefined) setLocalMonth(nextMonth)
    onMonthChange?.(nextMonth)
  }
  const nav = (label: string, direction: "left" | "right", date: Date, inactive: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={inactive}
      accessibilityState={{ disabled: inactive }}
      onPress={() => changeMonth(date)}
      onFocus={() => setFocused(label)}
      onBlur={() => setFocused(null)}
      style={{
        minWidth: 48,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        outlineWidth: 0,
      }}
    >
      {({ pressed }) => (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: theme.radius.md,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed && !inactive ? theme.colors.hoverSurface : "transparent",
            outlineWidth: focused === label && !inactive ? 2 : 0,
            outlineColor: theme.colors.focusRing,
            outlineOffset: 1,
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderTopWidth: 1.5,
              borderRightWidth: 1.5,
              borderColor: inactive
                ? theme.colors.disabledForeground
                : theme.colors.mutedForeground,
              transform: [{ rotate: direction === "left" ? "-135deg" : "45deg" }],
            }}
          />
        </View>
      )}
    </Pressable>
  )

  return (
    <View
      {...props}
      style={[
        {
          gap: 8,
          backgroundColor: theme.colors.surfaceRaised,
          borderRadius: theme.radius.lg,
          padding: 12,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {nav("Previous month", "left", previous, previousDisabled)}
        <Text
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          style={{
            color: theme.colors.foreground,
            fontSize: 13,
            lineHeight: 20,
            letterSpacing: -0.13,
            fontWeight: "600",
            fontFamily: theme.fonts?.semibold,
            flexShrink: 1,
            textAlign: "center",
          }}
        >
          {first.toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </Text>
        {nav("Next month", "right", next, nextDisabled)}
      </View>
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ minWidth: 336, flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            {Array.from({ length: 7 }, (_, index) => {
              const date = new Date(2024, 0, 7 + ((weekStartsOn + index) % 7), 12)
              return (
                <Text
                  key={index}
                  accessible={false}
                  style={{
                    flex: 1,
                    minWidth: 48,
                    textAlign: "center",
                    paddingVertical: 6,
                    color: theme.colors.mutedForeground,
                    fontSize: 12,
                    fontFamily: theme.fonts?.medium,
                    fontWeight: "500",
                    letterSpacing: 0.24,
                  }}
                >
                  {date.toLocaleDateString(locale, { weekday: "short" }).toLocaleUpperCase(locale)}
                </Text>
              )
            })}
          </View>
          {Array.from({ length: rows }, (_, row) => (
            <View key={row} style={{ flexDirection: "row" }}>
              {Array.from({ length: 7 }, (_, column) => {
                const day = row * 7 + column - offset + 1
                if (day < 1 || day > days)
                  return <View key={column} style={{ flex: 1, minWidth: 48, minHeight: 48 }} />
                const date = new Date(first.getFullYear(), first.getMonth(), day, 12)
                const iso = formatNativeDate(date)
                const inactive = disabled || nativeDateDisabled(iso, min, max)
                const active = iso === selected
                return (
                  <Pressable
                    key={column}
                    accessibilityRole="button"
                    accessibilityLabel={date.toLocaleDateString(locale, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    accessibilityState={{ selected: active, disabled: inactive }}
                    aria-selected={active}
                    disabled={inactive}
                    onPress={() => {
                      if (value === undefined) setLocalValue(iso)
                      onValueChange?.(iso)
                    }}
                    onFocus={() => setFocused(iso)}
                    onBlur={() => setFocused(null)}
                    style={({ pressed }) => ({
                      flex: 1,
                      minWidth: 48,
                      minHeight: 48,
                      alignItems: "center",
                      justifyContent: "center",
                      outlineWidth: 0,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <View
                      style={{
                        minWidth: 36,
                        minHeight: 36,
                        paddingHorizontal: 4,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: theme.radius.md,
                        backgroundColor: active ? theme.colors.primary : "transparent",
                        outlineWidth: focused === iso ? 2 : 0,
                        outlineColor: theme.colors.focusRing,
                        outlineOffset: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          lineHeight: 20,
                          fontFamily: theme.fonts?.medium,
                          textDecorationLine: inactive ? "line-through" : "none",
                          color: inactive
                            ? theme.colors.mutedForeground
                            : active
                              ? theme.colors.primaryForeground
                              : theme.colors.foreground,
                        }}
                      >
                        {day}
                      </Text>
                      {iso === formatNativeDate(new Date()) && (
                        <View
                          accessible={false}
                          style={{
                            position: "absolute",
                            bottom: 4,
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: active
                              ? theme.colors.primaryForeground
                              : theme.colors.primary,
                          }}
                        />
                      )}
                    </View>
                  </Pressable>
                )
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      {children}
    </View>
  )
}
