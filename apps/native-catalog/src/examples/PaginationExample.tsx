import { useState } from "react"
import {
  Pagination,
  PaginationItem,
  PaginationItemText,
} from "../../../../generated/react-native/pagination"
import { Text } from "../../../../generated/react-native/typography"
export default function PaginationExample() {
  const [page, setPage] = useState(1)
  return (
    <>
      <Text accessibilityLiveRegion="polite">Session history · page {page} of 3</Text>
      <Text>
        {page === 1
          ? "This week: 3 sessions"
          : page === 2
            ? "Last week: 4 sessions"
            : "Two weeks ago: 2 sessions"}
      </Text>
      <Pagination>
        <PaginationItem
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          accessibilityLabel="Previous page"
        >
          <PaginationItemText disabled={page === 1}>Previous</PaginationItemText>
        </PaginationItem>
        {[1, 2, 3].map((number) => (
          <PaginationItem
            key={number}
            current={number === page}
            onPress={() => setPage(number)}
            accessibilityLabel={`Page ${number}`}
          >
            <PaginationItemText current={number === page}>{number}</PaginationItemText>
          </PaginationItem>
        ))}
        <PaginationItem
          disabled={page === 3}
          onPress={() => setPage(page + 1)}
          accessibilityLabel="Next page"
        >
          <PaginationItemText disabled={page === 3}>Next</PaginationItemText>
        </PaginationItem>
      </Pagination>
      <Text testID="native-description" variant="caption" tone="muted">
        Explicit page selection is useful for bounded history. Long feeds can use native virtualized
        lists instead.
      </Text>
    </>
  )
}
