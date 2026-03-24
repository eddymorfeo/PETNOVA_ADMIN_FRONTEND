type RequestConfig = RequestInit & {
  auth?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno.");
}

export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { auth = false, headers, ...restConfig } = config;

  const resolvedHeaders = new Headers(headers ?? {});
  resolvedHeaders.set("Content-Type", "application/json");

  if (auth && typeof window !== "undefined") {
    const token = localStorage.getItem("pn_admin_access_token");

    if (token) {
      resolvedHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restConfig,
    headers: resolvedHeaders,
  });

  const responseJson = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseJson?.message || "Ocurrió un error al comunicarse con el servidor."
    );
  }

  return responseJson as T;
}