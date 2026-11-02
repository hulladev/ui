import { useRef, useState, type ComponentProps, type ComponentRef } from "react"
import { Radio, RadioGroup } from "../../../../generated/react-native/radio"
import { Text } from "../../../../generated/react-native/typography"
export default function RadioExample() {
  const [value, setValue] = useState(1)
  const refs = useRef<(ComponentRef<typeof Radio> | null)[]>([])
  const options = ["Strength", "Hypertrophy", "Conditioning"]
  const navigate =
    (index: number): NonNullable<ComponentProps<typeof Radio>["onKeyDown"]> =>
    (event) => {
      const key = (event.nativeEvent as { key?: string }).key
      let next: number | undefined
      if (key === "ArrowRight" || key === "ArrowDown") next = (index + 1) % options.length
      if (key === "ArrowLeft" || key === "ArrowUp")
        next = (index + options.length - 1) % options.length
      if (key === "Home") next = 0
      if (key === "End") next = options.length - 1
      if (next !== undefined) {
        event.preventDefault()
        setValue(next)
        refs.current[next]?.focus()
      }
    }
  return (
    <>
      <RadioGroup accessibilityLabel="Training goal">
        {options.map((option, index) => (
          <Radio
            key={option}
            ref={(element) => {
              refs.current[index] = element
            }}
            checked={value === index}
            onCheckedChange={() => setValue(index)}
            onKeyDown={navigate(index)}
            tabIndex={value === index ? 0 : -1}
            accessibilityLabel={option}
          >
            <Text>{option}</Text>
          </Radio>
        ))}
        <Radio checked={false} disabled accessibilityLabel="Recovery plan unavailable">
          <Text tone="muted">Recovery plan · unavailable</Text>
        </Radio>
      </RadioGroup>
      <Text accessibilityLiveRegion="polite">Goal: {options[value]}</Text>
      <Text testID="native-description" variant="caption" tone="muted">
        Checked state, labels, and keyboard navigation are explicit. The group does not modify its
        children.
      </Text>
    </>
  )
}
