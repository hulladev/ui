import { useState } from "react"
import { View } from "react-native"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectText,
  SelectItemText,
  SelectGroupLabel,
} from "../../../../generated/react-native/select"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
const options = ["Strength", "Hypertrophy", "Endurance"]
export default function SelectExample() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("Strength")
  return (
    <View style={{ gap: 16 }}>
      <Text>Training focus</Text>
      <Select
        accessibilityLabel={`Training focus: ${value}`}
        expanded={open}
        onPress={() => setOpen(true)}
      >
        <SelectText>{value}</SelectText>
      </Select>
      <Select disabled accessibilityLabel="Locked training plan">
        <SelectText disabled>Locked training plan</SelectText>
      </Select>
      <SelectContent
        visible={open}
        onClose={() => setOpen(false)}
        contentLabel="Choose training focus"
      >
        <SelectGroupLabel>Training focus</SelectGroupLabel>
        <View accessibilityRole="radiogroup" accessibilityLabel="Training focus options">
          {options.map((option) => (
            <SelectItem
              key={option}
              selected={value === option}
              accessibilityLabel={option}
              onPress={() => {
                setValue(option)
                setOpen(false)
              }}
            >
              <SelectItemText selected={value === option}>{option}</SelectItemText>
            </SelectItem>
          ))}
        </View>
        <Button variant="ghost" onPress={() => setOpen(false)}>
          <ButtonText variant="ghost">Cancel selection</ButtonText>
        </Button>
      </SelectContent>
      <Text accessibilityLiveRegion="polite">Selected: {value}</Text>
      <Text testID="native-description" variant="caption" tone="muted">
        The trigger paints a 40-unit control inside its 48-unit target. Choice rows keep the web
        type, square corners, and selected checkmark. Label state stays explicit.
      </Text>
    </View>
  )
}
