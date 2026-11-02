import { useState } from "react"
import { TagInput } from "../../../../generated/react-native/tag-input"
import { Text } from "../../../../generated/react-native/typography"
export default function TagInputExample() {
  const [tags, setTags] = useState(["Strength", "Upper body"])
  return (
    <>
      <Text>Template tags</Text>
      <TagInput
        value={tags}
        onValueChange={setTags}
        inputProps={{
          accessibilityLabel: "New template tag",
          accessibilityHint: "Enter a tag, then choose Add or submit the keyboard.",
          placeholder: "Add a template tag",
          maxLength: 32,
        }}
      />
      <Text accessibilityLiveRegion="polite" variant="caption" tone="muted">
        {tags.length} tags selected
      </Text>
      <Text>Locked tags</Text>
      <TagInput
        defaultValue={["Archived"]}
        disabled
        inputProps={{ accessibilityLabel: "Locked tag input" }}
      />
      <Text testID="native-description" variant="caption" tone="muted">
        Add through the keyboard or visible button; each tag has a named remove action. Empty and
        duplicate tags are ignored.
      </Text>
    </>
  )
}
