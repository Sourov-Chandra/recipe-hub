import { serverFetch } from "../core/server";

export function getPurchases(userEmail) {
  return serverFetch("/payments", { userEmail });
}
