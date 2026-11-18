export function PhoneField() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input type="tel" name="phone" autoComplete="tel" title="Numéro de téléphone" />
    </form>
  )
}
