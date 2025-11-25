import { Game } from "$entity/Games";

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
