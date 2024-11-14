"use server"

import { cookies } from "next/headers";
import { decrypt, encrypt, Session } from "./session";

export async function updateSessionCokies(newAccessToken: string, newRefreshToken: string) {
    "use server";
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