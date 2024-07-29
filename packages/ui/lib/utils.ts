export function uniqBy<T>(arr: T[], key: keyof T) {
  return arr.filter((item, index, self) => self.findIndex((t) => t[key] === item[key]) === index)
}
