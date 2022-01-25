export default function handleEnter(e: KeyboardEvent) {
  if (e.key === "Enter" || e.keyCode === 13) {
    const target = e?.target as HTMLFormElement
    const form = target.form
    const index = Array.prototype.indexOf.call(form, e.target)
    if (form.elements[index + 1].getAttribute("type") !== "submit") {
      form.elements[index + 1].focus()
      // if the next element is submit button, then submit
      e.preventDefault()
    }
  }
}
