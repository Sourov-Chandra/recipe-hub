import { serverFetch, serverMutation } from "../core/server";

export function getAdminUsers() {
  return serverFetch("/admin/users");
}

export function updateUserStatus(id, isBlocked) {
  return serverMutation(`/admin/users/${id}/status`, "PATCH", { isBlocked });
}

export function getAdminRecipes() {
  return serverFetch("/admin/recipes");
}

export function updateAdminRecipe(id, data) {
  return serverMutation(`/admin/recipes/${id}`, "PATCH", data);
}

export function featureAdminRecipe(id, isFeatured) {
  return serverMutation(`/admin/recipes/${id}/feature`, "PATCH", {
    isFeatured,
  });
}

export function deleteAdminRecipe(id) {
  return serverMutation(`/admin/recipes/${id}`, "DELETE");
}

export function getAdminReports() {
  return serverFetch("/admin/reports");
}

export function dismissAdminReport(id) {
  return serverMutation(`/admin/reports/${id}/dismiss`, "PATCH");
}

export function deleteReportedRecipe(reportId) {
  return serverMutation(`/admin/reports/${reportId}/recipe`, "DELETE");
}

export function getAdminTransactions() {
  return serverFetch("/admin/transactions");
}
