import { updateSessionCokies } from "@/lib/set-cokies";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("===============IN API ROUTE=================");
  console.log(body);

  const { accessToken, refreshToken } = body;

  if (!accessToken || !refreshToken) {
    return new Response("Provide tokens", { status: 401 });
  }

  await updateSessionCokies(accessToken, refreshToken);

  return new Response("OK", { status: 200 });
}
