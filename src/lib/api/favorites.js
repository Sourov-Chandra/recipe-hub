import { serverFetch, serverMutation } from "../core/server";

export function getFavorites(userEmail) {
  return serverFetch("/favorites", { userEmail });
}

export function toggleFavorite({ userEmail, userId, recipeId }) {
  return serverMutation("/favorites/toggle", "POST", {
    userEmail,
    userId,
    recipeId,
  });
}
