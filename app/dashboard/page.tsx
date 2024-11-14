import { checkProtected } from "@/actions/auth";
import React from "react";

export default async function ProfilePage() {
  const res = await checkProtected();
  return <div>{JSON.stringify(res)}</div>;
}
