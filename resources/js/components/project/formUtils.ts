/*
import { akce as Akce } from "@codegen"

export const isFormDirty = (defaultValues: Akce, currentValues: Partial<Akce>) => {
  let isDirty = false
  //let currentValues = getValues()
  for (let key of Object.keys(currentValues) as Array<keyof Akce>) {
    if (String(defaultValues[key]) !== String(currentValues[key])) {
      isDirty = true
      break
    }
  }
  return isDirty
}

export const transformDefaultValues = (obj: any) => {
  if (!obj) return {}
  ;(Object.keys(obj) as Array<keyof Akce>).forEach((k: keyof Akce) => {
    if (obj[k] instanceof Object) {
      // (unneccessary in practise – the forms don't use nested values)
      return transformDefaultValues(obj[k])
    }
    if (["datum_pocatku", "datum_ukonceni"].includes(k)) {
      // Date objects
      obj[k] = new Date(obj[k])
    } else if (["objednavka", "smlouva", "registrovano_bit"].includes(k)) {
      // checkboxes
      obj[k] = Boolean(obj[k])
    } else {
      // other inputs
      obj[k] = obj[k] ? String(obj[k]) : ""
    }
  })

  return obj
}*/
