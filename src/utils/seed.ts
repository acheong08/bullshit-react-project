import gamesData from "$assets/games.jsonl?raw";
import {
	Game,
	GameMedia,
	IndustryRating,
	Label,
	LabelType,
	MediaType,
} from "$entity/Games";
import { User } from "$entity/User";

interface GameData {
	url: string;
	title: string;
	image_url: string;
	platforms: string[];
	genres: string[];
	industry_rating: string;
	accessibility_features: Array<{ nested_categories: string[] }>;
}

interface LabelDescriptor {
	type: LabelType;
	name: string;
}

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

// Hardcoded list of accessibility labels
const ACCESSIBILITY_LABELS = [
	"Colorblind Mode",
	"Subtitles",
	"Screen Reader Support",
	"Adjustable Text Size",
	"High Contrast Mode",
	"Remappable Controls",
	"One-handed Mode",
	"Difficulty Settings",
	"Auto-aim Assist",
	"Visual Sound Cues",
	"Audio Descriptions",
	"Pause Anytime",
	"Skip QTE Events",
	"Reduced Motion Mode",
	"Adjustable Game Speed",
];

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

		// Step 1: Parse all game data
		const lines = gamesData.trim().split("\n");
		const parsedGames: GameData[] = [];

		for (const line of lines) {
			if (!line.trim()) continue;
			parsedGames.push(JSON.parse(line));
		}

		console.log(`[Seed] Parsed ${parsedGames.length} games`);

		// Step 2: Extract all unique labels across all games
		const labelMap = new Map<string, LabelDescriptor>();

		for (const gameData of parsedGames) {
			// Industry rating
			const rating = gameData.industry_rating || IndustryRating.Everyone;
			const ratingKey = `${LabelType.IndustryRating}-${rating}`;
			labelMap.set(ratingKey, {
				name: rating,
				type: LabelType.IndustryRating,
			});

			// Genres
			for (const genre of gameData.genres) {
				const key = `${LabelType.Genre}-${genre}`;
				labelMap.set(key, { name: genre, type: LabelType.Genre });
			}

			// Platforms
			for (const platform of gameData.platforms) {
				const key = `${LabelType.Platform}-${platform}`;
				labelMap.set(key, { name: platform, type: LabelType.Platform });
			}
		}

		// Add hardcoded accessibility labels
		for (const accessLabel of ACCESSIBILITY_LABELS) {
			const key = `${LabelType.Accessibility}-${accessLabel}`;
			labelMap.set(key, { name: accessLabel, type: LabelType.Accessibility });
		}

		console.log(`[Seed] Found ${labelMap.size} unique labels`);

		// Step 3: Create all labels in database
		const labelCache = new Map<string, Label>();

		for (const [key, desc] of labelMap.entries()) {
			const label = new Label();
			label.type = desc.type;
			label.name = desc.name;
			label.description = "";
			await label.save();
			labelCache.set(key, label);
		}

		console.log(`[Seed] Created ${labelCache.size} labels in database`);

		// Step 4: Create all games with their relations
		let importedCount = 0;

		for (const gameData of parsedGames) {
			const game = new Game();
			game.name = gameData.title;
			game.description = "";
			game.media = [];

			// Create media
			if (gameData.image_url) {
				const media = new GameMedia();
				media.type = MediaType.Icon;
				media.uri = gameData.image_url;
				await media.save();
				game.media.push(media);
			}

			// Collect labels for this game (deduplicated)
			const gameLabelSet = new Map<number, Label>();

			// Industry rating
			const rating = gameData.industry_rating || "Everyone";
			const ratingKey = `${LabelType.IndustryRating}-${rating}`;
			const ratingLabel = labelCache.get(ratingKey);
			if (ratingLabel) {
				gameLabelSet.set(ratingLabel.id, ratingLabel);
			}

			// Genres
			for (const genre of gameData.genres) {
				const key = `${LabelType.Genre}-${genre}`;
				const label = labelCache.get(key);
				if (label) {
					gameLabelSet.set(label.id, label);
				}
			}

			// Platforms
			for (const platform of gameData.platforms) {
				const key = `${LabelType.Platform}-${platform}`;
				const label = labelCache.get(key);
				if (label) {
					gameLabelSet.set(label.id, label);
				}
			}

			// Accessibility features (randomly select 3-8 labels)
			const accessibilityLabelKeys = ACCESSIBILITY_LABELS.map(
				(name) => `${LabelType.Accessibility}-${name}`,
			);
			const numLabels = Math.floor(Math.random() * 6) + 3; // Random 3-8
			const shuffled = [...accessibilityLabelKeys].sort(
				() => Math.random() - 0.5,
			);
			const selectedLabels = shuffled.slice(0, numLabels);

			for (const key of selectedLabels) {
				const label = labelCache.get(key);
				if (label) {
					gameLabelSet.set(label.id, label);
				}
			}

			game.labels = Array.from(gameLabelSet.values());
			await game.save();
			importedCount++;
		}

		console.log(`[Seed] ✓ Successfully imported ${importedCount} games`);
	} catch (error) {
		console.error("[Seed] Failed to import games:", error);
		// Don't throw - we don't want to crash the server if seeding fails
	}
}
