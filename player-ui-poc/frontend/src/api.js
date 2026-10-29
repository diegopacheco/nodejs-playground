async function request(path, options) {
  const res = await fetch(`/api${path}`, options);
  if (!res.ok) throw new Error(`${options?.method || "GET"} ${path} failed with ${res.status}`);
  return res.json();
}

export const listFlows = () => request("/flows");

export const getFlow = (id) => request(`/flows/${id}`);

export const listSubmissions = () => request("/submissions");

export const saveSubmission = (submission) =>
  request("/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });
