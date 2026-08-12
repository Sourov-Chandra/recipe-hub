"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });
  return session?.user || null;
};

export const requireRole = async (role) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/login"); 
  }

  if (user.role !== role) {
    redirect("/unauthorized");
  }

  return user;
};
