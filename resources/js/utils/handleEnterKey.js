export default function handleEnter(e) {
  if (e.key === "Enter" || e.keyCode === 13) {
    const form = e.target.form
    const index = [].indexOf.call(form, e.target)
    if (form.elements[index + 1].getAttribute("type") !== "submit") {
      form.elements[index + 1].focus()
      // if the next element is submit button, then submit
      e.preventDefault()
    }
  }
}
