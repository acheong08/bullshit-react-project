import { instanceToPlain } from "class-transformer";
import WishListGameCard from "$components/gameCards/wish-list-game-card";
import type { Game } from "$entity/Games";
import { LabelType, MediaType } from "$entity/Games";
import { getWishlistByUserId } from "$lib/db";
import { getCurrentUser } from "$utils/auth";
import { getRequest } from "$utils/request-context";

export async function WishListPageClient() {
	let games: Game[] = [];
	const user = getCurrentUser(getRequest());

	if (user !== null) {
		// User is logged in - fetch from server
		const result = await getWishlistByUserId(user.userId);

		games = instanceToPlain(result) as Game[];
	}

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
					/>
				);
			})}
		</>
	);
}
