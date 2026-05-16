const REGISTRY_URL = process.env.APICURIO_URL || "http://localhost:8080";
const GROUP = "movie-rental";

async function waitForRegistry(retries = 60) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(`${REGISTRY_URL}/apis/registry/v3/system/info`);
      if (r.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error("Apicurio Registry not reachable at " + REGISTRY_URL);
}

export async function registerSchema(artifactId, schema) {
  const body = {
    artifactId,
    artifactType: "JSON",
    firstVersion: {
      version: "1.0.0",
      content: {
        content: JSON.stringify(schema),
        contentType: "application/json"
      }
    }
  };
  const res = await fetch(
    `${REGISTRY_URL}/apis/registry/v3/groups/${GROUP}/artifacts?ifExists=FIND_OR_CREATE_VERSION`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to register ${artifactId}: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchSchema(artifactId) {
  const res = await fetch(
    `${REGISTRY_URL}/apis/registry/v3/groups/${GROUP}/artifacts/${artifactId}/versions/branch=latest/content`
  );
  if (!res.ok) throw new Error(`Failed to fetch ${artifactId}: ${res.status}`);
  return res.json();
}

export async function bootstrap(schemas) {
  await waitForRegistry();
  const results = {};
  for (const [name, schema] of Object.entries(schemas)) {
    results[name] = await registerSchema(name, schema);
    console.log(`[apicurio] registered ${GROUP}/${name}`);
  }
  return results;
}

export { GROUP, REGISTRY_URL };
