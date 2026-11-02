import { useState } from "react"
import { Switch } from "../../../../generated/react-native/switch"
import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"

export default function SwitchExample() {
  const [enabled, setEnabled] = useState(true)
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 }}>
        <Switch accessibilityLabel="Notifications" value={enabled} onValueChange={setEnabled} />
        <Text style={{ flexShrink: 1 }}>Notifications {enabled ? "on" : "off"}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 }}>
        <Switch accessibilityLabel="Unavailable setting" value disabled />
        <Text tone="muted" style={{ flexShrink: 1 }}>
          Unavailable setting
        </Text>
      </View>
      <Text testID="native-description" variant="caption" tone="muted">
        Track and thumb use the shared theme in both states.
      </Text>
    </View>
  )
}
