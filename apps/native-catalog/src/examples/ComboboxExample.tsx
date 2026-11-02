import { useState } from "react"
import { View } from "react-native"
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  ComboboxGroupLabel,
} from "../../../../generated/react-native/combobox"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
const exercises = ["Back squat", "Bench press", "Deadlift", "Romanian deadlift", "Overhead press"]
export default function ComboboxExample() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [value, setValue] = useState("Back squat")
  const matches = exercises.filter((x) => x.toLowerCase().includes(query.toLowerCase()))
  function choose(value: string) {
    setValue(value)
    setOpen(false)
  }
  return (
    <View style={{ gap: 16 }}>
      <Button
        aria-expanded={open}
        accessibilityState={{ expanded: open }}
        variant="outline"
        onPress={() => {
          setQuery("")
          setOpen(true)
        }}
      >
        <ButtonText variant="outline">Choose exercise</ButtonText>
      </Button>
      <Text accessibilityLiveRegion="polite">Exercise: {value}</Text>
      <ComboboxContent
        visible={open}
        onClose={() => setOpen(false)}
        contentLabel="Find an exercise"
      >
        <ComboboxGroupLabel>Find an exercise</ComboboxGroupLabel>
        <Combobox
          autoFocus
          accessibilityLabel="Search exercises"
          placeholder="Search exercises"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => {
            if (matches.length === 1) choose(matches[0]!)
          }}
        />
        <Text variant="caption" tone="muted" accessibilityLiveRegion="polite">
          {matches.length} results
        </Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Matching exercises">
          {matches.map((exercise) => (
            <ComboboxItem
              key={exercise}
              selected={value === exercise}
              accessibilityLabel={exercise}
              onPress={() => choose(exercise)}
            >
              <ComboboxItemText selected={value === exercise}>{exercise}</ComboboxItemText>
            </ComboboxItem>
          ))}
        </View>
        {matches.length === 0 ? <Text>No exercises found. Try a different search.</Text> : null}
        <Button variant="ghost" onPress={() => setOpen(false)}>
          <ButtonText variant="ghost">Cancel search</ButtonText>
        </Button>
      </ComboboxContent>
      <Text testID="native-description" variant="caption" tone="muted">
        Search and choose inside a native modal. Query, filtering, selected value, and dismissal
        remain explicit; submit selects a single result.
      </Text>
    </View>
  )
}
