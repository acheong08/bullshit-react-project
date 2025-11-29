"use client";

import { useEffect, useState } from "react";
import WishListGameCard from "$components/gameCards/wish-list-game-card";
import { removeFromWishlist, getWishlist } from "$utils/wishlist";
import { LabelType } from "$entity/Games";
import type { Game } from "$entity/Games";

export default function WishListPageClient() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    const loadWishlist = async () => {
        console.log("loadWishlist called");
        setLoading(true);
        const gameIds = getWishlist();
        console.log("GameIds from localStorage:", gameIds);
        
        const gamesData = await Promise.all(
            gameIds.map((id) => 
                fetch(`/api/games/${id}`)
                    .then(res => res.json())
                    .catch(err => {
                        console.error(`Failed to fetch game ${id}:`, err);
                        return null;
                    })
            )
        );
        const filteredGames = gamesData.filter((game): game is Game => game !== null);
        console.log("Loaded games:", filteredGames);
        setGames(filteredGames);
        setLoading(false);
    };

    useEffect(() => {
        loadWishlist();

        const handleWishlistUpdate = () => {
            console.log("wishlistUpdated event received");
            loadWishlist();
        };

        window.addEventListener("wishlistUpdated", handleWishlistUpdate);
        return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    }, []);

    const handleRemove = (gameId: string) => {
        console.log("Remove clicked for gameId:", gameId);
        removeFromWishlist(gameId);
        setGames((prev) => prev.filter((game) => game.id !== Number(gameId)));
    };

    if (loading) return <p>Loading wishlist...</p>;

    if (games.length === 0) return <p>No games in your wishlist yet!</p>;

    return (
        <>
            {games.map((game) => (
                <WishListGameCard
                    key={game.id}
                    image={game.media?.[0]?.uri || "/placeholder.jpg"}
                    title={game.name}
                    rating={4.5}
                    reviews="11.7K"
                    tags={
                        game.labels
                            ?.filter((l) => l.type === LabelType.Accessibility)
                            .map((l) => l.name) || []
                    }
                    downloads="1M+"
                    ageImage="/placeholder.jpg"
                    ageRating={
                        game.labels
                            ?.filter((l) => l.type === LabelType.IndustryRating)
                            .pop()?.name || "No rating"
                    }
                    gameId={String(game.id)}
                    remove={() => handleRemove(String(game.id))}
                />
            ))}
        </>
    );
}