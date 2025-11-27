import "reflect-metadata";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { DataSource } from "typeorm";
import { Game, GameMedia, Label, LabelType, MediaType } from "$entity/Games";
import { User } from "$entity/User";
import { getFilterMap, getGameById } from "$lib/db";

let testDataSource: DataSource;

beforeEach(async () => {
	testDataSource = new DataSource({
		database: ":memory:",
		entities: [User, Game, GameMedia, Label],
		synchronize: true,
		type: "sqlite",
	});
	await testDataSource.initialize();
});

afterEach(async () => {
	await testDataSource.destroy();
});

test("Add and remove user", async () => {
	const user = new User();
	user.username = "testuser";
	user.passwordHash = "placeholder";
	user.email = "example@example.com";
	await user.save();
	const allUsers = await User.find();
	expect(allUsers).toHaveLength(1);
	for (const user of allUsers) {
		await user.remove();
	}
	expect(await User.find()).toHaveLength(0);
});

describe("getGameById", () => {
	test("returns null for non-existent game", async () => {
		const result = await getGameById(999);
		expect(result).toBeNull();
	});

	test("returns game with basic data", async () => {
		const game = new Game();
		game.name = "Test Game";
		game.description = "A test game";
		game.labels = [];
		game.media = [];
		await game.save();

		const result = await getGameById(game.id);
		expect(result).not.toBeNull();
		expect(result?.name).toBe("Test Game");
		expect(result?.description).toBe("A test game");
	});

	test("returns game with media", async () => {
		const media = new GameMedia();
		media.type = MediaType.PreviewImg;
		media.uri = "/images/test.png";
		await media.save();

		const game = new Game();
		game.name = "Game with Media";
		game.description = "Test";
		game.labels = [];
		game.media = [media];
		await game.save();

		const result = await getGameById(game.id);
		expect(result?.media).toHaveLength(1);
		expect(result?.media[0].uri).toBe("/images/test.png");
		expect(result?.media[0].type).toBe(MediaType.PreviewImg);
	});

	test("returns game with flat labels", async () => {
		const platformLabel = new Label();
		platformLabel.type = LabelType.Platform;
		platformLabel.name = "PC";
		platformLabel.description = "Personal Computer";
		await platformLabel.save();

		const game = new Game();
		game.name = "Game with Labels";
		game.description = "Test";
		game.labels = [platformLabel];
		game.media = [];
		await game.save();

		const result = await getGameById(game.id);
		expect(result?.labels).toHaveLength(1);
		expect(result?.labels[0].name).toBe("PC");
	});

	test("loads accessibility labels", async () => {
		const accessLabel = new Label();
		accessLabel.type = LabelType.Accessibility;
		accessLabel.name = "Colorblind Mode";
		accessLabel.description = "Colorblind-friendly mode";
		await accessLabel.save();

		const game = new Game();
		game.name = "Accessible Game";
		game.description = "Test";
		game.labels = [accessLabel];
		game.media = [];
		await game.save();

		const result = await getGameById(game.id);
		expect(result?.labels).toHaveLength(1);
		expect(result?.labels[0].name).toBe("Colorblind Mode");
	});

	test("loads game with multiple labels of different types", async () => {
		const platformLabel = new Label();
		platformLabel.type = LabelType.Platform;
		platformLabel.name = "PlayStation 5";
		platformLabel.description = "PS5";
		await platformLabel.save();

		const ratingLabel = new Label();
		ratingLabel.type = LabelType.IndustryRating;
		ratingLabel.name = "Teen";
		ratingLabel.description = "ESRB Teen";
		await ratingLabel.save();

		const accessibilityLabel = new Label();
		accessibilityLabel.type = LabelType.Accessibility;
		accessibilityLabel.name = "Subtitles";
		accessibilityLabel.description = "Subtitle support";
		await accessibilityLabel.save();

		const game = new Game();
		game.name = "Multi-Label Game";
		game.description = "Test";
		game.labels = [platformLabel, ratingLabel, accessibilityLabel];
		game.media = [];
		await game.save();

		const result = await getGameById(game.id);
		expect(result?.labels).toHaveLength(3);

		const platformLabels = result?.labels.filter(
			(l) => l.type === LabelType.Platform,
		);
		const ratingLabels = result?.labels.filter(
			(l) => l.type === LabelType.IndustryRating,
		);
		const accessibilityLabels = result?.labels.filter(
			(l) => l.type === LabelType.Accessibility,
		);

		expect(platformLabels).toHaveLength(1);
		expect(ratingLabels).toHaveLength(1);
		expect(accessibilityLabels).toHaveLength(1);
		expect(accessibilityLabels?.[0].name).toBe("Subtitles");
	});

	test("handles game with no labels or media", async () => {
		const game = new Game();
		game.name = "Minimal Game";
		game.description = "No extras";
		game.labels = [];
		game.media = [];
		await game.save();

		const result = await getGameById(game.id);
		expect(result).not.toBeNull();
		expect(result?.labels).toEqual([]);
		expect(result?.media).toEqual([]);
	});
});

describe("getFilterMap", () => {
	test("returns correct filter map", async () => {
		const result = await getFilterMap();
		expect(result.size).toBe(5);
		//Since the categories are hardcoded in the enum, we just check for their presence
		expect(result.get("Genre")).toEqual([]);
		expect(result.get("Accessibility")).toEqual([]);
		expect(result.get("Platform")).toEqual([]);
		expect(result.get("IndustryRating")).toEqual([]);
		expect(result.get("Misc")).toEqual([]);
	});

	test("returns labels grouped by category", async () => {
		const genreLabel = new Label();
		genreLabel.type = LabelType.Genre;
		genreLabel.name = "Action";
		genreLabel.description = "Action games";
		await genreLabel.save();

		const accessLabel = new Label();
		accessLabel.type = LabelType.Accessibility;
		accessLabel.name = "Subtitles";
		accessLabel.description = "Subtitle support";
		await accessLabel.save();

		const platformLabel = new Label();
		platformLabel.type = LabelType.Platform;
		platformLabel.name = "PC";
		platformLabel.description = "Personal Computer";
		await platformLabel.save();

		const result = await getFilterMap();
		expect(result.get("Genre")).toEqual(["Action"]);
		expect(result.get("Accessibility")).toEqual(["Subtitles"]);
		expect(result.get("Platform")).toEqual(["PC"]);
	});

	test("handles multiple labels in the same category", async () => {
		const genreLabel1 = new Label();
		genreLabel1.type = LabelType.Genre;
		genreLabel1.name = "RPG";
		genreLabel1.description = "Role-Playing Game";
		await genreLabel1.save();

		const genreLabel2 = new Label();
		genreLabel2.type = LabelType.Genre;
		genreLabel2.name = "Strategy";
		genreLabel2.description = "Strategy Game";
		await genreLabel2.save();

		const result = await getFilterMap();
		expect(result.get("Genre")).toEqual(["RPG", "Strategy"]);
	});
});
