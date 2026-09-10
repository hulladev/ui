# Table of contents

`TableOfContents` builds an “On this page” navigation from `TableOfContentsSection` wrappers.
The component is available for Astro, React, and Solid under the `table-of-contents` family.

```tsx
import { TableOfContents, TableOfContentsSection } from "@/ui/table-of-contents"

export function Article() {
  return (
    <>
      <TableOfContents for="article">
        <span>On this page</span>
      </TableOfContents>
      <main id="article">
        <TableOfContentsSection id="overview" label="Overview">
          <h2>Overview</h2>
          <p>Wrap any content you want to include.</p>
        </TableOfContentsSection>
        <TableOfContentsSection id="details" label="Details">
          <h2>Details</h2>
          <p>Each stable ID is a shareable fragment address.</p>
        </TableOfContentsSection>
      </main>
    </>
  )
}
```

Solid uses the same composition, with `class` for styling. In Astro, import the default components
from `@/ui/table-of-contents/table-of-contents.astro` and
`@/ui/table-of-contents/table-of-contents-section.astro`.

## Contract

| Component                | Prop              | Purpose                                                                             |
| ------------------------ | ----------------- | ----------------------------------------------------------------------------------- |
| `TableOfContents`        | `for: string`     | ID of the container whose descendant wrappers appear in the list.                   |
| `TableOfContents`        | `offset?: number` | Active-section threshold from the scroll viewport's top, in pixels; defaults to 96. |
| `TableOfContentsSection` | `id: string`      | Unique, stable HTML ID used in shareable links.                                     |
| `TableOfContentsSection` | `label: string`   | Plain-text label for the navigation link.                                           |

Both components accept their native element attributes, children, refs where supported, and the
framework's class/style props. The contents renders a labelled `nav` and an ordered list; the
section wrapper renders a neutral `div`. Keep real headings inside the wrappers. Place navigation
alongside or above the content using your own layout, and give separate navigation instances
different accessible labels when necessary.

Links are discovered after JavaScript initializes. The server-rendered section IDs remain native
fragment targets without JavaScript. Links support copying, opening in a new tab, keyboard
activation, reloads, and Back/Forward navigation. Scrolling alone changes `aria-current="location"`
without rewriting the URL or adding history entries.

Wrappers are collected in DOM order. Mounted, removed, reordered, relabelled, hidden, and inert
sections update automatically. Each navigation is scoped to its `for` container. Scroll tracking
works with both the window and nested vertical scroll containers. The final section becomes active
at the bottom even if it cannot reach the threshold.

The wrapper's default scroll margin is `6rem`. If a sticky header needs a different clearance,
set the wrapper's native `style`/class to the desired `scroll-margin-top` and set the navigation's
`offset` to the matching pixel value. The offset affects tracking; the native scroll margin controls
link alignment.

Styling hooks are `data-slot="table-of-contents"`, `table-of-contents-list`,
`table-of-contents-item`, `table-of-contents-link`, and `table-of-contents-section`.
The active link also has `aria-current="location"`.
