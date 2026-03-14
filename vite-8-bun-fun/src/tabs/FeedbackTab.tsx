import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { getFeedbacks, addFeedback, getProducts } from "../store";

export default function FeedbackTab() {
  const queryClient = useQueryClient();

  const { data: feedbacks = [] } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: getFeedbacks,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const mutation = useMutation({
    mutationFn: (f: { productId: string; author: string; comment: string; rating: number }) =>
      Promise.resolve(addFeedback(f)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] }),
  });

  const form = useForm({
    defaultValues: { productId: "", author: "", comment: "", rating: 5 },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
      form.reset();
    },
  });

  const getProductName = (id: string) => products.find((p) => p.id === id)?.name ?? "Unknown";

  const renderStars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div>
      <h2>Product Feedback</h2>
      <div className="card">
        <h2>Add Feedback</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Product</label>
              <form.Field name="productId">
                {(field) => (
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </form.Field>
            </div>
            <div className="form-group">
              <label>Author</label>
              <form.Field name="author">
                {(field) => (
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>
          </div>
          <div className="form-group">
            <label>Rating</label>
            <form.Field name="rating">
              {(field) => (
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              )}
            </form.Field>
          </div>
          <div className="form-group">
            <label>Comment</label>
            <form.Field name="comment">
              {(field) => (
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>
          <button type="submit" className="btn-primary">
            Submit Feedback
          </button>
        </form>
      </div>
      {feedbacks.map((f) => (
        <div key={f.id} className="feedback-item">
          <div className="header">
            <span className="author">{f.author}</span>
            <span className="rating stars">{renderStars(f.rating)}</span>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: 4 }}>
            on {getProductName(f.productId)}
          </div>
          <div>{f.comment}</div>
        </div>
      ))}
    </div>
  );
}
