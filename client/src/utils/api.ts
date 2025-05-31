const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7170/api";

export async function post<T>(
  endpoint: string,
  data: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`POST ${endpoint} failed: ${error}`);
  }

  // only parse JSON if there's content in the response
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return {} as T; // return empty object if no JSON content
}

export async function get<T>(endpoint: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GET ${endpoint} failed: ${error}`);
  }

  return res.json();
}

export async function del<T = void>(
  endpoint: string,
  token?: string
): Promise<T> {
  console.log("DELETE from:", `${API_BASE_URL}${endpoint}`);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`DELETE ${endpoint} failed: ${error}`);
  }

  return res.status === 204 ? ({} as T) : res.json();
}

export { API_BASE_URL };
