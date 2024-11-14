import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
// import { SessionPayload } from '@/app/lib/definitions'

export type Session = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresAt?: Date;
};

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
  }
}

export async function createSession(payload: Session) {
  console.log("payload", payload);
  // Set the session expiration date
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ ...payload, expiresAt });

  console.log("session", session);

  // Set the session cookie with the encrypted token
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (err) {
    console.error("Failed to verify the session", err);
    //   redirect("/auth/sigin");
  }
}

export async function updateSession(newAccessToken: string, newRefreshToken: string) {
    const currentSessionToken = (await cookies()).get('session')?.value;
    if (!currentSessionToken) return null;

    // Décryptage de la session existante pour obtenir le payload
    const payload = await decrypt(currentSessionToken) as Session;
    if (!payload) return null;

    // Mise à jour du accessToken, refreshToken et expiration
    const updatedPayload = {
        ...payload,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Par exemple, 7 jours supplémentaires
    };

    // Réencodage du payload mis à jour dans un nouveau token chiffré
    const newSessionToken = await encrypt(updatedPayload);

    // Mise à jour du cookie avec le nouveau token et la nouvelle date d’expiration
    (await cookies()).set('session', newSessionToken, {
        httpOnly: true,
        secure: true,
        expires: updatedPayload.expiresAt, // Nouvelle date d'expiration
        sameSite: 'lax',
        path: '/'
    });
}