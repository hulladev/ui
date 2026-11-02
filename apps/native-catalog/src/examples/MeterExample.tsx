import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Meter } from "../../../../generated/react-native/meter"

export default function MeterExample() {
  return (
    <View style={{ gap: 20 }}>
      <Text>Weekly sessions: 3 of 4</Text>
      <Meter
        value={3}
        max={4}
        tone="success"
        accessibilityLabel="Weekly sessions"
        accessibilityValue={{ text: "3 of 4 sessions" }}
      />
      <Text>Perceived effort: 8 of 10</Text>
      <Meter
        value={8}
        min={1}
        max={10}
        tone="warning"
        accessibilityLabel="Perceived effort"
        accessibilityValue={{ text: "8 of 10, high effort" }}
      />
      <Text>Storage: 95 percent used</Text>
      <Meter
        value={95}
        tone="danger"
        accessibilityLabel="Storage used"
        accessibilityValue={{ text: "95 percent used" }}
      />
      <Text testID="native-description" variant="caption" tone="muted">
        A meter represents a measurement, rather than task completion. Labels explain every color
        and range.
      </Text>
    </View>
  )
}
