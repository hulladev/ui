export const keys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>
export const values = <T extends object>(obj: T) => Object.values(obj) as Array<T[keyof T]>
export const entries = <T extends object>(obj: T) => Object.entries(obj) as [keyof T, T[keyof T]][]
