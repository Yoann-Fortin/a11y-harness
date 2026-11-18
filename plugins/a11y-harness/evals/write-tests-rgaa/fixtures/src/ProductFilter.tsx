export function ProductFilter({ onFilter }: { onFilter: (query: string) => void }) {
  return (
    <input
      type="text"
      aria-label="Filtrer les produits"
      onChange={(event) => onFilter(event.target.value)}
    />
  )
}
