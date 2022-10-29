import { akce as Akce } from "@codegen"

export const isFormDirty = (defaultValues: Akce, currentValues: Partial<Akce>) => {
  let isDirty = false
  for (let key of Object.keys(currentValues) as Array<keyof Akce>) {
    if (String(defaultValues[key]) !== String(currentValues[key])) {
      isDirty = true
      break
    }
  }
  return isDirty
}

export const transformDefaultValues = (original: Akce | undefined) => {
  let obj = { ...original }
  if (!obj) return {}
  ;(Object.keys(obj) as Array<keyof Akce>).forEach((k: keyof Akce) => {
    if (obj[k] instanceof Object) {
      // (unneccessary in practise)
      return transformDefaultValues(obj[k])
    }
    if (["datum_pocatku", "datum_ukonceni"].includes(k)) {
      // Date objects
      obj[k] = obj[k] ? new Date(obj[k]) : null
      // checkboxes
    } else if (["objednavka", "smlouva", "registrovano_bit"].includes(k)) {
      // checkboxes
      obj[k] = Boolean(obj[k])
    } else {
      // other inputs
      obj[k] = obj[k] ? String(obj[k]) : ""
    }
  })

  return obj
}
