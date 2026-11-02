import { View } from "react-native"
import { Tooltip, TooltipContent } from "../../../../generated/react-native/tooltip"
import { Text } from "../../../../generated/react-native/typography"
export default function TooltipExample() {
  return (
    <View style={{ gap: 16 }}>
      <Text>Target effort: 2 repetitions in reserve</Text>
      <Tooltip
        accessibilityLabel="Explain repetitions in reserve"
        content={
          <TooltipContent>
            Stop when you could still perform about two more repetitions with good form.
          </TooltipContent>
        }
      >
        <Text>ⓘ Repetitions in reserve</Text>
      </Tooltip>
      <Tooltip
        disabled
        accessibilityLabel="Unavailable help"
        content={<TooltipContent>This help is unavailable.</TooltipContent>}
      >
        <Text tone="muted">ⓘ Unavailable help</Text>
      </Tooltip>
      <Text testID="native-description" variant="caption" tone="muted">
        A visible dotted help trigger reveals an inline explanation on tap or keyboard activation.
        Tap again or press Escape to dismiss.
      </Text>
    </View>
  )
}
