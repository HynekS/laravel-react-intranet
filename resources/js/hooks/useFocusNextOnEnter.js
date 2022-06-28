import { useEffect, useRef } from "react"

export default function useFocusNextOnEnter() {
  const formRef = useRef()

  const isForm = node => Boolean(node.nodeName === "FORM")

  const filterFormElements = el => {
    if (
      el.nodeName.toLowerCase() === "fieldset" ||
      ["submit", "button", "hidden"].includes(el.getAttribute("type"))
    ) {
      return false
    }
    return true
  }

  useEffect(() => {
    const handleKeyPress = e => {
      if (e.key === "Enter" || e.keyCode === 13) {
        const fields = Array.from(e.target.form.elements).filter(filterFormElements)
        const index = fields.indexOf(e.target)
        if (index > -1 && fields[index + 1]) {
          fields[index + 1].focus()
          e.preventDefault()
        }
      }
    }

    if (formRef.current && isForm(formRef.current)) {
      formRef.current.addEventListener("keypress", handleKeyPress)

      return formRef.current.removeEventListener("keyPress", handleKeyPress)
    }
    console.error("Invalid call: Component using 'useFocusNextOnEnter' hook must be a form element")
  }, [])
  return formRef
}
