// Object is of type 'unknown' TS error when using `unknown` instead of `any`
const where = (arr: any[] = [], conditions = {}) =>
  arr.filter(elem => {
    for (let [key, value] of Object.entries(conditions)) {
      if (elem[key] !== value) return false
    }
    return true
  })

export default where
