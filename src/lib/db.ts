import { Game } from "$entity/Games";
import { getAllreports } from "$lib/db";
import { AdminReportsClient } from "./reports-client";

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

export async function AdminReportsPage(){
  const reports = await getAllreports();

}
