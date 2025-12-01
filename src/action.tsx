"use server";

import bcrypt from "bcrypt";
import type { Game } from "$entity/Games";
import { Review } from "$entity/Review";
import { User } from "$entity/User";
import { getCurrentUser } from "$utils/auth";
import { generateAccessToken, verifyAccessToken } from "$utils/jwt";
import { validatePassword, verifyPassword } from "$utils/password";
import { getRequest } from "$utils/request-context";
import { AppDataSource } from "./data-source";

export interface LoginResult {
	success: boolean;
	token?: string;
	error?: string;
}

export interface Settings {
	captions: boolean;
	captionStyle: string;
	audioDescriptions: boolean;
	soundFeedback: boolean;

	voiceControls: boolean;
	keyboardNavigation: boolean;
	buttonSize: string;
	gestureSensitivity: string;
	scrollSpeed: string;
}

export interface UserData {
	success: boolean;
	username?: string;
	profileImage?: string;
	accessibilitySettings?: Settings;
	imageType?: string;
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

		return {
			reviewId: review.id,
			success: true,
		};
	} catch (_) {
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

/**
 * Updates a username
 * @param token - Token of user being updated
 * @param newUsername - Updated username
 */
export async function updateUser(
	token: string,
	newUsername: string,
): Promise<LoginResult> {
	try {
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		const payload = verifyAccessToken(token);
		if (!payload || !payload.userId) {
			return { error: "Invalid authentication token.", success: false };
		}

		const user = await User.findOne({
			where: { id: payload.userId },
		});

		if (!user) {
			return { error: "User not found.", success: false };
		}

		user.username = newUsername;
		await user.save();

		const newToken = generateAccessToken(user.id, user.username);
		return { success: true, token: newToken };
	} catch (err) {
		console.error("Update user error:", err);
		return {
			error: "An unexpected error occurred while updating username.",
			success: false,
		};
	}
}

/**
 * Gets user data
 * @param token - Token of user whose data is being fetched
 */
export async function getUserData(token: string): Promise<UserData> {
	try {
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		const payload = verifyAccessToken(token);
		if (!payload || !payload.userId) {
			return { error: "Invalid authentication token.", success: false };
		}

		const user = await User.findOne({
			where: { id: payload.userId },
		});

		if (!user) {
			return { error: "User not found.", success: false };
		}

		// Convert to base64 if image exists
		let profileImage: string | undefined;
		if (user.profileImage && user.imageType) {
			profileImage = `data:${user.imageType};base64,${user.profileImage.toString("base64")}`;
		}

		return {
			accessibilitySettings: user.accessibilitySettings as Settings | undefined,
			imageType: user.imageType || undefined,
			profileImage,
			success: true,
			username: user.username,
		};
	} catch (err) {
		console.error("Get user data error:", err);
		return {
			error: "An unexpected error occurred while fetching user data.",
			success: false,
		};
	}
}

/**
 * Updates user profile image
 * @param token - Token of user whose info is being updated
 * @param imageBase64 - Base64 String of image being uploaded
 * @param imageType - Type of image being uploaded
 */
export async function updateProfileImage(
	token: string,
	imageBase64: string,
	imageType: string,
): Promise<LoginResult> {
	try {
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		const payload = verifyAccessToken(token);
		if (!payload || !payload.userId) {
			return { error: "Invalid authentication token.", success: false };
		}

		const user = await User.findOne({
			where: { id: payload.userId },
		});

		if (!user) {
			return { error: "User not found.", success: false };
		}

		// Convert base64 to buffer
		const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
		const imageBuffer = Buffer.from(base64Data, "base64");

		// Validate file size (e.g., 5MB limit) (again variable)
		const maxSize = 5 * 1024 * 1024;
		if (imageBuffer.length > maxSize) {
			return { error: "Image size must be less than 5MB.", success: false };
		}

		user.profileImage = imageBuffer;
		user.imageType = imageType;
		await user.save();

		return { success: true };
	} catch (err) {
		console.error("Update profile image error:", err);
		return {
			error: "An unexpected error occurred while updating profile image.",
			success: false,
		};
	}
}

/**
 *  Apply new accessibility settings to user account
 *  @param token - Token of user being edited
 *  @param settings - Settings being added to an account
 */
export async function updateAccessibilitySettings(
	token: string,
	settings: Settings,
): Promise<LoginResult> {
	try {
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}

		// Validate token
		const payload = verifyAccessToken(token);
		if (!payload || !payload.userId) {
			return { error: "Invalid authentication token.", success: false };
		}

		// Fetch user
		const user = await User.findOne({ where: { id: payload.userId } });
		if (!user) {
			return { error: "User not found.", success: false };
		}

		// Save settings
		user.accessibilitySettings = settings;
		await user.save();

		return { success: true };
	} catch (err) {
		console.error("Update settings error:", err);
		return {
			error: "Unexpected error occurred while saving settings.",
			success: false,
		};
	}
}
