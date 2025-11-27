import Link from "next/link";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Back to Home</Link>
      <h1 className="text-4xl font-bold mb-4">{slug.replace(/-/g, " ")}</h1>
      <p className="text-sm text-gray-500 mb-4">Category: {category}</p>
      <p className="text-gray-600">Nested virtual route with category and slug parameters</p>
    </div>
  );
}
