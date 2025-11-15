import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

// JWT configuration
const JWT_SECRET =
	process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRY: StringValue = "15m"; // 15 minutes default
const REFRESH_TOKEN_EXPIRY: StringValue = "7d"; // 7 days default

export interface TokenPayload {
	userId: number;
	username: string;
}

export interface DecodedToken extends TokenPayload {
	iat: number;
	exp: number;
}

/**
 * Generates a JWT access token for a user
 * @param userId - The user's ID
 * @param username - The user's username
 * @returns Signed JWT token
 */
export function generateAccessToken(userId: number, username: string): string {
	const payload: TokenPayload = {
		userId,
		username,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRY,
	});
}

/**
 * Generates a JWT refresh token for a user (optional, for refresh token flow)
 * @param userId - The user's ID
 * @param username - The user's username
 * @returns Signed JWT refresh token
 */
export function generateRefreshToken(userId: number, username: string): string {
	const payload: TokenPayload = {
		userId,
		username,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRY,
	});
}

/**
 * Verifies and decodes a JWT access token
 * @param token - The JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyAccessToken(token: string): DecodedToken {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
		return decoded;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error("Token has expired");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid token");
		}
		throw new Error("Token verification failed");
	}
}

/**
 * Decodes a JWT token without verifying the signature
 * Useful for reading token data when verification isn't needed
 * @param token - The JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): DecodedToken | null {
	try {
		const decoded = jwt.decode(token) as DecodedToken;
		return decoded;
	} catch {
		return null;
	}
}
