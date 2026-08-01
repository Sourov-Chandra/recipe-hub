const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function serverFetch(path, query = {}, options = {}) {
  let url = `${BASE_URL}${path}`;

  if (query && Object.keys(query).length > 0) {
    const queryString = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((val) => queryString.append(key, val));
        } else {
          queryString.append(key, value);
        }
      }
    });

    const qs = queryString.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
}


