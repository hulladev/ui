import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { useState } from "react"
import {
  List,
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
} from "../../../../generated/react-native/list"
import { Badge } from "../../../../generated/react-native/badge"

export default function ListExample() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <View style={{ gap: 20 }}>
      <List>
        <ListItem accessibilityLabel="Open bench press" onPress={() => setSelected("Bench press")}>
          <ListItemContent>
            <ListItemTitle>Bench press</ListItemTitle>
            <ListItemDescription>3 sets · 8 repetitions</ListItemDescription>
          </ListItemContent>
          <Badge>Next</Badge>
        </ListItem>
        <ListItem accessibilityLabel="Open seated row" onPress={() => setSelected("Seated row")}>
          <ListItemContent>
            <ListItemTitle>Seated row</ListItemTitle>
            <ListItemDescription>3 sets · 10 repetitions</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem disabled accessibilityLabel="Open archived exercise">
          <ListItemContent>
            <ListItemTitle disabled>Archived exercise</ListItemTitle>
            <ListItemDescription disabled>Unavailable in this template</ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>
      <Text accessibilityLiveRegion="polite">
        {selected ? `Opened ${selected}.` : "Choose an exercise."}
      </Text>
      <Text testID="native-description" variant="caption" tone="muted">
        Rows expose native press events and disabled state. Use FlatList for large datasets; these
        parts also compose inside its renderItem.
      </Text>
    </View>
  )
}
