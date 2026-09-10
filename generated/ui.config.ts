import type { UILibrary } from "@hulla/ui"

export const config = {
  schemaVersion: 1,
  name: "@hulla/ui",
  version: "0.0.2-beta.0",
  frameworks: {
    astro: "./astro",
    react: "./react",
    solid: "./solid",
  },
  components: {
    accordion: {
      frameworks: ["astro", "react", "solid"],
    },
    alert: {
      frameworks: ["astro", "react", "solid"],
    },
    avatar: {
      frameworks: ["astro", "react", "solid"],
    },
    backdrop: {
      frameworks: ["astro", "react", "solid"],
    },
    badge: {
      frameworks: ["astro", "react", "solid"],
    },
    breadcrumbs: {
      frameworks: ["astro", "react", "solid"],
    },
    button: {
      frameworks: ["astro", "react", "solid"],
    },
    calendar: {
      frameworks: ["astro", "react", "solid"],
    },
    card: {
      frameworks: ["astro", "react", "solid"],
    },
    checkbox: {
      frameworks: ["astro", "react", "solid"],
    },
    code: {
      frameworks: ["astro", "react", "solid"],
    },
    "code-highlighter-shiki": {
      frameworks: ["astro", "react", "solid"],
    },
    "code-highlighter-tanstack": {
      frameworks: ["astro", "react", "solid"],
    },
    collapsible: {
      frameworks: ["astro", "react", "solid"],
    },
    combobox: {
      frameworks: ["astro", "react", "solid"],
    },
    command: {
      frameworks: ["astro", "react", "solid"],
    },
    "date-picker": {
      frameworks: ["astro", "react", "solid"],
    },
    dialog: {
      frameworks: ["astro", "react", "solid"],
    },
    draggable: {
      frameworks: ["astro", "react", "solid"],
    },
    drawer: {
      frameworks: ["astro", "react", "solid"],
    },
    "dropdown-menu": {
      frameworks: ["astro", "react", "solid"],
    },
    field: {
      frameworks: ["astro", "react", "solid"],
    },
    "file-upload": {
      frameworks: ["astro", "react", "solid"],
    },
    "hover-card": {
      frameworks: ["astro", "react", "solid"],
    },
    input: {
      frameworks: ["astro", "react", "solid"],
    },
    kbd: {
      frameworks: ["astro", "react", "solid"],
    },
    meter: {
      frameworks: ["astro", "react", "solid"],
    },
    "navigation-menu": {
      frameworks: ["astro", "react", "solid"],
    },
    pagination: {
      frameworks: ["astro", "react", "solid"],
    },
    popover: {
      frameworks: ["astro", "react", "solid"],
    },
    progress: {
      frameworks: ["astro", "react", "solid"],
    },
    radio: {
      frameworks: ["astro", "react", "solid"],
    },
    resizable: {
      frameworks: ["astro", "react", "solid"],
    },
    select: {
      frameworks: ["astro", "react", "solid"],
    },
    separator: {
      frameworks: ["astro", "react", "solid"],
    },
    sidebar: {
      frameworks: ["astro", "react", "solid"],
    },
    skeleton: {
      frameworks: ["astro", "react", "solid"],
    },
    slider: {
      frameworks: ["astro", "react", "solid"],
    },
    spinner: {
      frameworks: ["astro", "react", "solid"],
    },
    stepper: {
      frameworks: ["astro", "react", "solid"],
    },
    switch: {
      frameworks: ["astro", "react", "solid"],
    },
    table: {
      frameworks: ["astro", "react", "solid"],
    },
    "table-of-contents": {
      frameworks: ["astro", "react", "solid"],
    },
    tabs: {
      frameworks: ["astro", "react", "solid"],
    },
    "tag-input": {
      frameworks: ["astro", "react", "solid"],
    },
    textarea: {
      frameworks: ["astro", "react", "solid"],
    },
    "time-picker": {
      frameworks: ["astro", "react", "solid"],
    },
    toast: {
      frameworks: ["astro", "react", "solid"],
    },
    toggle: {
      frameworks: ["astro", "react", "solid"],
    },
    tooltip: {
      frameworks: ["astro", "react", "solid"],
    },
    "tree-view": {
      frameworks: ["astro", "react", "solid"],
    },
  },
  author: "Samuel Hulla",
  copyFiles: {
    shared: [
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
        description: "Shared Hulla design tokens and Tailwind theme",
        globalStyle: true,
      },
    ],
    solid: [
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
