// WARNING: this function does not care about the input validity.
export function swapCzDateToISODate(date) {
  return date.replace(/(\d{1,2})\. ?(\d{1,2})\. ?(\d{4})/, "$3-$2-$1")
}

export default swapCzDateToISODate
