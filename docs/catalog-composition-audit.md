# Catalog composition audit

Audited the 51 component families, their rendered previews and prop playgrounds, minimal examples,
and the showcase. Rendered source remains a raw import of the file producing the canvas.

## Boundary

Ship a part when it supplies an identifiable role in a component composition: label truncation,
upload instructions, a link description, control/label alignment, or a table's scrolling surface.
Keep native attributes and explicit children. Only `Field` adds a layout prop: `orientation` defaults to `"vertical"`, with `"horizontal"` for a leading control beside its label/content. The additions need no context, hooks,
state propagation, generated IDs, or extracted static style recipes. React and Solid export each
part from its existing family barrel; Astro keeps the existing per-file import convention.

Application content, outer layout constraints, decorative illustrations, and the catalog's controls
are not new component APIs. Consumers still own values, validation, collection changes, file
transport, formatting, and announcements; the library supplies the elements that display them.

## Gaps fixed

| Families                        | Shared composition                                                                      | Native contract                                                                                                                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File upload                     | `FileDropzoneIcon`, `FileDropzoneTitle`, `FileDropzoneDescription`                      | Spans inside the existing label. The icon wrapper sizes a consumer-provided SVG; mark decorative icons `aria-hidden`. Keep the file input a direct dropzone child.                                                     |
| Breadcrumbs                     | `BreadcrumbEllipsis`                                                                    | Span with a decorative ellipsis and screen-reader text for omitted ancestors; custom children can replace the default content.                                                                                         |
| Radio                           | `RadioGroupLegend`                                                                      | Native legend naming the existing fieldset, with the default group-label typography.                                                                                                                                   |
| Stepper                         | `StepperContent`, `StepperDescription`                                                  | Spans for step copy and its secondary instruction, within the existing button, link, or item. No step state is inferred.                                                                                               |
| Tag input                       | `TagInputLabel`; default remove icon                                                    | A truncating span replaces reliance on the demo's `data-tag-label` selector. `TagInputRemove` supplies an SVG unless children are supplied; an accessible button name remains required.                                |
| Field, checkbox, radio, switch  | `Field orientation="horizontal"`, `FieldContent`, `FieldHeader`                         | Divs for a leading control with its label/description, stacked copy, and a label with a trailing control/readout. Explicit `for`/`htmlFor` and ARIA associations remain application-owned.                             |
| Field, file upload, tag input   | `FieldStatus`                                                                           | Native output with supporting text/icon styling and reserved line height. Native output has status semantics; use native `for`/`htmlFor`, `aria-live`, or `role` where appropriate.                                    |
| Field, slider, meter            | `FieldOutput`                                                                           | Native output with tabular numeric typography. It does not infer or format another control's value.                                                                                                                    |
| Slider                          | `SliderMarks`                                                                           | Div arranging explicit scale labels. Pass `aria-hidden` when the native input already communicates these bounds.                                                                                                       |
| Table, dialog table composition | `TableContainer`                                                                        | Div providing horizontal overflow and a bordered surface around the real table. Table markup and captions remain native. Use native focus/region attributes when the application needs a named keyboard scroll region. |
| Popover                         | `PopoverHeader`, `PopoverTitle`, `PopoverDescription`, `PopoverLink`                    | Div, strong, paragraph, and anchor. Links retain native navigation and keyboard focus; no menu roles or menu keyboard behavior are implied.                                                                            |
| Hover card                      | `HoverCardTitle`, `HoverCardDescription`                                                | Strong and paragraph for rich-preview hierarchy. No automatic accessible naming.                                                                                                                                       |
| Navigation menu                 | `NavigationMenuLinkContent`, `NavigationMenuLinkTitle`, `NavigationMenuLinkDescription` | Span, strong, and span supplying the recurring rich-link text composition.                                                                                                                                             |

All 23 new parts ship in Astro, React, and Solid. Previews use them directly and minimal examples
show the public APIs. Existing native state, file reset, IME handling, removal, focus, selection,
and link interactions remain with the original controls.

## Reviewed without additional APIs

- Accordion, alert, avatar, backdrop, badge, button, calendar, card, code (including the Shiki and TanStack highlighters),
  collapsible, combobox, command, date picker, dialog, drawer, dropdown menu, draggable,
  input, kbd, pagination, progress, resizable, select, separator, sidebar,
  skeleton, spinner, switch, tabs, textarea, time picker, toast, toggle, tooltip,
  tree view, and table of contents already expose the parts needed for their component roles.
  The checkbox/radio/switch field layouts and the dialog table wrapper now use the new shared parts.
- Charts and readiness metrics inside cards, marketing panels inside navigation menus,
  avatar identities, sidebar branding, article content, command result readouts, slider's studio
  panel, draggable coordinates, and dialog illustrations are application/demo content.
- Grids between independent examples, width constraints, spacing between unrelated sections,
  and native wrappers used only for alignment remain ordinary layout. No generic wrapper
  component was added merely to remove a `div`.
- Prop selectors, code inspectors, catalog navigation, variant headings, static toast sample
  positioning, and showcase marketing art direction remain catalog concerns. Existing shared
  components continue to provide the actual product controls within those layouts.

## Compatibility

These APIs are additive. The old tag-label data hook still works, but new examples use
`TagInputLabel`. Custom remove-button children override the default SVG. Native attributes,
refs, children, and consumer classes remain available. No icon package is added as a runtime
dependency.
