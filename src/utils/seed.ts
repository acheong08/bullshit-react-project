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
				console.log(
					`[Seed] Importing image for game '${gameData.title}': ${gameData.image_url}`,
				);
				const media = new GameMedia();
				media.type = MediaType.Icon;
				media.uri = gameData.image_url;
				await media.save();
				game.media.push(media);
				console.log(game.media);
			} else {
				console.warn(
					`[Seed] Warning: Game '${gameData.title}' is missing an image_url`,
				);
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

		//Hardcoding some media (4 promotion images, 1 video)

		//Alien Isolation

		await populateGameMedia(
			"Alien Isolation",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/214490/ss_5ff8ca35914eca8f51f3303cf5d94a9f85279e2a.1920x1080.jpg?t=1763647113",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/214490/ss_af3b9b789a57497e300e0a4c962badf513387a69.1920x1080.jpg?t=1763647113",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/214490/ss_b82b51fd2e63fb802c784f7a3fbe1e65148ad6e1.1920x1080.jpg?t=1763647113",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/214490/ss_b1e245fecbcb2b93f48d76f4031f303076b4a6bc.1920x1080.jpg?t=1763647113",
			],
			["https://www.youtube.com/embed/7h0cgmvIrZw?si=ljhD5Ov2iuixlFYs"],
		);
		//Anthem
		await populateGameMedia(
			"Anthem",
			[
				"https://media.contentapi.ea.com/content/dam/eacom/anthem/news/images/2019/02/anthem-tips-and-tricks-collosus-javelin-featured-tile.png.adapt.crop16x9.1455w.png",
				"https://media.contentapi.ea.com/content/dam/eacom/anthem/news/images/2019/02/featured-tile-anthem-tips-and-tricks-ranger-javelin.png.adapt.crop16x9.1455w.png",
				"https://media.contentapi.ea.com/content/dam/eacom/anthem/news/images/2019/02/anthem-tips-and-tricks-interceptor-javelin-featured-tile.png.adapt.crop16x9.1455w.png",
				"https://media.contentapi.ea.com/content/dam/eacom/anthem/images/2019/02/anthem-tips-and-tricks-storm-javelin-featured-image.jpg.adapt.crop16x9.1455w.jpg",
			],
			["https://www.youtube.com/embed/osX1BW71nyU?si=eZy6dOck8yzNUOzq"],
		);

		//Ark survival evolved
		await populateGameMedia(
			"ARK: Survival Evolved",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/346110/ss_2fd997a2f7151cb2187043a1f41589cc6a9ebf3a.1920x1080.jpg?t=1763080281",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/346110/ss_01cbef83fe28d64ee5a3d39a86043fb1e49abd31.1920x1080.jpg?t=1763080281",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/346110/ss_164a92a53f9bcbb728b391fc0719f9769c2e1249.1920x1080.jpg?t=1763080281",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/346110/ss_46778c08a1a5ac5bdbaf8a5bf844fa666f66a14b.1920x1080.jpg?t=1763080281",
			],
			["https://www.youtube.com/embed/FW9vsrPWujI?si=D5-s6rHj6bX94D_-"],
		);

		//Assassins Creed Odyssey
		await populateGameMedia(
			//NOTE: the apostrophe in "Assassin's" is a special character
			"Assassin’s Creed Odyssey",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/812140/ss_0ef33c0f230da6ebac94f5959f0e0a8bbc48cf8a.1920x1080.jpg?t=1758656673",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/812140/ss_3f8f4a09fb1d69648a8c20aae19ca2924ba275bd.1920x1080.jpg?t=1758656673",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/812140/ss_6dc9f95cfb6d264c3535b53ce08f36ee07066550.1920x1080.jpg?t=1758656673",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/812140/ss_458b7cc7392b6fd073bbd679868fd486013cb474.1920x1080.jpg?t=1758656673",
			],
			["https://www.youtube.com/embed/6F8L3d_OIE0?si=gLIstyH-amzI3Z1u"],
		);

		//Assassins Creed Syndicate

		await populateGameMedia(
			"Assassin’s Creed Syndicate",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/368500/ss_349dc173bd543fddd7b667253e3429e9565fe098.1920x1080.jpg?t=1754582370",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/368500/ss_11432237c45e225db89965fed88fa56cd02b0072.1920x1080.jpg?t=1754582370",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/368500/ss_80c48aa2d827a9864180db0169413046bddb2035.1920x1080.jpg?t=1754582370",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/368500/ss_851199df5f2f2d44b4a8125e854af27d6204c1b6.1920x1080.jpg?t=1754582370",
			],
			["https://www.youtube.com/embed/WTBbwgsyxvg?si=ISx4gvLw59LFQbwT"],
		);
		//Assassins Creed Valhalla
		await populateGameMedia(
			"Assassin’s Creed Valhalla",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2208920/ss_103481084a59b34837113daf27c04679caf743f3.1920x1080.jpg?t=1754572990",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2208920/ss_e7310b36689ec722d2ea4643efc15bd8fa720c67.1920x1080.jpg?t=1754572990",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2208920/ss_c3bff917ead50268eb7708ef3bf30e07b58929e9.1920x1080.jpg?t=1754572990",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2208920/ss_5e527e1e063ef041ca6680f503081274dcc5513a.1920x1080.jpg?t=1754572990",
			],
			["https://www.youtube.com/embed/rKjUAWlbTJk?si=fuwFW-hiF54zTQa4"],
		);

		//Astros Playroom
		await populateGameMedia(
			"ASTRO’S PLAYROOM",
			[
				"https://gmedia.playstation.com/is/image/SIEPDC/astros-playroom-screenshot-15-disclaimer-en-06oct20?$1200px$",
				"https://gmedia.playstation.com/is/image/SIEPDC/astros-playroom-screenshot-07-disclaimer-en-06oct20?$1200px--t$",
				"https://gmedia.playstation.com/is/image/SIEPDC/astros-playroom-screenshot-05-disclaimer-en-06oct20?$1200px--t$",
				"https://gmedia.playstation.com/is/image/SIEPDC/astros-playroom-screenshot-03-disclaimer-en-06oct20?$1200px--t$",
				"https://gmedia.playstation.com/is/image/SIEPDC/astros-playroom-screenshot-14-disclaimer-en-06oct20?$1200px$",
			],
			["https://www.youtube.com/embed/lu5VXrEqgco?si=VPZDD2OlquwnX5Dt"],
		);

		//Astroneer
		await populateGameMedia(
			"Astroneer",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/361420/ss_539bc5211ccdad2bc6cc70e4af40194d74eb0256.1920x1080.jpg?t=1763660960",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/361420/ss_858b8bece04b753a6b35a009776a4de9dd6e0df7.1920x1080.jpg?t=1763660960",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/361420/ss_436f3ea0934a6ecd3fdd2f260ef535d80b8c185d.1920x1080.jpg?t=1763660960",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/361420/ss_13682f989b3f0d68afb92d5d50185b0258dd4767.1920x1080.jpg?t=1763660960",
			],
			["https://www.youtube.com/embed/UMLwzt5t9bs?si=bkyjKUPWj2KgtqNf"],
		);

		//Back 4 Blood
		await populateGameMedia(
			"Back 4 Blood",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/924970/ss_3329126d46bfd0cd32069508a1d37e40a1f4d92e.1920x1080.jpg?t=1746220006",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/924970/ss_01d625277a7dc76a67f78de3a3ed1e633d205ddd.1920x1080.jpg?t=1746220006",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/924970/ss_cb8d4bd7139ce8f80df16e5c7c4be906222f050b.1920x1080.jpg?t=1746220006",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/924970/ss_cff8429e91cfc960864b0652855a8458e43d476a.1920x1080.jpg?t=1746220006",
			],
			["https://www.youtube.com/embed/kyBbYndoyTE?si=xqRpOf01WSZ77aS0"],
		);
		//Battlefield
		await populateGameMedia(
			"Battlefield 1",
			[
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238840/ss_b914b0daf3c46d908d403bdec2881cf2b8d34915.1920x1080.jpg?t=1747168268",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238840/ss_a608c2726850f7ee69d0db51282811dc33d9d083.1920x1080.jpg?t=1747168268",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238840/ss_25fbf466cb86f59e47ad06827788c003f079d403.1920x1080.jpg?t=1747168268",
				"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238840/ss_432fba694d3dfdab325ddf83cbb355545a4554c6.1920x1080.jpg?t=1747168268",
			],
			["https://www.youtube.com/embed/4pY3hlQEOc0?si=NfQ4SpmFQX1PotiD"],
		);
		//Replace (Role Playing Game (RPG)) with (RPG) in genre labels for all games
		await replaceLabelName("Role-Playing Game (RPG)", "RPG");
		await replaceLabelName("First-Person Shooter (FPS)", "FPS");
		await replaceLabelName("Third-Person Shooter (TPS)", "TPS");

		console.log(`[Seed] ✓ Successfully imported ${importedCount} games`);
	} catch (error) {
		console.error("[Seed] Failed to import games:", error);
		// Don't throw - we don't want to crash the server if seeding fails
	}
}

async function populateGameMedia(
	gameName: string,
	promoImages: string[],
	videoUris: string[],
) {
	const game = await Game.findOne({
		relations: ["media"],
		where: { name: gameName },
	});
	if (!game) {
		console.warn(
			`[Seed] Warning: Could not find '${gameName}' game to add media`,
		);
		return;
	}

	if (!game.media) {
		console.warn(
			`[Seed] Warning: Game '${gameName}' has no media array initialized`,
		);
		return;
	}

	for (const uri of promoImages) {
		const media = new GameMedia();
		media.type = MediaType.PreviewImg;
		media.uri = uri;
		await media.save();
		game.media.push(media);
	}
	for (let uri of videoUris) {
		if (
			uri.includes("youtube.com") &&
			!uri.includes("&cc_load_policy=1&cc_lang_pref=en")
		) {
			uri = uri.concat("&cc_load_policy=1&cc_lang_pref=en");
			console.log(`[Seed] Updated video URI to include captions: ${uri}`);
		}

		const video = new GameMedia();
		video.type = MediaType.Video;
		video.uri = uri;
		await video.save();
		game.media.push(video);
	}
	await game.save();
}

async function replaceLabelName(
	oldName: string,
	newName: string,
): Promise<void> {
	const label = await Label.findOne({ where: { name: oldName } });
	if (label) {
		label.name = newName;
		await label.save();
		console.log(`[Seed] ✓ Replaced label name '${oldName}' with '${newName}'`);
	}
}
