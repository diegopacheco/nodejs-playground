import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Product } from "../store";
import { searchProducts } from "../store";

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("category", { header: "Category" }),
  columnHelper.accessor("rating", { header: "Rating" }),
  columnHelper.accessor("stock", { header: "Stock" }),
];

export default function SearchTab() {
  const [query, setQuery] = useState("");

  const { data: results = [] } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  });

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2>Search Products</h2>
      <div className="search-box">
        <input
          placeholder="Search by name or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query.length === 0 ? (
        <div className="empty">Type something to search</div>
      ) : results.length === 0 ? (
        <div className="empty">No products found</div>
      ) : (
        <table>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
