"use server";

import { User } from "$entity/User";
import { generateAccessToken } from "$utils/jwt";
import { verifyPassword } from "$utils/password";
import { AppDataSource } from "./data-source";
import { updateGame, updateReportStatus, deleteGame } from "$lib/db";
import { ReportStatus } from "$entity/Report";

export interface LoginResult {
	success: boolean;
	token?: string;
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
	} catch (error) {
		console.error("Login error:", error);
		return {
			error: "An error occurred during login. Please try again.",
			success: false,
		};
	}
}

//Admin Panel stuff
/**
 * Server action to update a game's details
 * @param gameId - The ID of the game to update
 * @param data - Object containing name, description, and imageUri
 * @returns Object with success boolean
 */
export async function updateGameAction(
	gameId: number,
	data: { name: string; description: string; imageUri: string }
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
	status: ReportStatus
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
	} catch (error) {
		console.error("Error deleting game:", error);
		return { success: false };
	}
}

