import tableOfContentsCatalogSource from "../components/previews/TableOfContentsPreview.astro?raw"
import dialogOverlaysSource from "../components/previews/DialogOverlays.astro?raw"
import backdropCatalogSource from "../components/previews/BackdropPreview.astro?raw"
import drawerCatalogSource from "../components/previews/DrawerPreview.astro?raw"
import stepperCatalogSource from "../components/previews/StepperPreview.astro?raw"
import tagInputCatalogSource from "../components/previews/TagInputPreview.astro?raw"
import fileUploadCatalogSource from "../components/previews/FileUploadPreview.astro?raw"
import accordionCatalogSource from "../components/previews/AccordionPreview.astro?raw"
import alertCatalogSource from "../components/previews/AlertPreview.astro?raw"
import avatarCatalogSource from "../components/previews/AvatarPreview.astro?raw"
import badgeCatalogSource from "../components/previews/BadgePreview.astro?raw"
import breadcrumbsCatalogSource from "../components/previews/BreadcrumbsPreview.astro?raw"
import buttonCatalogSource from "../components/previews/ButtonPreview.astro?raw"
import cardCatalogSource from "../components/previews/CardPreview.astro?raw"
import calendarCatalogSource from "../components/previews/CalendarPreview.astro?raw"
import checkboxCatalogSource from "../components/previews/CheckboxPreview.astro?raw"
import codeCatalogSource from "../components/previews/CodePreview.astro?raw"
import comboboxCatalogSource from "../components/previews/ComboboxPreview.astro?raw"
import commandCatalogSource from "../components/previews/CommandPreview.astro?raw"
import collapsibleCatalogSource from "../components/previews/CollapsiblePreview.astro?raw"
import dialogCatalogSource from "../components/previews/DialogPreview.astro?raw"
import draggableCatalogSource from "../components/previews/DraggablePreview.astro?raw"
import datePickerCatalogSource from "../components/previews/DatePickerPreview.astro?raw"
import dropdownMenuCatalogSource from "../components/previews/DropdownMenuPreview.astro?raw"
import fieldCatalogSource from "../components/previews/FieldPreview.astro?raw"
import hoverCardCatalogSource from "../components/previews/HoverCardPreview.astro?raw"
import inputCatalogSource from "../components/previews/InputPreview.astro?raw"
import kbdCatalogSource from "../components/previews/KbdPreview.astro?raw"
import meterCatalogSource from "../components/previews/MeterPreview.astro?raw"
import navigationMenuCatalogSource from "../components/previews/NavigationMenuPreview.astro?raw"
import paginationCatalogSource from "../components/previews/PaginationPreview.astro?raw"
import popoverCatalogSource from "../components/previews/PopoverPreview.astro?raw"
import progressCatalogSource from "../components/previews/ProgressPreview.astro?raw"
import radioCatalogSource from "../components/previews/RadioPreview.astro?raw"
import resizableCatalogSource from "../components/previews/ResizablePreview.astro?raw"
import selectCatalogSource from "../components/previews/SelectPreview.astro?raw"
import separatorCatalogSource from "../components/previews/SeparatorPreview.astro?raw"
import sidebarCatalogSource from "../components/previews/SidebarPreview.astro?raw"
import skeletonCatalogSource from "../components/previews/SkeletonPreview.astro?raw"
import spinnerCatalogSource from "../components/previews/SpinnerPreview.astro?raw"
import switchCatalogSource from "../components/previews/SwitchPreview.astro?raw"
import tableCatalogSource from "../components/previews/TablePreview.astro?raw"
import tabsCatalogSource from "../components/previews/TabsPreview.astro?raw"
import textareaCatalogSource from "../components/previews/TextareaPreview.astro?raw"
import timePickerCatalogSource from "../components/previews/TimePickerPreview.astro?raw"
import toastCatalogSource from "../components/previews/ToastPreview.astro?raw"
import toggleCatalogSource from "../components/previews/TogglePreview.astro?raw"
import tooltipCatalogSource from "../components/previews/TooltipPreview.astro?raw"
import treeViewCatalogSource from "../components/previews/TreeViewPreview.astro?raw"
import sliderCatalogSource from "../components/previews/SliderPreview.astro?raw"

type PreviewSource = {
  code: string
  filename: string
  framework: string
  label?: string
  language: "astro" | "css" | "tsx"
}

const exactCatalogPreview = (catalogFilename: string, catalogSource: string): PreviewSource[] => [
  {
    code: catalogSource,
    filename: `apps/catalog/src/components/previews/${catalogFilename}`,
    framework: "Astro",
    label: "Rendered source",
    language: "astro",
  },
]

export const buttonPreviewSources = exactCatalogPreview("ButtonPreview.astro", buttonCatalogSource)

export const avatarPreviewSources = exactCatalogPreview("AvatarPreview.astro", avatarCatalogSource)

export const badgePreviewSources = exactCatalogPreview("BadgePreview.astro", badgeCatalogSource)

export const breadcrumbsPreviewSources = exactCatalogPreview(
  "BreadcrumbsPreview.astro",
  breadcrumbsCatalogSource
)

export const paginationPreviewSources = exactCatalogPreview(
  "PaginationPreview.astro",
  paginationCatalogSource
)

export const kbdPreviewSources = exactCatalogPreview("KbdPreview.astro", kbdCatalogSource)

export const codePreviewSources = exactCatalogPreview("CodePreview.astro", codeCatalogSource)

export const skeletonPreviewSources = exactCatalogPreview(
  "SkeletonPreview.astro",
  skeletonCatalogSource
)

export const spinnerPreviewSources = exactCatalogPreview(
  "SpinnerPreview.astro",
  spinnerCatalogSource
)

export const progressPreviewSources = exactCatalogPreview(
  "ProgressPreview.astro",
  progressCatalogSource
)

export const meterPreviewSources = exactCatalogPreview("MeterPreview.astro", meterCatalogSource)

export const separatorPreviewSources = exactCatalogPreview(
  "SeparatorPreview.astro",
  separatorCatalogSource
)

export const inputPreviewSources = exactCatalogPreview("InputPreview.astro", inputCatalogSource)

export const fieldPreviewSources = exactCatalogPreview("FieldPreview.astro", fieldCatalogSource)

export const textareaPreviewSources = exactCatalogPreview(
  "TextareaPreview.astro",
  textareaCatalogSource
)

export const switchPreviewSources = exactCatalogPreview("SwitchPreview.astro", switchCatalogSource)

export const togglePreviewSources = exactCatalogPreview("TogglePreview.astro", toggleCatalogSource)

export const checkboxPreviewSources = exactCatalogPreview(
  "CheckboxPreview.astro",
  checkboxCatalogSource
)

export const radioPreviewSources = exactCatalogPreview("RadioPreview.astro", radioCatalogSource)

export const sliderPreviewSources = exactCatalogPreview("SliderPreview.astro", sliderCatalogSource)

export const selectPreviewSources = exactCatalogPreview("SelectPreview.astro", selectCatalogSource)

export const comboboxPreviewSources = exactCatalogPreview(
  "ComboboxPreview.astro",
  comboboxCatalogSource
)

export const commandPreviewSources = exactCatalogPreview(
  "CommandPreview.astro",
  commandCatalogSource
)

export const popoverPreviewSources = exactCatalogPreview(
  "PopoverPreview.astro",
  popoverCatalogSource
)

export const tooltipPreviewSources = exactCatalogPreview(
  "TooltipPreview.astro",
  tooltipCatalogSource
)

export const hoverCardPreviewSources = exactCatalogPreview(
  "HoverCardPreview.astro",
  hoverCardCatalogSource
)

export const dropdownMenuPreviewSources = exactCatalogPreview(
  "DropdownMenuPreview.astro",
  dropdownMenuCatalogSource
)

export const navigationMenuPreviewSources = exactCatalogPreview(
  "NavigationMenuPreview.astro",
  navigationMenuCatalogSource
)

export const dialogPreviewSources = [
  ...exactCatalogPreview("DialogPreview.astro", dialogCatalogSource),
  ...exactCatalogPreview("DialogOverlays.astro", dialogOverlaysSource),
]
export const backdropPreviewSources = exactCatalogPreview(
  "BackdropPreview.astro",
  backdropCatalogSource
)
export const drawerPreviewSources = exactCatalogPreview("DrawerPreview.astro", drawerCatalogSource)

export const tabsPreviewSources = exactCatalogPreview("TabsPreview.astro", tabsCatalogSource)

export const cardPreviewSources = exactCatalogPreview("CardPreview.astro", cardCatalogSource)

export const calendarPreviewSources = exactCatalogPreview(
  "CalendarPreview.astro",
  calendarCatalogSource
)

export const datePickerPreviewSources = exactCatalogPreview(
  "DatePickerPreview.astro",
  datePickerCatalogSource
)

export const timePickerPreviewSources = exactCatalogPreview(
  "TimePickerPreview.astro",
  timePickerCatalogSource
)

export const draggablePreviewSources = exactCatalogPreview(
  "DraggablePreview.astro",
  draggableCatalogSource
)

export const resizablePreviewSources = exactCatalogPreview(
  "ResizablePreview.astro",
  resizableCatalogSource
)

export const tablePreviewSources = exactCatalogPreview("TablePreview.astro", tableCatalogSource)

export const alertPreviewSources = exactCatalogPreview("AlertPreview.astro", alertCatalogSource)

export const toastPreviewSources = exactCatalogPreview("ToastPreview.astro", toastCatalogSource)

export const accordionPreviewSources = exactCatalogPreview(
  "AccordionPreview.astro",
  accordionCatalogSource
)

export const collapsiblePreviewSources = exactCatalogPreview(
  "CollapsiblePreview.astro",
  collapsibleCatalogSource
)

export const sidebarPreviewSources = exactCatalogPreview(
  "SidebarPreview.astro",
  sidebarCatalogSource
)

export const treeViewPreviewSources = exactCatalogPreview(
  "TreeViewPreview.astro",
  treeViewCatalogSource
)

export const fileUploadPreviewSources = exactCatalogPreview(
  "FileUploadPreview.astro",
  fileUploadCatalogSource
)

export const tagInputPreviewSources = exactCatalogPreview(
  "TagInputPreview.astro",
  tagInputCatalogSource
)

export const stepperPreviewSources = exactCatalogPreview(
  "StepperPreview.astro",
  stepperCatalogSource
)

export const tableOfContentsPreviewSources = exactCatalogPreview(
  "TableOfContentsPreview.astro",
  tableOfContentsCatalogSource
)
