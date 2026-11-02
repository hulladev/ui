import { useState } from "react"
import { View } from "react-native"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuItemText,
  DropdownMenuLabel,
} from "../../../../generated/react-native/dropdown-menu"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
export default function DropdownMenuExample() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState("No action selected.")
  function choose(value: string) {
    setStatus(value)
    setOpen(false)
  }
  return (
    <View style={{ gap: 16 }}>
      <Button
        aria-expanded={open}
        accessibilityState={{ expanded: open }}
        variant="outline"
        onPress={() => setOpen(true)}
        accessibilityLabel="Workout actions"
      >
        <ButtonText variant="outline">Workout actions ···</ButtonText>
      </Button>
      <Text accessibilityLiveRegion="polite">{status}</Text>
      <DropdownMenu visible={open} onClose={() => setOpen(false)} contentLabel="Workout actions">
        <DropdownMenuLabel>Workout actions</DropdownMenuLabel>
        <DropdownMenuItem onPress={() => choose("Workout duplicated.")}>
          <DropdownMenuItemText>Duplicate workout</DropdownMenuItemText>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={() => choose("Sharing options opened.")}>
          <DropdownMenuItemText>Share workout</DropdownMenuItemText>
        </DropdownMenuItem>
        <DropdownMenuItem disabled accessibilityLabel="Export unavailable offline">
          <DropdownMenuItemText disabled>Export unavailable offline</DropdownMenuItemText>
        </DropdownMenuItem>
        <DropdownMenuItem destructive onPress={() => choose("Workout moved to archive.")}>
          <DropdownMenuItemText destructive>Archive workout</DropdownMenuItemText>
        </DropdownMenuItem>
        <Button variant="ghost" onPress={() => setOpen(false)}>
          <ButtonText variant="ghost">Cancel actions</ButtonText>
        </Button>
      </DropdownMenu>
      <Text testID="native-description" variant="caption" tone="muted">
        A discoverable action button opens a selection sheet. Actions are ordinary native buttons,
        including disabled and destructive states.
      </Text>
    </View>
  )
}
