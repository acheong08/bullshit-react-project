import { Game } from "$entity/Games";
import { Report, ReportStatus } from "$entity/Report";

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
// The Report entity has eager: true on the game relationship,
// so it automatically loads the full game data with each report
export async function getAllReports(): Promise<Report[]> {
	try {
		const reports = await Report.find({
			order: { reportedAt: "DESC" }, // Most recent reports first
			relations: ["game", "game.media", "game.labels"], // Load game with its media and labels
		});
		return reports;
	} catch (error) {
		console.error("Error fetching reports:", error);
		return [];
	}
}

// Update a report's status (pending → reviewed → deleted)
export async function updateReportStatus(
	reportId: number,
	status: ReportStatus,
): Promise<boolean> {
	try {
		// Find the report by ID
		const report = await Report.findOne({ where: { id: reportId } });
		if (!report) return false;

		// Update the status
		report.status = status;
		await report.save(); // Save changes to database
		return true;
	} catch (error) {
		console.error(`Error updating report ${reportId}:`, error);
		return false;
	}
}

// Update a game's details (name, description, and first image)
export async function updateGame(
	gameId: number,
	updates: { name?: string; description?: string; imageUri?: string },
): Promise<boolean> {
	try {
		// Find the game with its media relation
		const game = await Game.findOne({
			relations: ["media"],
			where: { id: gameId },
		});
		if (!game) return false;

		// Update basic text fields
		if (updates.name !== undefined) game.name = updates.name;
		if (updates.description !== undefined)
			game.description = updates.description;

		// Update the first media item's URI if an image URL is provided
		// This assumes the first media item is the main/hero image
		if (updates.imageUri && game.media && game.media.length > 0) {
			game.media[0].uri = updates.imageUri;
			await game.media[0].save(); // Save the media item
		}

		// Save the game changes
		await game.save();
		return true;
	} catch (error) {
		console.error(`Error updating game ${gameId}:`, error);
		return false;
	}
}

// Delete a game from the database
// This also marks all reports for this game as deleted
export async function deleteGame(gameId: number): Promise<boolean> {
	try {
		const game = await Game.findOne({ where: { id: gameId } });
		if (!game) return false;

		// Mark all reports for this game as deleted before removing the game
		await Report.update(
			{ game: { id: gameId } },
			{ status: ReportStatus.Deleted },
		);

		// Remove the game from database
		// Note: This will also remove related media and label associations
		// due to cascade settings (if configured)
		await game.remove();
		return true;
	} catch (error) {
		console.error(`Error deleting game ${gameId}:`, error);
		return false;
	}
}
