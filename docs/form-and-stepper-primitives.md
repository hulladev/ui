# File upload, tag input, and stepper

These families are available in Astro, React, and Solid. The catalog includes working compositions,
interactive prop controls, exact rendered source, and minimal examples for each framework.

## File upload

`FileUpload` is an `input type="file"`. It accepts native attributes including `name`, `accept`,
`multiple`, `required`, `disabled`, `form`, and ARIA relationships. Native change events expose
`input.files`; `FormData` contains the selected `File` objects, and native form reset clears them.
`accept` is a picker hint, not file-content validation. Upload transport and validation remain the
application's responsibility.

`FileDropzone` is a label containing a `FileUpload` and descriptive children. The real input covers
the surface, so both clicking and native file dropping target the input. Keep a single file input
as a direct child and provide its accessible name with `aria-label` or `aria-labelledby`. The
label surface reflects the input's keyboard focus and disabled styling; it does not assign IDs or
propagate form attributes. No client-side controller is required.

## Tag input

Use `TagInput` (div), `TagInputTag` (span), `TagInputRemove` (button), and `TagInputControl` (text
input). The container supplies a wrapping field surface. Tags and remove controls are explicit
children; the application owns the collection, deduplication, validation, reset, and form values.
Use repeated hidden inputs for repeated form values. Native hidden inputs are intentional form
bridges, not replacement UI components.

`TagInputControl` accepts native text input props plus `onTagAdd(value)` in React and Solid.
Its native `value` is the draft string, not the collection. Enter trims and commits a nonempty,
natively valid draft, then clears it and emits an input event. Composition/IME Enter and repeated
key presses do not commit. Read-only and disabled controls, including disabled fieldset descendants,
do not commit. Return `false` from `onTagAdd` to retain a rejected draft. With a controlled draft,
update its state through the native input/change handler as usual.

In every framework, the control dispatches a bubbling, cancelable `hulla-tag-add` event with
`detail: { value: string }`. Astro consumers listen to that event. Calling `preventDefault()` retains
the draft and skips `onTagAdd`. Native `onKeyDown` handlers in React and Solid run before the shared
keyboard behavior and may prevent it. `maxlength`, `pattern`, and other native constraints remain
available. Collection-level errors and live announcements should be rendered by the application.

Backspace on an empty draft focuses the last enabled remove control in the same `TagInput`; it does
not delete a value. Remove controls use native Enter/Space activation. `TagInputRemove` requires an
accessible `aria-label`, accepts native button props, and defaults to `type="button"`. Give its
children an icon or text. After removing a focused tag, return focus to the text control or another
appropriate tag. For a disabled collection, a native disabled fieldset disables both entry and
removal without implicit state propagation.

There is no context, collection controller, child cloning, or generated ARIA relationship. The only
shared runtime helper implements the entry keyboard contract; each framework retains ownership of
its rendered values and lifecycle.

## Stepper

`Stepper` is an ordered list with `orientation="horizontal"` (default) or `"vertical"`.
`StepperItem` is a list item with `state="upcoming"` (default), `"current"`, or `"complete"`.
The current item receives `aria-current="step"`. Use one current item per stepper.

Compose items with `StepperIndicator` (span), `StepperLink` (anchor), or `StepperButton` (button).
Indicators take explicit numbers or icons and show a checkmark when their item is complete.
Slim progress marks follow the list orientation, with a stronger stroke for the current step. Upcoming steps keep readable labels even when their
buttons are disabled. Links preserve native navigation; buttons default to
`type="button"` and support native disabled states. A plain content child is appropriate for a
non-interactive future step. Put the list in a named native `nav` when it represents navigation.

The application controls the current step, validation, which steps are reachable, panel visibility,
focus after navigation, and `aria-controls` relationships. This is a progress/navigation primitive,
not a tabs widget: use normal Tab, Enter, and Space navigation rather than inventing roving arrow-key
behavior. No context or implicit form submission is introduced.
