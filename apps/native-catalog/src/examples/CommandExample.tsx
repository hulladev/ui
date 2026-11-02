import { useState } from "react"
import { View } from "react-native"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandEmpty,
} from "../../../../generated/react-native/command"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
const actions = ["Start empty workout", "Open workout history", "Create exercise"]
export default function CommandExample() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("Choose an action to run.")
  const matches = actions.filter((x) => x.toLowerCase().includes(query.toLowerCase()))
  function run(action: string) {
    setStatus(`Ran: ${action}`)
    setOpen(false)
  }
  return (
    <View style={{ gap: 16 }}>
      <Button
        aria-expanded={open}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          setQuery("")
          setOpen(true)
        }}
      >
        <ButtonText>Quick actions</ButtonText>
      </Button>
      <Text accessibilityLiveRegion="polite">{status}</Text>
      <Command visible={open} onClose={() => setOpen(false)} contentLabel="Quick actions">
        <CommandInput
          autoFocus
          accessibilityLabel="Search actions"
          placeholder="Search actions"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => {
            if (matches.length === 1) run(matches[0]!)
          }}
        />
        <CommandList>
          {matches.map((action) => (
            <CommandItem key={action} onPress={() => run(action)}>
              <CommandItemText>{action}</CommandItemText>
            </CommandItem>
          ))}
          {matches.length === 0 ? <CommandEmpty>No matching actions.</CommandEmpty> : null}
        </CommandList>
        <Button variant="ghost" onPress={() => setOpen(false)}>
          <ButtonText variant="ghost">Close actions</ButtonText>
        </Button>
      </Command>
      <Text testID="native-description" variant="caption" tone="muted">
        Search executes actions instead of choosing a form value. The input, result buttons, empty
        state, and modal dismissal compose explicitly.
      </Text>
    </View>
  )
}
