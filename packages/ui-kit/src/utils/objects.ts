export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj)
}

export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}
