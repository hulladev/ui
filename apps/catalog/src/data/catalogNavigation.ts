export const catalogSectionGroups = [
  "Foundations",
  "Forms",
  "Navigation & overlays",
  "Layout & feedback",
] as const

export type CatalogSectionGroup = (typeof catalogSectionGroups)[number]

export type CatalogNavigationItem = {
  group: CatalogSectionGroup
  href: `#${string}`
  keywords: readonly string[]
  label: string
}

export const catalogSections = [
  {
    group: "Foundations",
    href: "#button",
    keywords: ["action", "click", "control", "submit"],
    label: "Button",
  },
  {
    group: "Foundations",
    href: "#avatar",
    keywords: ["image", "person", "profile", "fallback"],
    label: "Avatar",
  },
  {
    group: "Foundations",
    href: "#badge",
    keywords: ["status", "label", "tag", "pill"],
    label: "Badge",
  },
  {
    group: "Foundations",
    href: "#breadcrumbs",
    keywords: ["path", "hierarchy", "navigation"],
    label: "Breadcrumbs",
  },
  {
    group: "Foundations",
    href: "#pagination",
    keywords: ["pages", "next", "previous", "navigation"],
    label: "Pagination",
  },
  {
    group: "Foundations",
    href: "#kbd",
    keywords: ["keyboard", "shortcut", "key"],
    label: "Kbd",
  },
  {
    group: "Foundations",
    href: "#code",
    keywords: ["code", "syntax", "highlight", "developer", "shiki", "tanstack"],
    label: "Code",
  },
  {
    group: "Foundations",
    href: "#skeleton",
    keywords: ["loading", "placeholder", "shimmer"],
    label: "Skeleton",
  },
  {
    group: "Foundations",
    href: "#spinner",
    keywords: ["loading", "busy", "indeterminate", "activity"],
    label: "Spinner",
  },
  {
    group: "Foundations",
    href: "#progress",
    keywords: ["loading", "completion", "determinate", "progressbar"],
    label: "Progress",
  },
  {
    group: "Foundations",
    href: "#meter",
    keywords: ["measurement", "range", "threshold", "gauge", "capacity"],
    label: "Meter",
  },
  {
    group: "Foundations",
    href: "#separator",
    keywords: ["divider", "rule", "horizontal", "vertical"],
    label: "Separator",
  },
  {
    group: "Forms",
    href: "#file-upload",
    keywords: ["file", "upload", "attachment", "dropzone"],
    label: "File Upload",
  },
  {
    group: "Forms",
    href: "#tag-input",
    keywords: ["tag", "label", "chip", "recipient"],
    label: "Tag Input",
  },
  {
    group: "Forms",
    href: "#input",
    keywords: ["text", "form", "adornment", "control"],
    label: "Input",
  },
  {
    group: "Forms",
    href: "#field",
    keywords: ["form", "label", "description", "error", "validation"],
    label: "Field",
  },
  {
    group: "Forms",
    href: "#calendar",
    keywords: ["calendar", "date", "range", "month", "grid"],
    label: "Calendar",
  },
  {
    group: "Forms",
    href: "#date-picker",
    keywords: ["date", "range", "picker", "calendar", "form"],
    label: "Date Picker",
  },
  {
    group: "Forms",
    href: "#time-picker",
    keywords: ["time", "clock", "picker", "schedule", "form"],
    label: "Time Picker",
  },
  {
    group: "Forms",
    href: "#textarea",
    keywords: ["multiline", "text", "form"],
    label: "Textarea",
  },
  {
    group: "Forms",
    href: "#checkbox",
    keywords: ["check", "boolean", "indeterminate", "form"],
    label: "Checkbox",
  },
  {
    group: "Forms",
    href: "#radio",
    keywords: ["choice", "option", "group", "form"],
    label: "Radio",
  },
  {
    group: "Forms",
    href: "#switch",
    keywords: ["toggle", "boolean", "setting", "form"],
    label: "Switch",
  },
  {
    group: "Forms",
    href: "#toggle",
    keywords: ["pressed", "group", "formatting", "segmented", "control"],
    label: "Toggle",
  },
  {
    group: "Forms",
    href: "#slider",
    keywords: ["range", "value", "minimum", "maximum", "form"],
    label: "Slider",
  },
  {
    group: "Forms",
    href: "#select",
    keywords: ["option", "picker", "listbox", "dropdown", "form"],
    label: "Select",
  },
  {
    group: "Forms",
    href: "#combobox",
    keywords: ["autocomplete", "search", "listbox", "picker", "form"],
    label: "Combobox",
  },
  {
    group: "Navigation & overlays",
    href: "#table-of-contents",
    keywords: ["toc", "on this page", "anchors", "scroll", "sections"],
    label: "Table of contents",
  },
  {
    group: "Navigation & overlays",
    href: "#stepper",
    keywords: ["step", "wizard", "progress", "checkout"],
    label: "Stepper",
  },
  {
    group: "Navigation & overlays",
    href: "#command",
    keywords: ["palette", "search", "menu", "shortcut", "cmdk"],
    label: "Command",
  },
  {
    group: "Navigation & overlays",
    href: "#popover",
    keywords: ["floating", "overlay", "anchor"],
    label: "Popover",
  },
  {
    group: "Navigation & overlays",
    href: "#tooltip",
    keywords: ["floating", "hint", "description", "overlay"],
    label: "Tooltip",
  },
  {
    group: "Navigation & overlays",
    href: "#hover-card",
    keywords: ["floating", "preview", "rich", "overlay"],
    label: "HoverCard",
  },
  {
    group: "Navigation & overlays",
    href: "#dropdown-menu",
    keywords: ["menu", "actions", "floating", "overlay"],
    label: "Dropdown Menu",
  },
  {
    group: "Navigation & overlays",
    href: "#navigation-menu",
    keywords: ["navigation", "mega menu", "hover", "site", "header"],
    label: "Navigation Menu",
  },
  {
    group: "Navigation & overlays",
    href: "#backdrop",
    keywords: ["dimming", "blur", "overlay"],
    label: "Backdrop",
  },
  {
    group: "Navigation & overlays",
    href: "#drawer",
    keywords: ["sheet", "panel", "modal", "edge"],
    label: "Drawer",
  },
  {
    group: "Navigation & overlays",
    href: "#dialog",
    keywords: ["modal", "backdrop", "overlay", "focus trap"],
    label: "Dialog",
  },
  {
    group: "Navigation & overlays",
    href: "#tabs",
    keywords: ["panels", "navigation", "selection"],
    label: "Tabs",
  },
  {
    group: "Navigation & overlays",
    href: "#accordion",
    keywords: ["disclosure", "details", "expand", "collapse"],
    label: "Accordion",
  },
  {
    group: "Navigation & overlays",
    href: "#collapsible",
    keywords: ["disclosure", "details", "expand", "collapse"],
    label: "Collapsible",
  },
  {
    group: "Navigation & overlays",
    href: "#sidebar",
    keywords: ["rail", "navigation", "menu", "aside"],
    label: "Sidebar",
  },
  {
    group: "Navigation & overlays",
    href: "#tree-view",
    keywords: ["tree", "hierarchy", "files", "nested", "explorer"],
    label: "Tree View",
  },
  {
    group: "Layout & feedback",
    href: "#card",
    keywords: ["surface", "container", "content"],
    label: "Card",
  },
  {
    group: "Layout & feedback",
    href: "#draggable",
    keywords: ["drag", "move", "spatial", "interaction"],
    label: "Draggable",
  },
  {
    group: "Layout & feedback",
    href: "#resizable",
    keywords: ["resize", "handle", "spatial", "split"],
    label: "Resizable",
  },
  {
    group: "Layout & feedback",
    href: "#table",
    keywords: ["data", "rows", "columns", "grid"],
    label: "Table",
  },
  {
    group: "Layout & feedback",
    href: "#alert",
    keywords: ["feedback", "message", "notice", "warning", "error"],
    label: "Alert",
  },
  {
    group: "Layout & feedback",
    href: "#toast",
    keywords: ["feedback", "notification", "message", "queue", "stack"],
    label: "Toast",
  },
] as const satisfies readonly CatalogNavigationItem[]

export type CatalogSectionHref = (typeof catalogSections)[number]["href"]
export type CatalogSectionId = CatalogSectionHref extends `#${infer Id}` ? Id : never

export const getCatalogSectionId = <Href extends CatalogSectionHref>(href: Href) =>
  href.slice(1) as Href extends `#${infer Id}` ? Id : never

export const catalogResources = [
  {
    href: "/showcase",
    keywords: ["theme", "example", "product", "page"],
    label: "Default theme example",
  },
  {
    href: "https://hulla.dev/docs/ui",
    keywords: ["guide", "reference", "website"],
    label: "Documentation",
  },
] as const

export const catalogPages = [
  {
    group: "Foundations",
    href: "/",
    description: "Core building blocks, identity, and loading states.",
  },
  {
    group: "Forms",
    href: "/forms",
    description: "Inputs, selection, and validation for everyday forms.",
  },
  {
    group: "Navigation & overlays",
    href: "/navigation-overlays",
    description: "Move between views and reveal contextual content.",
  },
  {
    group: "Layout & feedback",
    href: "/layout-feedback",
    description: "Structure content and keep people informed.",
  },
] as const satisfies readonly { group: CatalogSectionGroup; href: string; description: string }[]

export const getCatalogSectionHref = (
  section: Pick<CatalogNavigationItem, "group" | "href">,
  currentGroup?: CatalogSectionGroup
) =>
  section.group === currentGroup
    ? section.href
    : `${catalogPages.find((page) => page.group === section.group)!.href}${section.href}`
