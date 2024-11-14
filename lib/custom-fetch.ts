// import { refreshToken } from "@/actions/auth";
import { refreshToken } from "@/actions/auth";
import { getSession } from "./session";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}
// let response = null
export const AuthFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  const session = await getSession();

  console.log("session", session);

  //add authorization header
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };
  let response = await fetch(url, options);
  console.log(
    "================STATUS====================",
    response.status,

    "===================================="
  );

  if (response.status === 401) {
    console.log("expire");
    // //refresh token
    if (!session?.refreshToken) throw new Error("No refresh token");

    const newRefreshToken = await refreshToken(session.refreshToken);

    const newSession = await getSession();

    if (newSession) {
      options.headers.Authorization = `Bearer ${newRefreshToken}`;
      response = await fetch(url, options);
    }
  }

  return response;
};
