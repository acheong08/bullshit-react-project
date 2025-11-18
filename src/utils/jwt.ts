import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import ms from "ms";

// JWT configuration
const JWT_SECRET =
	process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRY = ms((process.env.JWT_EXPIRY || "7d") as StringValue);

export interface TokenPayload {
	userId: number;
	username: string;
}

export interface DecodedToken extends TokenPayload {
	iat: number;
	exp: number;
}

export function generateAccessToken(userId: number, username: string): string {
	const payload: TokenPayload = {
		userId,
		username,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRY,
	});
}

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
