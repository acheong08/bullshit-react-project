"use client";

import "../styles/wishlist.css";
import micIcon from "$tmpimg/darkmode-microphone.png";
import WishListGameCard from "$components/gameCards/wish-list-game-card";
import { getWishlist, removeFromWishlist } from "$utils/wishlist";
import { LabelType } from "$entity/Games";
import type { Game } from "$entity/Games";
import { useState } from "react";

export function WishListPage() {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);

	// Load games on mount (client-side only)
	if (loading && typeof window !== "undefined") {
		const gameIds = getWishlist();
		console.log("Client - gameIds:", gameIds);

		if (gameIds.length > 0) {
			// Fetch games from the API route
			Promise.all(
				gameIds.map((id) =>
					fetch(`/api/games/${id}`).then((res) => res.json())
				)
			)
				.then((data) => {
					const validGames = data.filter((game): game is Game => game && !game.error);
					setGames(validGames);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Failed to fetch games:", err);
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}

	if (loading) return <p>Loading wishlist...</p>;

	return (
		<div id="root">
			<main>
				<div className="back-button-container">
					<a href="/" className="clear-a-stylings back-button">
						↩
					</a>
					<p>Back to home page</p>
				</div>
				<div className="wishlist-bar">
					<div className="wishlist-row">
						<h1 className="wishlist-title">WISHLIST</h1>
						<button className="wishlist-dictate-btn" type="button">
							<img src={micIcon} alt="Microphone icon" className="icon" />
							<span>open games</span>
						</button>
					</div>
				</div>
				<div className="wish-list-game-card-gallery">
					{games.length === 0 ? (
						<p>No games in your wishlist yet!</p>
					) : (
						games.map((game) => (
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
								remove={() => removeFromWishlist(String(game.id))}
							/>
						))
					)}
				</div>
			</main>
		</div>
	);
}