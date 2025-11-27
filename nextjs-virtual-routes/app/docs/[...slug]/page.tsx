import Link from "next/link";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join(" / ");

  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Back to Home</Link>
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-gray-600 mb-2">Catch-all route segments:</p>
      <div className="bg-gray-100 p-4 rounded">
        <code>{path}</code>
      </div>
      <p className="text-gray-600 mt-4">All path segments: {JSON.stringify(slug)}</p>
    </div>
  );
}
