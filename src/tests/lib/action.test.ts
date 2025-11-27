import "reflect-metadata";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { DataSource } from "typeorm";
import { Game, GameMedia, Label } from "$entity/Games";
import { Review } from "$entity/Review";
import { User } from "$entity/User";
import { generateAccessToken } from "$utils/jwt";
import { hashPassword } from "$utils/password";
import { runWithRequest } from "$utils/request-context";
import { type CreateReviewInput, createReview, loginUser } from "../../action";
import { AppDataSource } from "../../data-source";

let testDataSource: DataSource;

beforeEach(async () => {
	testDataSource = new DataSource({
		database: ":memory:",
		entities: [User, Game, GameMedia, Label, Review],
		synchronize: true,
		type: "sqlite",
	});
	await testDataSource.initialize();

	// Replace the AppDataSource with our test data source
	// This is a workaround for testing since the actions use the global AppDataSource
	Object.assign(AppDataSource, testDataSource);
});

afterEach(async () => {
	if (testDataSource.isInitialized) {
		await testDataSource.destroy();
	}
});

describe("loginUser", () => {
	test("should successfully login with valid credentials", async () => {
		// Create a test user
		const user = new User();
		user.username = "testuser";
		user.email = "test@example.com";
		user.passwordHash = await hashPassword("Password123");
		await user.save();

		const result = await loginUser("testuser", "Password123");

		expect(result.success).toBe(true);
		expect(result.token).toBeDefined();
		expect(result.error).toBeUndefined();
	});

	test("should fail login with invalid username", async () => {
		const result = await loginUser("nonexistent", "Password123");

		expect(result.success).toBe(false);
		expect(result.token).toBeUndefined();
		expect(result.error).toBe("Invalid username or password");
	});

	test("should fail login with invalid password", async () => {
		// Create a test user
		const user = new User();
		user.username = "testuser";
		user.email = "test@example.com";
		user.passwordHash = await hashPassword("CorrectPassword123");
		await user.save();

		const result = await loginUser("testuser", "WrongPassword123");

		expect(result.success).toBe(false);
		expect(result.token).toBeUndefined();
		expect(result.error).toBe("Invalid username or password");
	});

	test("should return valid token with correct user data", async () => {
		// Create a test user
		const user = new User();
		user.username = "johndoe";
		user.email = "john@example.com";
		user.passwordHash = await hashPassword("SecurePass123");
		await user.save();

		const result = await loginUser("johndoe", "SecurePass123");

		expect(result.success).toBe(true);
		expect(result.token).toBeDefined();

		// Verify the token can be decoded and contains correct data
		const jwt = await import("jsonwebtoken");
		const decoded = jwt.decode(result.token as string) as {
			userId: number;
			username: string;
		};

		expect(decoded.userId).toBe(user.id);
		expect(decoded.username).toBe("johndoe");
	});

	test("should handle database errors gracefully", async () => {
		// Close the database to simulate an error
		await testDataSource.destroy();

		const result = await loginUser("testuser", "Password123");

		expect(result.success).toBe(false);
		expect(result.error).toBe(
			"An error occurred during login. Please try again.",
		);
	});
});

describe("createReview", () => {
	let testUser: User;
	let testGame: Game;
	let validToken: string;

	beforeEach(async () => {
		// Create a test user
		testUser = new User();
		testUser.username = "reviewer";
		testUser.email = "reviewer@example.com";
		testUser.passwordHash = await hashPassword("Password123");
		await testUser.save();

		// Create a test game
		testGame = new Game();
		testGame.name = "Test Game";
		testGame.description = "A test game";
		testGame.labels = [];
		testGame.media = [];
		await testGame.save();

		// Generate a valid token
		validToken = generateAccessToken(testUser.id, testUser.username);
	});

	test("should successfully create a review with valid data", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 5,
			comment: "Great game with excellent accessibility!",
			enjoyabilityRating: 4,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(true);
		expect(result.reviewId).toBeDefined();
		expect(result.error).toBeUndefined();

		// Verify the review was actually created in the database
		const savedReview = await Review.findOne({
			where: { id: result.reviewId },
		});
		expect(savedReview).not.toBeNull();
		expect(savedReview?.accessibilityRating).toBe(5);
		expect(savedReview?.enjoyabilityRating).toBe(4);
		expect(savedReview?.comment).toBe(
			"Great game with excellent accessibility!",
		);
	});

	test("should successfully create a review without optional comment", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 3,
			enjoyabilityRating: 4,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(true);
		expect(result.reviewId).toBeDefined();

		// Verify the review was created without a comment
		const savedReview = await Review.findOne({
			where: { id: result.reviewId },
		});
		expect(savedReview?.comment).toBeNull();
	});

	test("should reject unauthenticated requests", async () => {
		const request = new Request("http://localhost"); // No auth token

		const input: CreateReviewInput = {
			accessibilityRating: 5,
			enjoyabilityRating: 5,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(false);
		expect(result.error).toBe("You must be logged in to create a review");
		expect(result.reviewId).toBeUndefined();
	});

	test("should reject invalid accessibility rating below 1", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 0,
			enjoyabilityRating: 5,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(false);
		expect(result.error).toBe("Ratings must be between 1 and 5");
	});

	test("should reject invalid accessibility rating above 5", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 6,
			enjoyabilityRating: 5,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(false);
		expect(result.error).toBe("Ratings must be between 1 and 5");
	});

	test("should reject invalid enjoyability rating below 1", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 5,
			enjoyabilityRating: 0,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(false);
		expect(result.error).toBe("Ratings must be between 1 and 5");
	});

	test("should reject invalid enjoyability rating above 5", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 5,
			enjoyabilityRating: 10,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(false);
		expect(result.error).toBe("Ratings must be between 1 and 5");
	});

	test("should prevent duplicate reviews from the same user", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 4,
			comment: "First review",
			enjoyabilityRating: 3,
			gameId: testGame.id,
		};

		// Create first review
		const firstResult = await runWithRequest(request, () =>
			createReview(input),
		);
		expect(firstResult.success).toBe(true);

		// Try to create second review for the same game
		const secondInput: CreateReviewInput = {
			accessibilityRating: 5,
			comment: "Second review",
			enjoyabilityRating: 5,
			gameId: testGame.id,
		};

		const secondResult = await runWithRequest(request, () =>
			createReview(secondInput),
		);

		expect(secondResult.success).toBe(false);
		expect(secondResult.error).toBe("You have already reviewed this game");
	});

	test("should allow different users to review the same game", async () => {
		// Create another user
		const secondUser = new User();
		secondUser.username = "anotherreviewer";
		secondUser.email = "another@example.com";
		secondUser.passwordHash = await hashPassword("Password123");
		await secondUser.save();

		const secondToken = generateAccessToken(secondUser.id, secondUser.username);

		// First user's review
		const firstRequest = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const firstInput: CreateReviewInput = {
			accessibilityRating: 4,
			enjoyabilityRating: 3,
			gameId: testGame.id,
		};

		const firstResult = await runWithRequest(firstRequest, () =>
			createReview(firstInput),
		);
		expect(firstResult.success).toBe(true);

		// Second user's review
		const secondRequest = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${secondToken}`,
			},
		});

		const secondInput: CreateReviewInput = {
			accessibilityRating: 5,
			enjoyabilityRating: 5,
			gameId: testGame.id,
		};

		const secondResult = await runWithRequest(secondRequest, () =>
			createReview(secondInput),
		);
		expect(secondResult.success).toBe(true);

		// Verify both reviews exist
		const allReviews = await Review.find({
			where: { game: { id: testGame.id } },
		});
		expect(allReviews).toHaveLength(2);
	});

	test("should extract user from request, not allow client to choose user", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 5,
			enjoyabilityRating: 4,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));
		expect(result.success).toBe(true);

		// Verify the review is associated with the correct user from the token
		const savedReview = await Review.findOne({
			relations: ["user"],
			where: { id: result.reviewId },
		});

		expect(savedReview?.user.id).toBe(testUser.id);
	});

	test("should handle database errors gracefully", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		// Close the database to simulate an error
		await testDataSource.destroy();

		const input: CreateReviewInput = {
			accessibilityRating: 5,
			enjoyabilityRating: 5,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(false);
		expect(result.error).toBe(
			"An error occurred while creating the review. Please try again.",
		);
	});

	test("should accept boundary values for ratings (1 and 5)", async () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${validToken}`,
			},
		});

		const input: CreateReviewInput = {
			accessibilityRating: 1,
			enjoyabilityRating: 5,
			gameId: testGame.id,
		};

		const result = await runWithRequest(request, () => createReview(input));

		expect(result.success).toBe(true);
		expect(result.reviewId).toBeDefined();

		const savedReview = await Review.findOne({
			where: { id: result.reviewId },
		});
		expect(savedReview?.accessibilityRating).toBe(1);
		expect(savedReview?.enjoyabilityRating).toBe(5);
	});
});
