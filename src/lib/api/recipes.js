import { serverFetch } from "../core/server";


export async function getRecipes() {
  return serverFetch("/recipes");
}


