import "reflect-metadata";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { DataSource } from "typeorm";
import { Game, GameMedia, Label, LabelType, MediaType } from "$entity/Games";
import { User } from "$entity/User";
import { getGameById } from "$lib/db";

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
