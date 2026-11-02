import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { useState } from "react"
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from "../../../../generated/react-native/empty-state"

export default function EmptyStateExample() {
  const [created, setCreated] = useState(false)
  return (
    <View style={{ gap: 20 }}>
      {created ? (
        <>
          <Text variant="heading">First workout created</Text>
          <Text accessibilityLiveRegion="polite">Your blank workout is ready to edit.</Text>
          <Button variant="ghost" onPress={() => setCreated(false)}>
            <ButtonText variant="ghost">Reset example</ButtonText>
          </Button>
        </>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No workouts yet</EmptyStateTitle>
          <EmptyStateDescription>
            Create a template to keep your exercises and sets together.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button onPress={() => setCreated(true)}>
              <ButtonText>Create workout</ButtonText>
            </Button>
          </EmptyStateActions>
        </EmptyState>
      )}
      <Text testID="native-description" variant="caption" tone="muted">
        Title, explanation, and actions are independent parts. The application owns the
        empty-to-content transition.
      </Text>
    </View>
  )
}
