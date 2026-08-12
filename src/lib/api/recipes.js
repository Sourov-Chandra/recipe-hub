import { serverFetch, serverMutation } from "../core/server";


export async function getRecipes(params = {}) {
  return serverFetch("/recipes", params);
}


export async function addRecipe(recipeData) {
  return serverMutation("/recipes", "POST", recipeData);
}

export async function deleteRecipe(id) {
  return serverMutation(`/recipes/${id}`, "DELETE");
}

