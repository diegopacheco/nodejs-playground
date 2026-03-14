export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
}

export interface Feedback {
  id: string;
  productId: string;
  author: string;
  comment: string;
  rating: number;
}

let products: Product[] = [
  { id: "1", name: "Laptop Pro", price: 1299.99, category: "Electronics", rating: 4.5, stock: 50 },
  { id: "2", name: "Wireless Mouse", price: 29.99, category: "Electronics", rating: 4.2, stock: 200 },
  { id: "3", name: "Standing Desk", price: 499.99, category: "Furniture", rating: 4.8, stock: 30 },
  { id: "4", name: "Mechanical Keyboard", price: 149.99, category: "Electronics", rating: 4.7, stock: 100 },
  { id: "5", name: "Monitor 4K", price: 599.99, category: "Electronics", rating: 4.6, stock: 75 },
];

let feedbacks: Feedback[] = [
  { id: "1", productId: "1", author: "Alice", comment: "Great laptop, very fast!", rating: 5 },
  { id: "2", productId: "3", author: "Bob", comment: "Best desk I ever had.", rating: 5 },
  { id: "3", productId: "4", author: "Charlie", comment: "Keys feel amazing.", rating: 4 },
];

let nextProductId = 6;
let nextFeedbackId = 4;

export function getProducts(): Product[] {
  return [...products];
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function addProduct(p: Omit<Product, "id">): Product {
  const product: Product = { ...p, id: String(nextProductId++) };
  products.push(product);
  return product;
}

export function updateProduct(id: string, data: Partial<Omit<Product, "id">>): Product | undefined {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx]!, ...data };
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const len = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < len;
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export function getTop3Products(): Product[] {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
}

export function getProductReport() {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  return { totalProducts, totalValue, avgPrice, avgRating, byCategory };
}

export function getFeedbacks(): Feedback[] {
  return [...feedbacks];
}

export function addFeedback(f: Omit<Feedback, "id">): Feedback {
  const feedback: Feedback = { ...f, id: String(nextFeedbackId++) };
  feedbacks.push(feedback);
  return feedback;
}
