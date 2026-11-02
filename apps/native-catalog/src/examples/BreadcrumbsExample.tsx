import { useState } from "react"
import {
  Breadcrumbs,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbText,
  BreadcrumbSeparator,
} from "../../../../generated/react-native/breadcrumbs"
import { Text } from "../../../../generated/react-native/typography"
export default function BreadcrumbsExample() {
  const [destination, setDestination] = useState("Upper body A")
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Breadcrumb
            onPress={() => setDestination("Templates")}
            accessibilityLabel="Go to Templates"
          >
            <BreadcrumbText>Templates</BreadcrumbText>
          </Breadcrumb>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbSeparator />
          <Breadcrumb
            onPress={() => setDestination("Strength")}
            accessibilityLabel="Go to Strength"
          >
            <BreadcrumbText>Strength</BreadcrumbText>
          </Breadcrumb>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbSeparator />
          <Breadcrumb current accessibilityLabel="Upper body A, current page">
            <BreadcrumbText current>Upper body A</BreadcrumbText>
          </Breadcrumb>
        </BreadcrumbItem>
      </Breadcrumbs>
      <Text accessibilityLiveRegion="polite">Selected destination: {destination}</Text>
      <Text testID="native-description" variant="caption" tone="muted">
        Compact hierarchy links retain 48-unit touch targets. Use application navigation callbacks;
        a back button is often enough on smaller screens.
      </Text>
    </>
  )
}
