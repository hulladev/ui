import { useState } from "react"
import { View } from "react-native"
import { Calendar } from "../../../../generated/react-native/calendar"
import { Text } from "../../../../generated/react-native/typography"
export default function CalendarExample() {
  const [value, setValue] = useState("2026-10-29")
  return (
    <View style={{ gap: 16 }}>
      <Calendar
        accessibilityLabel="Workout date"
        value={value}
        defaultMonth="2026-10-01"
        min="2026-10-05"
        max="2026-12-20"
        onValueChange={setValue}
      />
      <Text accessibilityLiveRegion="polite">Selected date: {value}</Text>
      <Text testID="native-description" variant="caption" tone="muted">
        Single date selection with explicit limits. Each date reserves a 48-unit target; narrow
        calendars scroll horizontally.
      </Text>
    </View>
  )
}
