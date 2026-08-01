import { serverFetch, serverMutation } from "../core/server";


export async function getRecipes() {
  return serverFetch("/recipes");
}


export async function addRecipe(recipeData) {
  return serverMutation("/recipes", "POST", recipeData);
}
