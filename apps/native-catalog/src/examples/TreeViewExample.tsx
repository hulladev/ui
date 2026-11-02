import { useState } from "react"
import { View } from "react-native"
import {
  TreeView,
  TreeItem,
  TreeGroup,
  TreeItemLabel,
  TreeItemIndicator,
} from "../../../../generated/react-native/tree-view"
import { Text } from "../../../../generated/react-native/typography"

export default function TreeViewExample() {
  const [expanded, setExpanded] = useState(true)
  const [selected, setSelected] = useState("Bench press")
  return (
    <View style={{ gap: 20 }}>
      <TreeView accessibilityLabel="Workout library">
        <TreeItem
          accessibilityLabel="Upper body exercises"
          accessibilityHint="Expand or collapse the exercise group."
          accessibilityState={{ expanded }}
          onPress={() => setExpanded(!expanded)}
        >
          <TreeItemIndicator expanded={expanded} />
          <TreeItemLabel>Upper body</TreeItemLabel>
        </TreeItem>
        {expanded && (
          <TreeGroup>
            <TreeItem
              accessibilityLabel="Select bench press"
              accessibilityState={{ selected: selected === "Bench press" }}
              onPress={() => setSelected("Bench press")}
            >
              <TreeItemIndicator selected={selected === "Bench press"} />
              <TreeItemLabel selected={selected === "Bench press"}>Bench press</TreeItemLabel>
            </TreeItem>
            <TreeItem
              accessibilityLabel="Select seated row"
              accessibilityState={{ selected: selected === "Seated row" }}
              onPress={() => setSelected("Seated row")}
            >
              <TreeItemIndicator selected={selected === "Seated row"} />
              <TreeItemLabel selected={selected === "Seated row"}>Seated row</TreeItemLabel>
            </TreeItem>
            <TreeItem accessibilityLabel="Select archived exercise" disabled>
              <TreeItemIndicator disabled />
              <TreeItemLabel disabled>Archived exercise</TreeItemLabel>
            </TreeItem>
          </TreeGroup>
        )}
        <TreeItem
          accessibilityLabel="Select lower body template"
          accessibilityState={{ selected: selected === "Lower body" }}
          onPress={() => setSelected("Lower body")}
        >
          <TreeItemIndicator selected={selected === "Lower body"} />
          <TreeItemLabel selected={selected === "Lower body"}>Lower body</TreeItemLabel>
        </TreeItem>
      </TreeView>
      <Text accessibilityLiveRegion="polite">Selected: {selected}</Text>
      <Text testID="native-description" variant="caption" tone="muted">
        A touch-first hierarchical outline with ordinary disclosure buttons. Expansion and selection
        stay explicit; grouping does not invent a desktop tree keyboard model.
      </Text>
    </View>
  )
}
