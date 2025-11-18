import { User } from "$entity/User";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Game, GameMedia, Label, LabelType, MediaType } from "$entity/Games";

interface GameData {
	url: string;
	title: string;
	image_url: string;
	platforms: string[];
	genres: string[];
	industry_rating: string;
	accessibility_features: Array<{ nested_categories: string[] }>;
}

/**
 * Seeds the database with an admin user if ADMIN_USERNAME and ADMIN_PASSWORD_HASH are set
 * This function is idempotent - safe to run multiple times
 */
export async function seedAdminUser(): Promise<void> {
	const adminUsername = process.env.ADMIN_USERNAME;
	const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

	// Skip if admin credentials not configured
	if (!adminUsername || !adminPasswordHash) {
		console.log(
			"[Seed] Skipping admin user creation - ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set",
		);
		return;
	}

	try {
		// Check if admin user already exists
		const existingAdmin = await User.findOne({
			where: { username: adminUsername },
		});

		if (existingAdmin) {
			console.log(`[Seed] Admin user '${adminUsername}' already exists`);
			return;
		}

		// Create admin user
		const admin = new User();
		admin.username = adminUsername;
		admin.passwordHash = adminPasswordHash;
		admin.email = process.env.ADMIN_EMAIL || `${adminUsername}@example.com`;

		await admin.save();

		console.log(`[Seed] ✓ Admin user '${adminUsername}' created successfully`);
	} catch (error) {
		console.error("[Seed] Failed to create admin user:", error);
		// Don't throw - we don't want to crash the server if seeding fails
	}
}

/**
 * Seeds the database with games from games.jsonl
 * This function is idempotent - safe to run multiple times
 */
export async function seedGames(): Promise<void> {
	try {
		// Check if games already exist
		const existingGamesCount = await Game.count();
		if (existingGamesCount > 0) {
			console.log(
				`[Seed] Skipping game import - ${existingGamesCount} games already exist`,
			);
			return;
		}

		console.log("[Seed] Starting game import from games.jsonl...");

		// Read the JSONL file
		const filePath = join(process.cwd(), "src", "assets", "games.jsonl");
		const fileContent = readFileSync(filePath, "utf-8");
		const lines = fileContent.trim().split("\n");

		// Cache for labels to avoid duplicates
		const labelCache = new Map<string, Label>();

		// Helper function to get or create a label with hierarchy
		const getOrCreateLabel = async (
			type: LabelType,
			path: string[],
		): Promise<Label | null> => {
			// Build cache key from the full path
			const cacheKey = `${type}-${path.join(">")}`;

			const cached = labelCache.get(cacheKey);
			if (cached) {
				return cached;
			}

			let parent: Label | null = null;

			// Process each level of the hierarchy
			for (let i = 0; i < path.length; i++) {
				const name = path[i];
				const partialPath = path.slice(0, i + 1);
				const partialKey = `${type}-${partialPath.join(">")}`;

				const cachedPartial = labelCache.get(partialKey);
				if (cachedPartial) {
					parent = cachedPartial;
					continue;
				}

				// Try to find existing label
				let label = await Label.findOne({
					relations: ["parent"],
					where: { name, type },
				});

				// Create if doesn't exist
				if (!label) {
					label = new Label();
					label.type = type;
					label.name = name;
					label.description = "";
					label.parent = parent;
					await label.save();
				}

				labelCache.set(partialKey, label);
				parent = label;
			}

			return parent;
		};

		// Helper function to get or create a simple label (for genres and platforms)
		const getOrCreateSimpleLabel = async (
			type: LabelType,
			name: string,
		): Promise<Label> => {
			const cacheKey = `${type}-${name}`;

			const cached = labelCache.get(cacheKey);
			if (cached) {
				return cached;
			}

			let label = await Label.findOne({ where: { name, type } });

			if (!label) {
				label = new Label();
				label.type = type;
				label.name = name;
				label.description = "";
				label.parent = null;
				await label.save();
			}

			labelCache.set(cacheKey, label);
			return label;
		};

		let importedCount = 0;

		// Process each line
		for (const line of lines) {
			if (!line.trim()) continue;

			const gameData: GameData = JSON.parse(line);

			// Create game entity
			const game = new Game();
			game.name = gameData.title;
			game.description = ""; // No description in source data
			game.url = gameData.url;
			game.industryRating = gameData.industry_rating || "";
			game.labels = [];
			game.media = [];

			// Add game image as media
			if (gameData.image_url) {
				const media = new GameMedia();
				media.type = MediaType.Icon;
				media.uri = gameData.image_url;
				await media.save();
				game.media.push(media);
			}

			// Add genre labels
			for (const genre of gameData.genres) {
				const label = await getOrCreateSimpleLabel(LabelType.Genre, genre);
				game.labels.push(label);
			}

			// Add platform labels
			for (const platform of gameData.platforms) {
				const label = await getOrCreateSimpleLabel(
					LabelType.Platform,
					platform,
				);
				game.labels.push(label);
			}

			// Add accessibility feature labels (hierarchical)
			for (const feature of gameData.accessibility_features) {
				const label = await getOrCreateLabel(
					LabelType.Accessibility,
					feature.nested_categories,
				);
				if (label) {
					game.labels.push(label);
				}
			}

			await game.save();
			importedCount++;
		}

		console.log(`[Seed] ✓ Successfully imported ${importedCount} games`);
	} catch (error) {
		console.error("[Seed] Failed to import games:", error);
		// Don't throw - we don't want to crash the server if seeding fails
	}
}
