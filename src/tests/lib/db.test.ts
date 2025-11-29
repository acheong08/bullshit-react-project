import "reflect-metadata";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { DataSource } from "typeorm";
import { Game, GameMedia, Label, LabelType, MediaType } from "$entity/Games";
import { Review } from "$entity/Review";
import { User } from "$entity/User";
import {
	getFilterMap,
	getGameById,
	getReviewsByGameId,
	searchGames,
} from "$lib/db";

let testDataSource: DataSource;

beforeEach(async () => {
	testDataSource = new DataSource({
		database: ":memory:",
		entities: [User, Game, GameMedia, Label, Review],
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

describe("getReviewsByGameId", () => {
	test("returns empty array for game with no reviews", async () => {
		const game = new Game();
		game.name = "Test Game";
		game.description = "A test game";
		game.labels = [];
		game.media = [];
		await game.save();

		const result = await getReviewsByGameId(game.id);
		expect(result).toEqual([]);
	});

	test("returns only reviews with comments", async () => {
		const user1 = new User();
		user1.username = "testuser1";
		user1.email = "test1@example.com";
		user1.passwordHash = "hash";
		await user1.save();

		const user2 = new User();
		user2.username = "testuser2";
		user2.email = "test2@example.com";
		user2.passwordHash = "hash";
		await user2.save();

		const game = new Game();
		game.name = "Test Game";
		game.description = "A test game";
		game.labels = [];
		game.media = [];
		await game.save();

		// Create review WITH comment
		const review1 = new Review();
		review1.accessibilityRating = 5;
		review1.enjoyabilityRating = 4;
		review1.comment = "Great game!";
		review1.user = user1;
		review1.game = game;
		await review1.save();

		// Create review WITHOUT comment (should be filtered out) - different user
		const review2 = new Review();
		review2.accessibilityRating = 3;
		review2.enjoyabilityRating = 3;
		review2.comment = null;
		review2.user = user2;
		review2.game = game;
		await review2.save();

		const result = await getReviewsByGameId(game.id);

		expect(result).toHaveLength(1);
		expect(result[0].comment).toBe("Great game!");
		expect(result[0].accessibilityRating).toBe(5);
		expect(result[0].enjoyabilityRating).toBe(4);
	});

	test("returns reviews with user relation loaded", async () => {
		const user = new User();
		user.username = "reviewer";
		user.email = "reviewer@example.com";
		user.passwordHash = "hash";
		await user.save();

		const game = new Game();
		game.name = "Test Game";
		game.description = "A test game";
		game.labels = [];
		game.media = [];
		await game.save();

		const review = new Review();
		review.accessibilityRating = 4;
		review.enjoyabilityRating = 5;
		review.comment = "Excellent!";
		review.user = user;
		review.game = game;
		await review.save();

		const result = await getReviewsByGameId(game.id);

		expect(result).toHaveLength(1);
		expect(result[0].user).toBeDefined();
		expect(result[0].user.username).toBe("reviewer");
	});

	test("returns multiple reviews from different users", async () => {
		const user1 = new User();
		user1.username = "testuser1";
		user1.email = "test1@example.com";
		user1.passwordHash = "hash";
		await user1.save();

		const user2 = new User();
		user2.username = "testuser2";
		user2.email = "test2@example.com";
		user2.passwordHash = "hash";
		await user2.save();

		const game = new Game();
		game.name = "Test Game";
		game.description = "A test game";
		game.labels = [];
		game.media = [];
		await game.save();

		// Create first review
		const review1 = new Review();
		review1.accessibilityRating = 4;
		review1.enjoyabilityRating = 4;
		review1.comment = "First review";
		review1.user = user1;
		review1.game = game;
		await review1.save();

		// Create second review with different user
		const review2 = new Review();
		review2.accessibilityRating = 5;
		review2.enjoyabilityRating = 5;
		review2.comment = "Second review";
		review2.user = user2;
		review2.game = game;
		await review2.save();

		const result = await getReviewsByGameId(game.id);

		expect(result).toHaveLength(2);
		// Verify both reviews are present
		const comments = result.map((r) => r.comment);
		expect(comments).toContain("First review");
		expect(comments).toContain("Second review");
	});
});

describe("searchGames", () => {
	test("returns all games when no filters or query provided", async () => {
		const game1 = new Game();
		game1.name = "Game One";
		game1.description = "First game";
		game1.labels = [];
		game1.media = [];
		await game1.save();

		const game2 = new Game();
		game2.name = "Game Two";
		game2.description = "Second game";
		game2.labels = [];
		game2.media = [];
		await game2.save();

		const results = await searchGames([], "Popularity", "");
		expect(results).toHaveLength(2);
	});

	test("filters games by labels", async () => {
		const labelAction = new Label();
		labelAction.type = LabelType.Genre;
		labelAction.name = "Action";
		labelAction.description = "Action games";
		await labelAction.save();

		const labelRPG = new Label();
		labelRPG.type = LabelType.Genre;
		labelRPG.name = "RPG";
		labelRPG.description = "Role-Playing Game";
		await labelRPG.save();

		const game1 = new Game();
		game1.name = "Action Game";
		game1.description = "An action-packed game";
		game1.labels = [labelAction];
		game1.media = [];
		await game1.save();

		const game2 = new Game();
		game2.name = "RPG Game";
		game2.description = "An immersive RPG experience";
		game2.labels = [labelRPG];
		game2.media = [];
		await game2.save();

		const results = await searchGames(["Action"], "Popularity", "");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Action Game");
	});

	//TODO: SQLite does not support ILIKE, so this test is disabled for now.
	// test("searches games by query", async () => {
	//     const game1 = new Game();
	//     game1.name = "Space Adventure";
	//     game1.description = "Explore the galaxy";
	//     game1.labels = [];
	//     game1.media = [];
	//     await game1.save();
	//
	//     const game2 = new Game();
	//     game2.name = "Jungle Quest";
	//     game2.description = "An adventure in the jungle";
	//     game2.labels = [];
	//     game2.media = [];
	//     await game2.save();
	//
	//     const results = await searchGames([], "Popularity", "jung");
	//     expect(results).toHaveLength(1);
	//     expect(results[0].name).toBe("Jungle Quest");
	// });
});
