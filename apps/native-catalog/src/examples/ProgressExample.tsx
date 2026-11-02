import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { useState } from "react"
import { Progress } from "../../../../generated/react-native/progress"

export default function ProgressExample() {
  const [sets, setSets] = useState(2)
  return (
    <View style={{ gap: 20 }}>
      <Text accessibilityLiveRegion="polite">{sets} of 5 sets complete</Text>
      <Progress
        value={sets}
        max={5}
        accessibilityLabel="Workout progress"
        accessibilityValue={{ text: `${sets} of 5 sets complete` }}
      />
      <Button disabled={sets === 5} onPress={() => setSets(sets + 1)}>
        <ButtonText disabled={sets === 5}>Complete next set</ButtonText>
      </Button>
      <Button variant="ghost" onPress={() => setSets(0)}>
        <ButtonText variant="ghost">Reset progress</ButtonText>
      </Button>
      <Text>Syncing session</Text>
      <Progress accessibilityLabel="Syncing session" />
      <Text testID="native-description" variant="caption" tone="muted">
        Determinate progress exposes a bounded value. Unknown progress exposes a busy state without
        mandatory animation.
      </Text>
    </View>
  )
}
