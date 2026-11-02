import { Separator } from "../../../../generated/react-native/separator"
import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"

export default function SeparatorExample() {
  return (
    <View style={{ gap: 16 }}>
      <Text testID="native-description">Horizontal separation</Text>
      <Separator />
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Text>First</Text>
        <Separator orientation="vertical" />
        <Text>Second</Text>
      </View>
    </View>
  )
}
