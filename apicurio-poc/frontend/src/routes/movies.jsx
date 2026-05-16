import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRental, getMovies, NewRental } from "../api.js";

export default function MoviesPage() {
  const qc = useQueryClient();
  const { data: movies, isLoading } = useQuery({ queryKey: ["movies"], queryFn: getMovies });
  const [customer, setCustomer] = useState("");
  const [days, setDays] = useState(2);
  const [error, setError] = useState(null);

  const rent = useMutation({
    mutationFn: createRental,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["movies"] });
      qc.invalidateQueries({ queryKey: ["rentals"] });
      setError(null);
    },
    onError: e => setError(e.message)
  });

  function handleRent(movieId) {
    const parsed = NewRental.safeParse({ movieId, customer, days });
    if (!parsed.success) {
      setError(parsed.error.issues.map(i => i.message).join(", "));
      return;
    }
    rent.mutate(parsed.data);
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <section>
      <div className="form-row">
        <input placeholder="Customer name" value={customer} onChange={e => setCustomer(e.target.value)} />
        <input type="number" min="1" value={days} onChange={e => setDays(Number(e.target.value))} />
        <span className="hint">days</span>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {movies.map(m => (
          <div className="card" key={m.id}>
            <h3>{m.title}</h3>
            <div className="meta">{m.year} · {m.genre}</div>
            <div className="price">${m.pricePerDay.toFixed(2)} / day</div>
            <div className="stock">{m.available} in stock</div>
            <button disabled={m.available === 0 || rent.isPending} onClick={() => handleRent(m.id)}>
              {m.available === 0 ? "Unavailable" : "Rent"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
