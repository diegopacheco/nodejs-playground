import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRentals, returnRental } from "../api.js";

export default function RentalsPage() {
  const qc = useQueryClient();
  const { data: rentals, isLoading } = useQuery({ queryKey: ["rentals"], queryFn: getRentals });
  const ret = useMutation({
    mutationFn: returnRental,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rentals"] });
      qc.invalidateQueries({ queryKey: ["movies"] });
    }
  });

  if (isLoading) return <p>Loading...</p>;
  if (!rentals.length) return <p>No active rentals.</p>;

  return (
    <table className="rentals">
      <thead>
        <tr><th>Movie</th><th>Customer</th><th>Days</th><th>Rented at</th><th></th></tr>
      </thead>
      <tbody>
        {rentals.map(r => (
          <tr key={r.id}>
            <td>{r.movie?.title ?? r.movieId}</td>
            <td>{r.customer}</td>
            <td>{r.days}</td>
            <td>{new Date(r.rentedAt).toLocaleString()}</td>
            <td><button onClick={() => ret.mutate(r.id)} disabled={ret.isPending}>Return</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
