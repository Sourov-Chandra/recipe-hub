import { getUserToken } from "./session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export async function authHeader() {
  const token = await getUserToken();
  const header = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
  return header;
}

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
      ...(await authHeader()),
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

export async function serverMutation(
  path,
  method = "POST",
  body = null,
  options = {},
) {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
      ...options.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
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


