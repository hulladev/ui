import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Table, TableRow, TableHeader, TableCell } from "../../../../generated/react-native/table"

export default function TableExample() {
  return (
    <View style={{ gap: 20 }}>
      <Text variant="heading">Recent sets</Text>
      <Text variant="caption" tone="muted">
        Scroll horizontally to compare every column.
      </Text>
      <Table accessibilityLabel="Recent sets, horizontally scrollable">
        <TableRow>
          <TableHeader>Exercise</TableHeader>
          <TableHeader>Weight</TableHeader>
          <TableHeader>Repetitions</TableHeader>
          <TableHeader>Effort</TableHeader>
        </TableRow>
        {[
          ["Bench press", "60 kg", "8", "7 of 10"],
          ["Seated row", "45 kg", "10", "8 of 10"],
          ["Overhead press", "30 kg", "8", "8 of 10"],
        ].map(([exercise, weight, reps, effort], index) => (
          <TableRow
            key={exercise}
            separator={index < 2}
            accessible
            accessibilityLabel={`${exercise}, ${weight}, ${reps} repetitions, effort ${effort}`}
          >
            <TableCell>{exercise}</TableCell>
            <TableCell>{weight}</TableCell>
            <TableCell>{reps}</TableCell>
            <TableCell>{effort}</TableCell>
          </TableRow>
        ))}
      </Table>
      <Text testID="native-description" variant="caption" tone="muted">
        A read-only comparison surface. Rows provide complete accessible summaries; horizontal
        scrolling preserves readable columns on narrow screens.
      </Text>
    </View>
  )
}
