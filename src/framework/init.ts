import { seedAdminUser, seedGames, seedReports } from "$utils/seed";
import { AppDataSource } from "../data-source";

/**
 * Initialize database and run seeding operations
 * This is called at module-level in entry.rsc.tsx (runs once at server startup)
 */
export async function initialize(): Promise<void> {
	if (!AppDataSource.isInitialized) {
		try {
			console.log("[Init] Initializing database connection...");
			await AppDataSource.initialize();
			console.log("[Init] Database initialized");
		} catch (error) {
			console.error("[Init] Database initialization failed:", error);
			throw error;
		}
	}

	try {
		console.log("[Init] Running database seed operations...");
		await seedAdminUser();
		await seedGames();
    await seedReports();
		console.log("[Init] Seed operations complete");
	} catch (error) {
		console.error("[Init] Seed operations failed:", error);
		// Don't throw - we don't want to crash the server if seeding fails
	}
}

// NOTE: Do we want to await this? Slower server startup but makes sure we don't have race conditions
await initialize();
