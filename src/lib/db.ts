import { IsNull, Not } from "typeorm";
import { Game, Label, LabelType } from "$entity/Games";
import { Report, type ReportStatus } from "$entity/Report";
import { Review } from "$entity/Review";
import type { User } from "$entity/User";
import { Wishlist } from "$entity/Wishlist";

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

// Fetch all reports from the database
export async function getAllReports(): Promise<Report[]> {
	try {
		const reports = await Report.find({
			order: { reportedAt: "DESC" },
			relations: ["game", "game.media", "game.labels"],
		});
		return reports;
	} catch (error) {
		console.error("Error fetching reports:", error);
		return [];
	}
}

// Update a report's status
export async function updateReportStatus(
	reportId: number,
	status: ReportStatus,
): Promise<boolean> {
	try {
		const report = await Report.findOne({ where: { id: reportId } });
		if (!report) return false;

		report.status = status;
		await report.save();
		return true;
	} catch (error) {
		console.error(`Error updating report ${reportId}:`, error);
		return false;
	}
}

// Update a game's details
export async function updateGame(
	gameId: number,
	updates: { name?: string; description?: string; imageUri?: string },
): Promise<boolean> {
	try {
		const game = await Game.findOne({
			relations: ["media"],
			where: { id: gameId },
		});
		if (!game) return false;

		if (updates.name !== undefined) game.name = updates.name;
		if (updates.description !== undefined)
			game.description = updates.description;

		if (updates.imageUri && game.media && game.media.length > 0) {
			game.media[0].uri = updates.imageUri;
			await game.media[0].save();
		}

		await game.save();
		return true;
	} catch (error) {
		console.error(`Error updating game ${gameId}:`, error);
		return false;
	}
}

// Delete a game from the database
export async function deleteGame(gameId: number): Promise<boolean> {
	try {
		const game = await Game.findOne({ where: { id: gameId } });
		if (!game) return false;

		await Report.delete({ game: { id: gameId } });

		await game.remove();
		return true;
	} catch (error) {
		console.log(`Error deleting game ${gameId}:`, error);
		return false;
	}
}

// Search/filter functions
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
				comment: Not(IsNull()),
				game: { id: gameId },
			},
		});
		return reviews;
	} catch (error) {
		console.error(`Error fetching reviews for game ${gameId}:`, error);
		return [];
	}
}

export async function searchGames(
	filterOptions: string[],
	sortOption: string,
	query: string,
): Promise<Game[]> {
	const queryBuilder = Game.createQueryBuilder("game")
		.leftJoinAndSelect("game.labels", "label")
		.leftJoinAndSelect("game.media", "media");

	if (filterOptions.length > 0) {
		queryBuilder.where("label.name IN (:...filterOptions)", {
			filterOptions,
		});
	}

	if (query && query.trim() !== "") {
		queryBuilder.andWhere(
			"game.name ILIKE :query OR game.description ILIKE :query",
			{
				query: `%${query}%`,
			},
		);
	}

	switch (sortOption) {
		case "Alphabetical":
			queryBuilder.addOrderBy("game.name", "ASC");
			break;
		default:
			queryBuilder.addOrderBy("game.id", "DESC");
			break;
	}

	return await queryBuilder.getMany();
}

// Wishlist database operations

/**
 * Get all games in a user's wishlist
 * @param userId - The user's ID
 * @returns Array of games in the wishlist
 */
export async function getWishlistByUserId(userId: number): Promise<Game[]> {
	try {
		const wishlistItems = await Wishlist.find({
			order: { addedAt: "DESC" },
			relations: ["game", "game.labels", "game.media"],
			where: { user: { id: userId } },
		});
		return wishlistItems.map((item) => item.game);
	} catch (error) {
		console.error(`Error fetching wishlist for user ${userId}:`, error);
		return [];
	}
}

/**
 * Get all game IDs in a user's wishlist
 * @param userId - The user's ID
 * @returns Array of game IDs in the wishlist
 */
export async function getWishlistGameIds(userId: number): Promise<number[]> {
	try {
		const wishlistItems = await Wishlist.find({
			relations: ["game"],
			where: { user: { id: userId } },
		});
		return wishlistItems.map((item) => item.game.id);
	} catch (error) {
		console.error(
			`Error fetching wishlist game IDs for user ${userId}:`,
			error,
		);
		return [];
	}
}

/**
 * Add a game to a user's wishlist
 * @param userId - The user's ID
 * @param gameId - The game's ID
 * @returns True if added successfully, false otherwise
 */
export async function addGameToWishlist(
	userId: number,
	gameId: number,
): Promise<boolean> {
	try {
		// Check if already in wishlist
		const existing = await Wishlist.findOne({
			where: { game: { id: gameId }, user: { id: userId } },
		});

		if (existing) {
			return true; // Already in wishlist
		}

		const wishlistItem = new Wishlist();
		wishlistItem.user = { id: userId } as User;
		wishlistItem.game = { id: gameId } as Game;
		await wishlistItem.save();
		return true;
	} catch (error) {
		console.error(
			`Error adding game ${gameId} to wishlist for user ${userId}:`,
			error,
		);
		return false;
	}
}

/**
 * Remove a game from a user's wishlist
 * @param userId - The user's ID
 * @param gameId - The game's ID
 * @returns True if removed successfully, false otherwise
 */
export async function removeGameFromWishlist(
	userId: number,
	gameId: number,
): Promise<boolean> {
	try {
		const wishlistItem = await Wishlist.findOne({
			where: { game: { id: gameId }, user: { id: userId } },
		});

		if (!wishlistItem) {
			return true; // Not in wishlist, nothing to remove
		}

		await wishlistItem.remove();
		return true;
	} catch (error) {
		console.error(
			`Error removing game ${gameId} from wishlist for user ${userId}:`,
			error,
		);
		return false;
	}
}

/**
 * Check if a game is in a user's wishlist
 * @param userId - The user's ID
 * @param gameId - The game's ID
 * @returns True if game is in wishlist, false otherwise
 */
export async function isGameInWishlist(
	userId: number,
	gameId: number,
): Promise<boolean> {
	try {
		const wishlistItem = await Wishlist.findOne({
			where: { game: { id: gameId }, user: { id: userId } },
		});
		return wishlistItem !== null;
	} catch (error) {
		console.error(
			`Error checking wishlist for user ${userId}, game ${gameId}:`,
			error,
		);
		return false;
	}
}
