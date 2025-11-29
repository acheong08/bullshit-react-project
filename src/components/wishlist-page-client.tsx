"use client";

import { useCallback, useEffect, useState } from "react";
import WishListGameCard from "$components/gameCards/wish-list-game-card";
import type { Game } from "$entity/Games";
import { LabelType, MediaType } from "$entity/Games";
import { getLocalWishlist, removeFromLocalWishlist } from "$utils/wishlist";
import { getWishlistAction, removeFromWishlistAction } from "../action";

type WishListPageClientProps = {
	isLoggedIn?: boolean;
};

export default function WishListPageClient({
	isLoggedIn = false,
}: WishListPageClientProps) {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);

	const loadFromLocalStorage = useCallback(async () => {
		const gameIds = getLocalWishlist();
		console.log("GameIds from localStorage:", gameIds);

		if (gameIds.length === 0) {
			setGames([]);
			return;
		}

		const gamesData = await Promise.all(
			gameIds.map((id) =>
				fetch(`/api/games/${id}`)
					.then((res) => res.json())
					.catch((err) => {
						console.error(`Failed to fetch game ${id}:`, err);
						return null;
					}),
			),
		);
		const filteredGames = gamesData.filter(
			(game): game is Game => game !== null,
		);
		console.log("Loaded games from localStorage:", filteredGames);
		setGames(filteredGames);
	}, []);

	const loadWishlist = useCallback(async () => {
		console.log("loadWishlist called, isLoggedIn:", isLoggedIn);
		setLoading(true);

		if (isLoggedIn) {
			// User is logged in - fetch from server
			const result = await getWishlistAction();

			if (result.success && result.games) {
				console.log("Loaded games from server:", result.games);
				setGames(result.games);
			} else {
				console.error("Failed to fetch wishlist from server:", result.error);
				// Fall back to localStorage
				await loadFromLocalStorage();
			}
		} else {
			// Guest user - load from localStorage
			await loadFromLocalStorage();
		}

		setLoading(false);
	}, [isLoggedIn, loadFromLocalStorage]);

	useEffect(() => {
		void loadWishlist();

		const handleWishlistUpdate = () => {
			console.log("wishlistUpdated event received");
			void loadWishlist();
		};

		window.addEventListener("wishlistUpdated", handleWishlistUpdate);
		return () =>
			window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
	}, [loadWishlist]);

	const handleRemove = async (gameId: string) => {
		console.log("Remove clicked for gameId:", gameId);

		if (isLoggedIn) {
			// Remove from server
			const result = await removeFromWishlistAction(Number(gameId));

			if (!result.success) {
				console.error("Failed to remove from server wishlist:", result.error);
			}
		}

		// Always remove from localStorage (for consistency)
		removeFromLocalWishlist(gameId);

		// Update local state
		setGames((prev) => prev.filter((game) => game.id !== Number(gameId)));
	};

	if (loading) return <p>Loading wishlist...</p>;

	if (games.length === 0) return <p>No games in your wishlist yet!</p>;

	return (
		<>
			{games.map((game) => {
				// Get icon image, falling back to preview image, excluding videos
				const iconMedia = game.media?.find((m) => m.type === MediaType.Icon);
				const previewMedia = game.media?.find(
					(m) => m.type === MediaType.PreviewImg,
				);
				const gameImage =
					iconMedia?.uri || previewMedia?.uri || "/placeholder.jpg";

				return (
					<WishListGameCard
						key={game.id}
						image={gameImage}
						title={game.name}
						rating={4.5}
						reviews="11.7K"
						tags={
							game.labels
								?.filter((l) => l.type === LabelType.Accessibility)
								.map((l) => l.name) || []
						}
						downloads="1M+"
						ageRating={
							game.labels
								?.filter((l) => l.type === LabelType.IndustryRating)
								.pop()?.name || "No rating"
						}
						gameId={String(game.id)}
						remove={() => handleRemove(String(game.id))}
					/>
				);
			})}
		</>
	);
}
