export default function handleEnter(e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    const form = e.target.form;
    const index = [].indexOf.call(form, e.target);
    form.elements[index + 1].focus();
    e.preventDefault();
  }
}