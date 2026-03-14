import { useQuery } from "@tanstack/react-query";
import { getTop3Products } from "../store";

export default function Top3Tab() {
  const { data: top3 = [] } = useQuery({
    queryKey: ["top3"],
    queryFn: getTop3Products,
  });

  return (
    <div>
      <h2>Top 3 Products</h2>
      {top3.map((p, i) => (
        <div key={p.id} className="top-item">
          <span className="top-badge">{i + 1}</span>
          <div className="info">
            <div className="name">{p.name}</div>
            <div className="meta">
              {p.category} &middot; ${p.price.toFixed(2)} &middot; {p.stock} in stock
            </div>
          </div>
          <div className="rating-big">{p.rating}</div>
        </div>
      ))}
    </div>
  );
}
