import { useState } from "react"
import { View } from "react-native"
import { Toggle, ToggleText } from "../../../../generated/react-native/toggle"
import { Text } from "../../../../generated/react-native/typography"
export default function ToggleExample() {
  const [pinned, setPinned] = useState(false)
  const [warmup, setWarmup] = useState(true)
  const [ghost, setGhost] = useState(false)
  const [inverted, setInverted] = useState(false)
  return (
    <>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <Toggle pressed={pinned} onPressedChange={setPinned} accessibilityLabel="Pin workout">
          <ToggleText pressed={pinned}>Pin workout</ToggleText>
        </Toggle>
        <Toggle defaultPressed onPressedChange={setWarmup} accessibilityLabel="Include warm-up">
          <ToggleText pressed={warmup}>Include warm-up</ToggleText>
        </Toggle>
        <Toggle disabled accessibilityLabel="Unavailable setting">
          <ToggleText disabled>Unavailable</ToggleText>
        </Toggle>
        <Toggle
          variant="ghost"
          pressed={ghost}
          onPressedChange={setGhost}
          accessibilityLabel="Ghost toggle"
        >
          <ToggleText variant="ghost" pressed={ghost}>
            Ghost
          </ToggleText>
        </Toggle>
        <Toggle
          variant="inverted"
          pressed={inverted}
          onPressedChange={setInverted}
          accessibilityLabel="Inverted toggle"
        >
          <ToggleText variant="inverted" pressed={inverted}>
            Inverted
          </ToggleText>
        </Toggle>
      </View>
      <Text accessibilityLiveRegion="polite">
        {pinned ? "Workout pinned." : "Workout is not pinned."}
      </Text>
      <Text testID="native-description" variant="caption" tone="muted">
        A persistent action with explicit pressed state and a compact surface inside its touch
        target.
      </Text>
    </>
  )
}
