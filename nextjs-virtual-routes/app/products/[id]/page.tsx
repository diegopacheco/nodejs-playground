import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Back to Home</Link>
      <h1 className="text-4xl font-bold mb-4">Product: {id}</h1>
      <p className="text-gray-600">Virtual route handling dynamic product ID: {id}</p>
    </div>
  );
}
