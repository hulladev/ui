export const nativeCatalogEntries = [
  { id: "typography", title: "Typography", description: "Text roles and hierarchy." },
  { id: "button", title: "Button", description: "Actions, variants, and touch targets." },
  { id: "input", title: "Input", description: "Single-line editing and keyboard behavior." },
  { id: "textarea", title: "Textarea", description: "Multiline notes and native editing." },
  { id: "field", title: "Field", description: "Explicit labels, descriptions, and validation." },
  { id: "checkbox", title: "Checkbox", description: "Checked, mixed, and disabled selection." },
  { id: "radio", title: "Radio", description: "Explicit single-choice selection and groups." },
  { id: "switch", title: "Switch", description: "Native on/off selection." },
  { id: "toggle", title: "Toggle", description: "Independent pressed actions." },
  { id: "select", title: "Select", description: "Touch-friendly choice sheets." },
  { id: "combobox", title: "Combobox", description: "Searchable choices with explicit selection." },
  {
    id: "slider",
    title: "Slider",
    description: "Numeric adjustment by touch, keyboard, and accessibility actions.",
  },
  {
    id: "number-field",
    title: "NumberField",
    description: "Bounded numeric entry and increment controls.",
  },
  {
    id: "tag-input",
    title: "TagInput",
    description: "Editable collections with removable entries.",
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Local date selection, month navigation, and limits.",
  },
  {
    id: "date-picker",
    title: "DatePicker",
    description: "Confirmable calendar selection in a modal.",
  },
  {
    id: "time-picker",
    title: "TimePicker",
    description: "Local time entry with explicit confirmation.",
  },
  {
    id: "file-upload",
    title: "FileUpload",
    description: "Native document picking and attachment composition.",
  },
  { id: "card", title: "Card", description: "Related content and surface hierarchy." },
  { id: "dialog", title: "Dialog", description: "Modal tasks, focus containment, and dismissal." },
  {
    id: "drawer",
    title: "Drawer",
    description: "Bottom sheets with explicit close and back behavior.",
  },
  { id: "spinner", title: "Spinner", description: "Native activity indicators." },
  {
    id: "keyboard-aware",
    title: "KeyboardAware",
    description: "Native keyboard avoidance and scrollable forms.",
  },
] as const

export type NativeCatalogId = (typeof nativeCatalogEntries)[number]["id"]
