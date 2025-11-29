"use server";

import { getWishlist } from "./wishlist";
import { getGameById } from "$lib/db";
import type { Game } from "$entity/Games";

export async function getWishlistGames(): Promise<Game[]> {
    const gameIds = getWishlist();
    console.log("Server Action - gameIds:", gameIds);
    
    const gamesData = await Promise.all(
        gameIds.map((id) => getGameById(Number(id)))
    );
    
    const games = gamesData.filter((game): game is Game => game !== null);
    console.log("Server Action - loaded games:", games);
    return games;
}