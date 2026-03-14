import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "@tanstack/react-form";
import type { Product } from "../store";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../store";

const columnHelper = createColumnHelper<Product>();

export default function CrudTab() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const addMutation = useMutation({
    mutationFn: (p: Omit<Product, "id">) => Promise.resolve(addProduct(p)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Product, "id">> }) =>
      Promise.resolve(updateProduct(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => Promise.resolve(deleteProduct(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

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
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="actions">
          <button className="btn-secondary" onClick={() => setEditingId(row.original.id)}>
            Edit
          </button>
          <button className="btn-danger" onClick={() => deleteMutation.mutate(row.original.id)}>
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2>Product CRUD</h2>
      {editingId ? (
        <EditForm
          product={products.find((p) => p.id === editingId)!}
          onSave={(data) => updateMutation.mutate({ id: editingId, data })}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <AddForm onAdd={(p) => addMutation.mutate(p)} />
      )}
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
    </div>
  );
}

function AddForm({ onAdd }: { onAdd: (p: Omit<Product, "id">) => void }) {
  const form = useForm({
    defaultValues: { name: "", price: 0, category: "", rating: 0, stock: 0 },
    onSubmit: ({ value }) => {
      onAdd(value);
      form.reset();
    },
  });

  return (
    <div className="card">
      <h2>Add Product</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <form.Field name="name">
              {(field) => (
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>
          <div className="form-group">
            <label>Category</label>
            <form.Field name="category">
              {(field) => (
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <form.Field name="price">
              {(field) => (
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              )}
            </form.Field>
          </div>
          <div className="form-group">
            <label>Rating</label>
            <form.Field name="rating">
              {(field) => (
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              )}
            </form.Field>
          </div>
        </div>
        <div className="form-group">
          <label>Stock</label>
          <form.Field name="stock">
            {(field) => (
              <input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            )}
          </form.Field>
        </div>
        <button type="submit" className="btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
}

function EditForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (data: Partial<Omit<Product, "id">>) => void;
  onCancel: () => void;
}) {
  const form = useForm({
    defaultValues: {
      name: product.name,
      price: product.price,
      category: product.category,
      rating: product.rating,
      stock: product.stock,
    },
    onSubmit: ({ value }) => onSave(value),
  });

  return (
    <div className="card">
      <h2>Edit Product #{product.id}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <form.Field name="name">
              {(field) => (
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>
          <div className="form-group">
            <label>Category</label>
            <form.Field name="category">
              {(field) => (
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <form.Field name="price">
              {(field) => (
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              )}
            </form.Field>
          </div>
          <div className="form-group">
            <label>Rating</label>
            <form.Field name="rating">
              {(field) => (
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              )}
            </form.Field>
          </div>
        </div>
        <div className="form-group">
          <label>Stock</label>
          <form.Field name="stock">
            {(field) => (
              <input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            )}
          </form.Field>
        </div>
        <div className="actions">
          <button type="submit" className="btn-primary">Save</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
