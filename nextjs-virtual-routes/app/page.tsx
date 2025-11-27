import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Virtual Routes</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-2xl font-semibold mb-2">Dynamic Routes</h2>
          <ul className="space-y-2">
            <li><Link href="/products/laptop" className="text-blue-600 hover:underline">Product: Laptop</Link></li>
            <li><Link href="/products/phone" className="text-blue-600 hover:underline">Product: Phone</Link></li>
            <li><Link href="/products/tablet" className="text-blue-600 hover:underline">Product: Tablet</Link></li>
          </ul>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-2xl font-semibold mb-2">Nested Dynamic Routes</h2>
          <ul className="space-y-2">
            <li><Link href="/blog/tech/nextjs-guide" className="text-blue-600 hover:underline">Blog: Tech / Next.js Guide</Link></li>
            <li><Link href="/blog/lifestyle/travel-tips" className="text-blue-600 hover:underline">Blog: Lifestyle / Travel Tips</Link></li>
          </ul>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-2xl font-semibold mb-2">Catch-all Routes</h2>
          <ul className="space-y-2">
            <li><Link href="/docs/getting-started" className="text-blue-600 hover:underline">Docs: Getting Started</Link></li>
            <li><Link href="/docs/api/reference/functions" className="text-blue-600 hover:underline">Docs: API Reference Functions</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
