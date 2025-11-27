import { IsNull, Not } from "typeorm";
import { Game, Label, LabelType } from "$entity/Games";
import { Review } from "$entity/Review";

export async function getGameById(gameId: number): Promise<Game | null> {
	try {
		const game = await Game.findOne({
			relations: ["labels", "media"],
			where: { id: gameId },
		});
		return game || null;
	} catch (error) {
		console.error(`Error fetching game with ID ${gameId}:`, error);
		return null;
	}
}

export async function getAllSortOptions(): Promise<string[]> {
	return ["Popularity", "Release Date", "Alphabetical", "User Rating"];
}

export async function getFilterMap(): Promise<Map<string, string[]>> {
	try {
		const enumEntries = Object.entries(LabelType).filter(
			([_, value]) => typeof value === "number",
		) as [string, number][];

		const filterMap = new Map<string, string[]>();
		for (const [categoryName, categoryId] of enumEntries) {
			const labels = await Label.find({
				where: { type: categoryId },
			});

			filterMap.set(
				categoryName,
				labels.map((label) => label.name as string),
			);
		}
		return filterMap;
	} catch (error) {
		console.error("Error fetching filter map:", error);
		return new Map<string, string[]>();
	}
}

export async function getReviewsByGameId(gameId: number): Promise<Review[]> {
	try {
		const reviews = await Review.find({
			order: { createdAt: "DESC" },
			relations: ["user"],
			where: {
				comment: Not(IsNull()), // Only get reviews with comments
				game: { id: gameId },
			},
		});
		return reviews;
	} catch (error) {
		console.error(`Error fetching reviews for game ${gameId}:`, error);
		return [];
	}
}
