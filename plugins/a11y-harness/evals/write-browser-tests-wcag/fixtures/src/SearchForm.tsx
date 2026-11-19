import './SearchForm.css'

export function SearchForm({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(String(new FormData(event.currentTarget).get('query')))
      }}
    >
      <label htmlFor="query">Rechercher un produit</label>
      <input id="query" name="query" type="search" />
      <button type="submit" aria-label="Lancer la recherche">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
          <path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
        </svg>
      </button>
    </form>
  )
}
