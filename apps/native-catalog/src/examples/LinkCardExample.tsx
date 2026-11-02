import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { useState } from "react"
import {
  LinkCard,
  LinkCardContent,
  LinkCardTitle,
  LinkCardDescription,
} from "../../../../generated/react-native/link-card"

export default function LinkCardExample() {
  const [openCount, setOpenCount] = useState(0)
  return (
    <View style={{ gap: 20 }}>
      <LinkCard
        accessibilityLabel="Open workout history"
        accessibilityState={{ selected: openCount > 0 }}
        accessibilityHint="Shows previous sessions."
        onPress={() => setOpenCount((count) => count + 1)}
      >
        <LinkCardContent>
          <LinkCardTitle selected={openCount > 0}>Workout history</LinkCardTitle>
          <LinkCardDescription>
            Review previous sessions and follow your progress.
          </LinkCardDescription>
        </LinkCardContent>
      </LinkCard>
      <LinkCard disabled accessibilityLabel="Open coach profile">
        <LinkCardContent>
          <LinkCardTitle disabled>Coach profile</LinkCardTitle>
          <LinkCardDescription disabled>No coach is connected yet.</LinkCardDescription>
        </LinkCardContent>
      </LinkCard>
      <Text accessibilityLiveRegion="polite">
        {openCount > 0 ? "Workout history opened in this preview." : "Choose a destination."}
      </Text>
      <Text variant="caption" tone="muted" accessibilityLiveRegion="polite">
        Destination opened {openCount} {openCount === 1 ? "time" : "times"}.
      </Text>
      <Text testID="native-description" variant="caption" tone="muted">
        A navigation surface uses native press events. Connect onPress to your application router or
        Linking.
      </Text>
    </View>
  )
}
