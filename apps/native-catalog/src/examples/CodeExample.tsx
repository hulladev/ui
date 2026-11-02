import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Code } from "../../../../generated/react-native/code"

export default function CodeExample() {
  return (
    <View style={{ gap: 20 }}>
      <Text>Template identifier</Text>
      <Code accessibilityLabel="Template identifier">upper-body-a</Code>
      <Text>Session export</Text>
      <Code accessibilityLabel="Session export">
        {'{\n  "exercise": "Bench press",\n  "sets": 3,\n  "reps": 8\n}'}
      </Code>
      <Text testID="native-description" variant="caption" tone="muted">
        Selectable native text uses the configured mono font and preserves multiline content. Syntax
        highlighting is an application choice.
      </Text>
    </View>
  )
}
