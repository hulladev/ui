import { useState } from "react"
import { View } from "react-native"
import { SwipeActions } from "../../../../generated/react-native/swipe-actions"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
export default function SwipeActionsExample() {
  const [open, setOpen] = useState(false)
  const [archived, setArchived] = useState(false)
  return (
    <View style={{ gap: 16 }}>
      {!archived ? (
        <SwipeActions
          open={open}
          onOpenChange={setOpen}
          actionLabel="Bench press actions"
          actions={
            <Button
              variant="outline"
              onPress={() => {
                setArchived(true)
                setOpen(false)
              }}
            >
              <ButtonText variant="outline">Archive exercise</ButtonText>
            </Button>
          }
        >
          <Text>Bench press</Text>
          <Text variant="caption" tone="muted">
            3 sets · 60 kg · 8 reps
          </Text>
        </SwipeActions>
      ) : (
        <Button variant="ghost" onPress={() => setArchived(false)}>
          <ButtonText variant="ghost">Undo archive</ButtonText>
        </Button>
      )}
      <Text accessibilityLiveRegion="polite">
        {archived ? "Exercise archived. Undo is available." : "Exercise in your workout."}
      </Text>
      <SwipeActions
        disabled
        actionLabel="Locked exercise actions"
        actions={<Text>Unavailable</Text>}
      >
        <Text>Locked exercise</Text>
      </SwipeActions>
      <Text testID="native-description" variant="caption" tone="muted">
        Swipe left 48 units to reveal actions or use the visible Actions button. Swipe right closes.
        Vertical scrolling and cancelled gestures do not change the row; swiping never executes an
        action.
      </Text>
    </View>
  )
}
