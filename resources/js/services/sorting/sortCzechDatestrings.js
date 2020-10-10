let regex = /(\d{1,2})\.?\s(\d{1,2})\.?\s(\d{4})/

function replacer(match, g1, g2, g3) {
  return g3 + g2.padStart(2, 0) + g1.padStart(2, 0)
}

export function sortCzechDates(a, b) {
  return String(a).replace(regex, replacer) - String(b).replace(regex, replacer)
}

export default sortCzechDates