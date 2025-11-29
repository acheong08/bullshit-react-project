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
import { Report, ReportStatus } from "$entity/Report";

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

	if (!adminUsername || !adminPasswordHash) {
		console.log(
			"[Seed] Skipping admin user creation - ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set",
		);
		return;
	}

	try {
		const existingAdmin = await User.findOne({
			where: { username: adminUsername },
		});

		if (existingAdmin) {
			console.log(`[Seed] Admin user '${adminUsername}' already exists`);
			return;
		}

		const admin = new User();
		admin.username = adminUsername;
		admin.passwordHash = adminPasswordHash;
		admin.email = process.env.ADMIN_EMAIL || `${adminUsername}@example.com`;

		await admin.save();

		console.log(`[Seed] ✓ Admin user '${adminUsername}' created successfully`);
	} catch (error) {
		console.error("[Seed] Failed to create admin user:", error);
	}
}

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

export async function seedGames(): Promise<void> {
	try {
		const existingGamesCount = await Game.count();
		if (existingGamesCount > 0) {
			console.log(
				`[Seed] Skipping game import - ${existingGamesCount} games already exist`,
			);
			return;
		}

		console.log("[Seed] Starting game import from games.jsonl...");

		const lines = gamesData.trim().split("\n");
		const parsedGames: GameData[] = [];

		for (const line of lines) {
			if (!line.trim()) continue;
			parsedGames.push(JSON.parse(line));
		}

		console.log(`[Seed] Parsed ${parsedGames.length} games`);

		const labelMap = new Map<string, LabelDescriptor>();

		for (const gameData of parsedGames) {
			const rating = gameData.industry_rating || IndustryRating.Everyone;
			const ratingKey = `${LabelType.IndustryRating}-${rating}`;
			labelMap.set(ratingKey, {
				name: rating,
				type: LabelType.IndustryRating,
			});

			for (const genre of gameData.genres) {
				const key = `${LabelType.Genre}-${genre}`;
				labelMap.set(key, { name: genre, type: LabelType.Genre });
			}

			for (const platform of gameData.platforms) {
				const key = `${LabelType.Platform}-${platform}`;
				labelMap.set(key, { name: platform, type: LabelType.Platform });
			}
		}

		for (const accessLabel of ACCESSIBILITY_LABELS) {
			const key = `${LabelType.Accessibility}-${accessLabel}`;
			labelMap.set(key, { name: accessLabel, type: LabelType.Accessibility });
		}

		console.log(`[Seed] Found ${labelMap.size} unique labels`);

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

		let importedCount = 0;

		for (const gameData of parsedGames) {
			const game = new Game();
			game.name = gameData.title;
			game.description = "";
			game.media = [];

			if (gameData.image_url) {
				const media = new GameMedia();
				media.type = MediaType.Icon;
				media.uri = gameData.image_url;
				await media.save();
				game.media.push(media);
			}

			const gameLabelSet = new Map<number, Label>();

			const rating = gameData.industry_rating || "Everyone";
			const ratingKey = `${LabelType.IndustryRating}-${rating}`;
			const ratingLabel = labelCache.get(ratingKey);
			if (ratingLabel) {
				gameLabelSet.set(ratingLabel.id, ratingLabel);
			}

			for (const genre of gameData.genres) {
				const key = `${LabelType.Genre}-${genre}`;
				const label = labelCache.get(key);
				if (label) {
					gameLabelSet.set(label.id, label);
				}
			}

			for (const platform of gameData.platforms) {
				const key = `${LabelType.Platform}-${platform}`;
				const label = labelCache.get(key);
				if (label) {
					gameLabelSet.set(label.id, label);
				}
			}

			const accessibilityLabelKeys = ACCESSIBILITY_LABELS.map(
				(name) => `${LabelType.Accessibility}-${name}`,
			);
			const numLabels = Math.floor(Math.random() * 6) + 3;
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
	}
}

export async function seedReports(): Promise<void> {
	try {
		const existingReportsCount = await Report.count();
		if (existingReportsCount > 0) {
			console.log(
				`[Seed] Skipping report creation - ${existingReportsCount} reports already exist`,
			);
			return;
		}

		const games = await Game.find({ 
			relations: ["media", "labels"],
			take: 5
		});

		if (games.length === 0) {
			console.log("[Seed] No games found - skipping report creation");
			return;
		}

		console.log(`[Seed] Creating sample reports for ${games.length} games...`);

		const reportReasons = [
			"Offensive content",
			"Incorrect game details",
			"Broken image link",
			"Wrong genre classification",
			"Inappropriate for age rating"
		];

		let createdCount = 0;

		for (let i = 0; i < Math.min(games.length, 3); i++) {
			const game = games[i];
			const report = new Report();
			report.game = game;
			report.reportReason = reportReasons[i % reportReasons.length];
			report.status = ReportStatus.Pending;
			
			await report.save();
			createdCount++;
		}

		console.log(`[Seed] ✓ Created ${createdCount} sample reports`);
	} catch (error) {
		console.error("[Seed] Failed to create reports:", error);
	}
}
