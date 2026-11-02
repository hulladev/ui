export const nativeCatalogEntries = [
  { id: "typography", title: "Typography", description: "Text roles and hierarchy." },
  { id: "button", title: "Button", description: "Actions, variants, and touch targets." },
  { id: "input", title: "Input", description: "Single-line editing and keyboard behavior." },
  { id: "field", title: "Field", description: "Explicit labels, descriptions, and validation." },
  { id: "checkbox", title: "Checkbox", description: "Checked, mixed, and disabled selection." },
  { id: "switch", title: "Switch", description: "Native on/off selection." },
  { id: "dialog", title: "Dialog", description: "Modal tasks, focus containment, and dismissal." },
  {
    id: "drawer",
    title: "Drawer",
    description: "Bottom sheets with explicit close and back behavior.",
  },
  { id: "spinner", title: "Spinner", description: "Native activity indicators." },
] as const

export type NativeCatalogId = (typeof nativeCatalogEntries)[number]["id"]
