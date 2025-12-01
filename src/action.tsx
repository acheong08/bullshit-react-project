"use server";

import bcrypt from "bcrypt";
import { QueryFailedError } from "typeorm";
import type { Game } from "$entity/Games";
import { Report, ReportStatus } from "$entity/Report";
import { Review } from "$entity/Review";
import { User } from "$entity/User";
import { deleteGame, updateGame, updateReportStatus } from "$lib/db";
import { getCurrentUser } from "$utils/auth";
import { generateAccessToken } from "$utils/jwt";
import { validatePassword, verifyPassword } from "$utils/password";
import { getRequest } from "$utils/request-context";
import { AppDataSource } from "./data-source";

export interface LoginResult {
	success: boolean;
	token?: string;
	error?: string;
}

export interface CreateReviewResult {
	success: boolean;
	reviewId?: number;
	error?: string;
}

export interface CreateReviewInput {
	gameId: number;
	accessibilityRating: number;
	enjoyabilityRating: number;
	comment?: string;
}

export interface DeleteReviewResult {
	success: boolean;
	error?: string;
}

/**
 * Authenticates a user with username and password
 * @param username - The username to authenticate
 * @param password - The plain text password
 * @returns LoginResult with success status and token or error message
 */
export async function loginUser(
	username: string,
	password: string,
): Promise<LoginResult> {
	try {
		// Initialize database connection if not already initialized
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		// Find user by username
		const user = await User.findOne({
			where: { username },
		});

		if (!user) {
			return {
				error: "Invalid username or password",
				success: false,
			};
		}

		// Verify password
		const isPasswordValid = await verifyPassword(password, user.passwordHash);

		if (!isPasswordValid) {
			return {
				error: "Invalid username or password",
				success: false,
			};
		}

		// Generate JWT token
		const token = generateAccessToken(user.id, user.username);

		return {
			success: true,
			token,
		};
	} catch (_) {
		return {
			error: "An error occurred during login. Please try again.",
			success: false,
		};
	}
}

/**
 * Creates a new review for a game
 * @param input - The review data (gameId, ratings, optional comment)
 * @returns CreateReviewResult with success status and review ID or error message
 */
export async function createReview(
	input: CreateReviewInput,
): Promise<CreateReviewResult> {
	try {
		// Initialize database connection if not already initialized
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		// Get request from AsyncLocalStorage context
		const request = getRequest();

		// Get authenticated user from request
		const currentUser = getCurrentUser(request);

		if (!currentUser) {
			return {
				error: "You must be logged in to create a review",
				success: false,
			};
		}

		// Validate ratings are within acceptable range (1-5)
		if (
			input.accessibilityRating < 1 ||
			input.accessibilityRating > 5 ||
			input.enjoyabilityRating < 1 ||
			input.enjoyabilityRating > 5
		) {
			return {
				error: "Ratings must be between 1 and 5",
				success: false,
			};
		}

		// Check if user already reviewed this game
		const existingReview = await Review.findOne({
			where: {
				game: { id: input.gameId },
				user: { id: currentUser.userId },
			},
		});

		if (existingReview) {
			return {
				error: "You have already reviewed this game",
				success: false,
			};
		}

		// Create the review
		const review = new Review();
		review.accessibilityRating = input.accessibilityRating;
		review.enjoyabilityRating = input.enjoyabilityRating;
		review.comment = input.comment || null;
		review.user = { id: currentUser.userId } as User;
		review.game = { id: input.gameId } as Game;

		await review.save();

		try {
			await AppDataSource.query(
				"REFRESH MATERIALIZED VIEW game_average_rating",
			);
		} catch (e) {
			if (e instanceof QueryFailedError) {
				console.log(
					"Only errors in tests because of SQLite not having materialized views",
				);
			} else {
				throw e;
			}
		}

		return {
			reviewId: review.id,
			success: true,
		};
	} catch {
		return {
			error: "An error occurred while creating the review. Please try again.",
			success: false,
		};
	}
}

/**
 * Deletes a user's review
 * @param reviewId - The ID of the review to delete
 * @returns DeleteReviewResult with success status or error message
 */
export async function deleteReview(
	reviewId: number,
): Promise<DeleteReviewResult> {
	try {
		// Initialize database connection if not already initialized
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		// Get request from AsyncLocalStorage context
		const request = getRequest();

		// Get authenticated user from request
		const currentUser = getCurrentUser(request);

		if (!currentUser) {
			return {
				error: "You must be logged in to delete a review",
				success: false,
			};
		}

		// Find the review
		const review = await Review.findOne({
			relations: ["user"],
			where: { id: reviewId },
		});

		if (!review) {
			return {
				error: "Review not found",
				success: false,
			};
		}

		// Verify the user owns this review
		if (review.user.id !== currentUser.userId) {
			return {
				error: "You can only delete your own reviews",
				success: false,
			};
		}

		// Delete the review
		await review.remove();

		return {
			success: true,
		};
	} catch (_) {
		return {
			error: "An error occurred while deleting the review. Please try again.",
			success: false,
		};
	}
}

/**
 * Registers a new user with email, username and password
 * @param email - The email attached to the created account
 * @param username - The username associated with new account
 * @param password - The password used to access the new account
 */
export async function registerUser(
	username: string,
	password: string,
	email: string,
): Promise<LoginResult> {
	try {
		// Initialize database connection
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Checks to ensure email/username haven't been used
		const usernameCheck = await User.findOne({
			where: { username },
		});

		const emailCheck = await User.findOne({
			where: { email },
		});

		if (usernameCheck) {
			return {
				error: "Email already exists.",
				success: false,
			};
		}

		if (emailCheck) {
			return {
				error: "Username already exists.",
				success: false,
			};
		}

		// Check for password security
		const check = validatePassword(password);
		if (!check.isValid) {
			return {
				error: check.error,
				success: check.isValid,
			};
		}

		// Create new user record
		const user = new User();
		user.email = email;
		user.passwordHash = hashedPassword;
		user.username = username;
		const newUser = await AppDataSource.manager.save(user);

		// Check if user creation failed
		if (!newUser) {
			return {
				error: "Account could not be created. Please try again",
				success: false,
			};
		}

		// Return successful registration
		return {
			success: true,
		};
	} catch (error) {
		console.error("Registration error:", error);
		return {
			error: "A registration error occurred. Please try again.",
			success: false,
		};
	}
}

// admin section - adding contents of my action.ts file to current one on main

/**
 * Server action to update a game's details
 * @param gameId - The ID of the game to update
 * @param data - Object containing name, description, and imageUri
 * @returns Object with success boolean
 */
export async function updateGameAction(
	gameId: number,
	data: { name: string; description: string; imageUri: string },
) {
	try {
		const success = await updateGame(gameId, data);
		return { success };
	} catch (error) {
		console.error("Error updating game:", error);
		return { success: false };
	}
}

/**
 * Server action to update a report's status
 * @param reportId - The ID of the report to update
 * @param status - The new status (pending, reviewed, or deleted)
 * @returns Object with success boolean
 */
export async function updateReportStatusAction(
	reportId: number,
	status: ReportStatus,
) {
	try {
		const success = await updateReportStatus(reportId, status);
		return { success };
	} catch (error) {
		console.error("Error updating report status:", error);
		return { success: false };
	}
}

/**
 * Server action to delete a game
 * @param gameId - The ID of the game to delete
 * @returns Object with success boolean
 */
export async function deleteGameAction(gameId: number) {
	try {
		const success = await deleteGame(gameId);
		return { success };
	} catch (_) {
		return { success: false };
	}
}

/**
 * Server action to create a new game report
 * @param gameId - The ID of the game being reported
 * @param reportReason - Why the game is being reported
 */
export async function createGameReport(gameId: number, reportReason: string) {
	try {
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		// Validate inputs
		if (!reportReason.trim()) {
			return { error: "Report reason is required", success: false };
		}

		// Create the report
		const report = new Report();
		report.game = { id: gameId } as Game;
		report.reportReason = reportReason.trim();
		report.status = ReportStatus.Pending;

		await report.save();

		return { success: true };
	} catch (error) {
		console.error("Error creating report:", error);
		return { error: "Failed to create report", success: false };
	}
}
