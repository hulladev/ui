import type { UILibrary } from "@hulla/ui"

export const config = {
  schemaVersion: 1,
  name: "@hulla/ui",
  version: "0.2.1",
  frameworks: {
    astro: "./astro",
    react: "./react",
    solid: "./solid",
    "react-native": "./react-native",
  },
  components: {
    accordion: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    alert: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    avatar: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    backdrop: {
      frameworks: ["astro", "react", "solid"],
    },
    badge: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    breadcrumbs: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    button: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    calendar: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    card: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    checkbox: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    code: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "code-highlighter-shiki": {
      frameworks: ["astro", "react", "solid"],
    },
    "code-highlighter-tanstack": {
      frameworks: ["astro", "react", "solid"],
    },
    collapsible: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    combobox: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    command: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "date-picker": {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    dialog: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    draggable: {
      frameworks: ["astro", "react", "solid"],
    },
    drawer: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "dropdown-menu": {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "empty-state": {
      frameworks: ["react-native"],
    },
    field: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "file-upload": {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "hover-card": {
      frameworks: ["astro", "react", "solid"],
    },
    input: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    kbd: {
      frameworks: ["astro", "react", "solid"],
    },
    "keyboard-aware": {
      frameworks: ["react-native"],
    },
    "link-card": {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    list: {
      frameworks: ["react-native"],
    },
    meter: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "navigation-menu": {
      frameworks: ["astro", "react", "solid"],
    },
    "number-field": {
      frameworks: ["react-native"],
    },
    pagination: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    popover: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    progress: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    radio: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    resizable: {
      frameworks: ["astro", "react", "solid"],
    },
    select: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    separator: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    sidebar: {
      frameworks: ["astro", "react", "solid"],
    },
    skeleton: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    slider: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    spinner: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    stepper: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "swipe-actions": {
      frameworks: ["react-native"],
    },
    switch: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    table: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "table-of-contents": {
      frameworks: ["astro", "react", "solid"],
    },
    tabs: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "tag-input": {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    textarea: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "time-picker": {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    toast: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    toggle: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    tooltip: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    "tree-view": {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
    typography: {
      frameworks: ["astro", "react", "react-native", "solid"],
    },
  },
  author: "Samuel Hulla",
  copyFiles: {
    astro: [
      {
        src: "lib/collapsible.ts",
        dest: "lib/collapsible.ts",
        required: true,
        description: "Framework-neutral user-activated native disclosure transitions",
      },
      {
        src: "lib/table-of-contents.ts",
        dest: "lib/table-of-contents.ts",
        required: true,
        description: "Framework-neutral section discovery and scroll tracking",
      },
      {
        src: "lib/tag-input.ts",
        dest: "lib/tag-input.ts",
        required: true,
        description: "Framework-neutral tag entry keyboard and commit behavior",
      },
      {
        src: "lib/style.ts",
        dest: "lib/style.ts",
        required: true,
        description: "Shared class and variant composition helpers",
      },
      {
        src: "lib/layer-stack.ts",
        dest: "lib/layer-stack.ts",
        required: true,
        description: "Internal deterministic dialog stack",
      },
      {
        src: "lib/dialog.ts",
        dest: "lib/dialog.ts",
        required: true,
        description: "Framework-neutral modal dialog behavior",
      },
      {
        src: "lib/dropdown-menu.ts",
        dest: "lib/dropdown-menu.ts",
        required: true,
        description: "Framework-neutral dropdown menu behavior",
      },
      {
        src: "lib/navigation-menu.ts",
        dest: "lib/navigation-menu.ts",
        required: true,
        description: "Framework-neutral navigation menu disclosure behavior",
      },
      {
        src: "lib/combobox.ts",
        dest: "lib/combobox.ts",
        required: true,
        description: "Framework-neutral editable combobox and listbox behavior",
      },
      {
        src: "lib/command.ts",
        dest: "lib/command.ts",
        required: true,
        description: "Framework-neutral command menu filtering and keyboard behavior",
      },
      {
        src: "lib/select.ts",
        dest: "lib/select.ts",
        required: true,
        description: "Framework-neutral select and listbox behavior",
      },
      {
        src: "lib/floating-layer.ts",
        dest: "lib/floating-layer.ts",
        required: true,
        description: "Shared hover, focus, and Floating UI positioning behavior",
      },
      {
        src: "lib/spatial-interaction.ts",
        dest: "lib/spatial-interaction.ts",
        required: true,
        description: "Framework-neutral draggable and resizable element behavior",
      },
      {
        src: "lib/range-slider.ts",
        dest: "lib/range-slider.ts",
        required: true,
        description: "Framework-neutral two-thumb range slider behavior",
      },
      {
        src: "lib/tabs.ts",
        dest: "lib/tabs.ts",
        required: true,
        description: "Framework-neutral tabs selection and keyboard behavior",
      },
      {
        src: "lib/toggle.ts",
        dest: "lib/toggle.ts",
        required: true,
        description: "Framework-neutral toggle and toggle group state behavior",
      },
      {
        src: "lib/tree-view.ts",
        dest: "lib/tree-view.ts",
        required: true,
        description: "Framework-neutral tree view focus, selection, and disclosure behavior",
      },
      {
        src: "lib/calendar.ts",
        dest: "lib/calendar.ts",
        required: true,
        description: "Framework-neutral ISO calendar rendering and selection behavior",
      },
      {
        src: "lib/date-picker.ts",
        dest: "lib/date-picker.ts",
        required: true,
        description: "Framework-neutral date and local date-time picker behavior",
      },
      {
        src: "lib/time-picker.ts",
        dest: "lib/time-picker.ts",
        required: true,
        description: "Framework-neutral local time picker behavior",
      },
      {
        src: "lib/toast.ts",
        dest: "lib/toast.ts",
        required: true,
        description: "Framework-neutral toast store, utility API, and presentation contract",
      },
      {
        src: "styles.css",
        dest: "styles.css",
        required: true,
        description: "Shared @hulla/ui design tokens and Tailwind theme",
        globalStyle: true,
      },
      {
        src: "theme.css",
        dest: "theme.css",
        required: true,
        description: "Shared semantic theme generated from theme.json",
      },
    ],
    react: [
      {
        src: "lib/collapsible.ts",
        dest: "lib/collapsible.ts",
        required: true,
        description: "Framework-neutral user-activated native disclosure transitions",
      },
      {
        src: "lib/table-of-contents.ts",
        dest: "lib/table-of-contents.ts",
        required: true,
        description: "Framework-neutral section discovery and scroll tracking",
      },
      {
        src: "lib/tag-input.ts",
        dest: "lib/tag-input.ts",
        required: true,
        description: "Framework-neutral tag entry keyboard and commit behavior",
      },
      {
        src: "lib/style.ts",
        dest: "lib/style.ts",
        required: true,
        description: "Shared class and variant composition helpers",
      },
      {
        src: "lib/layer-stack.ts",
        dest: "lib/layer-stack.ts",
        required: true,
        description: "Internal deterministic dialog stack",
      },
      {
        src: "lib/dialog.ts",
        dest: "lib/dialog.ts",
        required: true,
        description: "Framework-neutral modal dialog behavior",
      },
      {
        src: "lib/dropdown-menu.ts",
        dest: "lib/dropdown-menu.ts",
        required: true,
        description: "Framework-neutral dropdown menu behavior",
      },
      {
        src: "lib/navigation-menu.ts",
        dest: "lib/navigation-menu.ts",
        required: true,
        description: "Framework-neutral navigation menu disclosure behavior",
      },
      {
        src: "lib/combobox.ts",
        dest: "lib/combobox.ts",
        required: true,
        description: "Framework-neutral editable combobox and listbox behavior",
      },
      {
        src: "lib/command.ts",
        dest: "lib/command.ts",
        required: true,
        description: "Framework-neutral command menu filtering and keyboard behavior",
      },
      {
        src: "lib/select.ts",
        dest: "lib/select.ts",
        required: true,
        description: "Framework-neutral select and listbox behavior",
      },
      {
        src: "lib/floating-layer.ts",
        dest: "lib/floating-layer.ts",
        required: true,
        description: "Shared hover, focus, and Floating UI positioning behavior",
      },
      {
        src: "lib/spatial-interaction.ts",
        dest: "lib/spatial-interaction.ts",
        required: true,
        description: "Framework-neutral draggable and resizable element behavior",
      },
      {
        src: "lib/range-slider.ts",
        dest: "lib/range-slider.ts",
        required: true,
        description: "Framework-neutral two-thumb range slider behavior",
      },
      {
        src: "lib/tabs.ts",
        dest: "lib/tabs.ts",
        required: true,
        description: "Framework-neutral tabs selection and keyboard behavior",
      },
      {
        src: "lib/toggle.ts",
        dest: "lib/toggle.ts",
        required: true,
        description: "Framework-neutral toggle and toggle group state behavior",
      },
      {
        src: "lib/tree-view.ts",
        dest: "lib/tree-view.ts",
        required: true,
        description: "Framework-neutral tree view focus, selection, and disclosure behavior",
      },
      {
        src: "lib/calendar.ts",
        dest: "lib/calendar.ts",
        required: true,
        description: "Framework-neutral ISO calendar rendering and selection behavior",
      },
      {
        src: "lib/date-picker.ts",
        dest: "lib/date-picker.ts",
        required: true,
        description: "Framework-neutral date and local date-time picker behavior",
      },
      {
        src: "lib/time-picker.ts",
        dest: "lib/time-picker.ts",
        required: true,
        description: "Framework-neutral local time picker behavior",
      },
      {
        src: "lib/toast.ts",
        dest: "lib/toast.ts",
        required: true,
        description: "Framework-neutral toast store, utility API, and presentation contract",
      },
      {
        src: "styles.css",
        dest: "styles.css",
        required: true,
        description: "Shared @hulla/ui design tokens and Tailwind theme",
        globalStyle: true,
      },
      {
        src: "theme.css",
        dest: "theme.css",
        required: true,
        description: "Shared semantic theme generated from theme.json",
      },
    ],
    "react-native": [
      {
        src: "lib/theme.tsx",
        dest: "lib/theme.tsx",
        required: true,
        description: "Scoped UI theme, fonts, and system appearance",
      },
      {
        src: "lib/tokens.ts",
        dest: "lib/tokens.ts",
        required: true,
        description: "Editable UI design tokens generated from theme.json",
      },
      {
        src: "lib/date.ts",
        dest: "lib/date.ts",
        required: true,
        description: "Local date parsing and selection limits",
        components: ["calendar", "date-picker"],
      },
      {
        src: "lib/text-input-style.ts",
        dest: "lib/text-input-style.ts",
        required: true,
        description: "Shared text-entry recipe",
        components: ["combobox", "input", "number-field", "textarea", "time-picker"],
      },
    ],
    solid: [
      {
        src: "lib/collapsible.ts",
        dest: "lib/collapsible.ts",
        required: true,
        description: "Framework-neutral user-activated native disclosure transitions",
      },
      {
        src: "lib/table-of-contents.ts",
        dest: "lib/table-of-contents.ts",
        required: true,
        description: "Framework-neutral section discovery and scroll tracking",
      },
      {
        src: "lib/tag-input.ts",
        dest: "lib/tag-input.ts",
        required: true,
        description: "Framework-neutral tag entry keyboard and commit behavior",
      },
      {
        src: "lib/style.ts",
        dest: "lib/style.ts",
        required: true,
        description: "Shared class and variant composition helpers",
      },
      {
        src: "lib/layer-stack.ts",
        dest: "lib/layer-stack.ts",
        required: true,
        description: "Internal deterministic dialog stack",
      },
      {
        src: "lib/dialog.ts",
        dest: "lib/dialog.ts",
        required: true,
        description: "Framework-neutral modal dialog behavior",
      },
      {
        src: "lib/dropdown-menu.ts",
        dest: "lib/dropdown-menu.ts",
        required: true,
        description: "Framework-neutral dropdown menu behavior",
      },
      {
        src: "lib/navigation-menu.ts",
        dest: "lib/navigation-menu.ts",
        required: true,
        description: "Framework-neutral navigation menu disclosure behavior",
      },
      {
        src: "lib/combobox.ts",
        dest: "lib/combobox.ts",
        required: true,
        description: "Framework-neutral editable combobox and listbox behavior",
      },
      {
        src: "lib/command.ts",
        dest: "lib/command.ts",
        required: true,
        description: "Framework-neutral command menu filtering and keyboard behavior",
      },
      {
        src: "lib/select.ts",
        dest: "lib/select.ts",
        required: true,
        description: "Framework-neutral select and listbox behavior",
      },
      {
        src: "lib/floating-layer.ts",
        dest: "lib/floating-layer.ts",
        required: true,
        description: "Shared hover, focus, and Floating UI positioning behavior",
      },
      {
        src: "lib/spatial-interaction.ts",
        dest: "lib/spatial-interaction.ts",
        required: true,
        description: "Framework-neutral draggable and resizable element behavior",
      },
      {
        src: "lib/range-slider.ts",
        dest: "lib/range-slider.ts",
        required: true,
        description: "Framework-neutral two-thumb range slider behavior",
      },
      {
        src: "lib/tabs.ts",
        dest: "lib/tabs.ts",
        required: true,
        description: "Framework-neutral tabs selection and keyboard behavior",
      },
      {
        src: "lib/toggle.ts",
        dest: "lib/toggle.ts",
        required: true,
        description: "Framework-neutral toggle and toggle group state behavior",
      },
      {
        src: "lib/tree-view.ts",
        dest: "lib/tree-view.ts",
        required: true,
        description: "Framework-neutral tree view focus, selection, and disclosure behavior",
      },
      {
        src: "lib/calendar.ts",
        dest: "lib/calendar.ts",
        required: true,
        description: "Framework-neutral ISO calendar rendering and selection behavior",
      },
      {
        src: "lib/date-picker.ts",
        dest: "lib/date-picker.ts",
        required: true,
        description: "Framework-neutral date and local date-time picker behavior",
      },
      {
        src: "lib/time-picker.ts",
        dest: "lib/time-picker.ts",
        required: true,
        description: "Framework-neutral local time picker behavior",
      },
      {
        src: "lib/toast.ts",
        dest: "lib/toast.ts",
        required: true,
        description: "Framework-neutral toast store, utility API, and presentation contract",
      },
      {
        src: "styles.css",
        dest: "styles.css",
        required: true,
        description: "Shared @hulla/ui design tokens and Tailwind theme",
        globalStyle: true,
      },
      {
        src: "theme.css",
        dest: "theme.css",
        required: true,
        description: "Shared semantic theme generated from theme.json",
      },
      {
        src: "lib/solid.ts",
        dest: "lib/solid.ts",
        required: true,
        description: "Solid lifecycle and ref helpers for controller-backed components",
      },
    ],
  },
  url: "https://hulla.dev/docs/ui",
} satisfies UILibrary
