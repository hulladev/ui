import { useState } from "react"
import { View } from "react-native"
import { Slider } from "../../../../generated/react-native/slider"
import { Text } from "../../../../generated/react-native/typography"
export default function SliderExample() {
  const [rest, setRest] = useState(90)
  const [committed, setCommitted] = useState(90)
  return (
    <>
      <Text>Rest interval · {rest} seconds</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text variant="caption" tone="muted">
          30s
        </Text>
        <Slider
          containerStyle={{ flex: 1 }}
          min={30}
          max={180}
          step={15}
          value={rest}
          onValueChange={setRest}
          onSlidingComplete={setCommitted}
          accessibilityLabel="Rest interval"
          accessibilityValue={{ text: `${rest} seconds` }}
        />
        <Text variant="caption" tone="muted">
          180s
        </Text>
      </View>
      <Text variant="caption" tone="muted" accessibilityLiveRegion="polite">
        Saved interval: {committed} seconds
      </Text>
      <Text>Locked target</Text>
      <Slider min={0} max={10} value={7} disabled accessibilityLabel="Locked target" />
      <Text testID="native-description" variant="caption" tone="muted">
        Tap or drag horizontally. Vertical movement stays available to the page. Arrow keys and
        screen-reader adjustment change one step; cancelling a gesture restores its starting value.
        containerStyle sizes the gesture wrapper; style customizes the semantic Pressable.
      </Text>
    </>
  )
}
