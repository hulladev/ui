export function resolve<const T>(value: T): T {
  throw new Error(
    `[🤖 @hulla/ui]: Do not use resolve in your components directly. It should be used in template you run build on`
  )
}
