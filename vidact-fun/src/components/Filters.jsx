import { GENRES } from '../data/movies.js'

export function Filters({ filters, onChange, shown, total }) {
  return (
    <div className="filters">
      <input
        className="search"
        type="search"
        placeholder="Search titles"
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
      />
      <select
        className="genre"
        value={filters.genre}
        onChange={(event) => onChange({ ...filters, genre: event.target.value })}
      >
        {GENRES.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <label className="toggle">
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={(event) => onChange({ ...filters, availableOnly: event.target.checked })}
        />
        In stock only
      </label>
      <span className="count">
        {shown} of {total}
      </span>
    </div>
  )
}
