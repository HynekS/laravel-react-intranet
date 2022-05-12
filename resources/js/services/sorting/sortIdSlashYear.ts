let regex = /(\d+)\/(\d+)/

function replacer(_: string, g1: string, g2: string) {
  return g2 + g1.padStart(4, "0")
}

export function sortIdSlashYear(list: any[], key: any) {
  return list.sort(
    (a, b) => +String(a[key]).replace(regex, replacer) - +String(b[key]).replace(regex, replacer),
  )
}

export default sortIdSlashYear
