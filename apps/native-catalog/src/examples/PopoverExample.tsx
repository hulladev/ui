import { useState } from "react"
import { View } from "react-native"
import {
  Popover,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "../../../../generated/react-native/popover"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
export default function PopoverExample() {
  const [open, setOpen] = useState(false)
  return (
    <View style={{ gap: 16 }}>
      <Button
        aria-expanded={open}
        accessibilityState={{ expanded: open }}
        variant="outline"
        onPress={() => setOpen(true)}
      >
        <ButtonText variant="outline">About recovery score</ButtonText>
      </Button>
      <Popover
        visible={open}
        onClose={() => setOpen(false)}
        contentLabel="Recovery score explanation"
      >
        <PopoverHeader>
          <View style={{ gap: 4, flex: 1, minWidth: 0 }}>
            <PopoverTitle>Recovery score</PopoverTitle>
            <PopoverDescription>
              A rough guide based on rest and recent training. Use how you feel to decide whether to
              adjust your session.
            </PopoverDescription>
          </View>
        </PopoverHeader>
        <Button onPress={() => setOpen(false)}>
          <ButtonText>Got it</ButtonText>
        </Button>
      </Popover>
      <Text testID="native-description" variant="caption" tone="muted">
        Contextual detail uses a centered native modal on touch. It does not claim pointer anchored
        positioning.
      </Text>
    </View>
  )
}
