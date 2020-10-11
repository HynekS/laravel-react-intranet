import czechDateRegexp from "./czechDateRegexp"

// WARNING: this function does not care about the input validity.
export function swapCzDateToISODate(date) {
  return date.replace(czechDateRegexp, "$3-$2-$1")
}

export default swapCzDateToISODate
