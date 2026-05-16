import { useQuery } from "@tanstack/react-query";
import { getOpenApi } from "../api.js";

export default function SchemaPage() {
  const { data, isLoading } = useQuery({ queryKey: ["openapi"], queryFn: getOpenApi });
  if (isLoading) return <p>Loading...</p>;
  return (
    <section>
      <p className="hint">OpenAPI document built with @apicurio/data-models, validated server-side. Schemas mirrored to Apicurio Registry.</p>
      <pre className="json">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
