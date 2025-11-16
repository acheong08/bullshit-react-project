"use server";

import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { generateAccessToken } from "./utils/jwt";
import { verifyPassword } from "./utils/password";

let serverCounter = 0;

export async function getServerCounter() {
	return serverCounter;
}

export async function updateServerCounter(change: number) {
	serverCounter += change;
}

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
				success: false,
				error: "Invalid username or password",
			};
		}

		// Verify password
		const isPasswordValid = await verifyPassword(password, user.passwordHash);

		if (!isPasswordValid) {
			return {
				success: false,
				error: "Invalid username or password",
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
			success: false,
			error: "An error occurred during login. Please try again.",
		};
	}
}
