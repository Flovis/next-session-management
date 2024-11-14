"use server";

import { AuthFetch } from "@/lib/custom-fetch";
import { loginSchema } from "@/lib/schemas";
import { createSession} from "@/lib/session";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";


export type Session = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

// Fonction pour créer ou mettre à jour la session


export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Email ou mot de passe invalide" };
  }
  console.log(values);
  //   return { success: "Connexion reussie" };

  let response = null;

  try {
    response = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });
    if (response.status === 403) {
      return { error: "Email ou mot de passe invalide" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Une erreur est survenue" };
  }
  if (response.ok) {
    const result = await response.json();
    console.log("result", result);
    //TODO create the session

    await createSession({
      id: result.id,
      name: result.name,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      role: result.role,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    // Redirection après la création de la session
    // revalidatePath("/");
    return redirect("/dashboard");
  }
};
export const checkProtected = async () => {
  const response = await AuthFetch(
    `${process.env.BACKEND_API_URL}/auth/protected`
  );

  // if (!response.ok) return { error: "error" };
  const result = await response.json();
  return result;
};

export const refreshToken = async (oldRefreshToken: string) => {
  console.log("refresh token", oldRefreshToken);
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oldRefreshToken.trim()}`,
        },
        // body: JSON.stringify({ refreshToken: oldRefreshToken }),
      }
    );
    if (!response.ok)
      throw new Error("Une erreur est survenue au refresh du Token");
    const data = await response.json();

    const { accessToken, refreshToken } = data;
    const updateRes = await fetch(
        `${process.env.APP_DOMAIN}/api/auth/update-cookies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
          }),
        }
      );
  
      if (!updateRes.ok)
        throw new Error(
          "Une erreur est survenue lors sw de la mise à jour du token"
        );

    return refreshToken

    
  } catch (error) {
    console.log("error on refresh", error);
  }
};
