export function resolve<const T>(value: T): T {
  void value
  throw new Error(
    "@hulla/ui: resolve(...) is a source-template marker and cannot run at runtime. " +
      "Process this file with uigen; the generated output replaces the call."
  )
}
