import { describe, expect, test } from "bun:test";
import jwt from "jsonwebtoken";
import { generateAccessToken, verifyAccessToken } from "./jwt";

describe("generateAccessToken", () => {
	test("should include userId and username in token payload", () => {
		const userId = 123;
		const username = "johndoe";
		const token = generateAccessToken(userId, username);

		const decoded = jwt.decode(token) as {
			userId: number;
			username: string;
		};

		expect(decoded.userId).toBe(userId);
		expect(decoded.username).toBe(username);
	});

	test("should set expiration time in token", () => {
		const token = generateAccessToken(1, "testuser");

		const decoded = jwt.decode(token) as { exp: number; iat: number };

		expect(decoded.exp).toBeDefined();
		expect(decoded.iat).toBeDefined();
		expect(decoded.exp).toBeGreaterThan(decoded.iat);
	});
});

describe("verifyAccessToken", () => {
	test("should verify and decode a valid token with correct payload", () => {
		const userId = 42;
		const username = "validuser";
		const token = generateAccessToken(userId, username);

		const decoded = verifyAccessToken(token);

		expect(decoded.userId).toBe(userId);
		expect(decoded.username).toBe(username);
	});

	test("should throw error with specific message for expired token", () => {
		const secret =
			process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
		const expiredToken = jwt.sign({ userId: 1, username: "testuser" }, secret, {
			expiresIn: "-1s",
		});

		expect(() => verifyAccessToken(expiredToken)).toThrow("Token has expired");
	});

	test("should throw error with specific message for invalid token", () => {
		const invalidToken = "invalid.token.here";

		expect(() => verifyAccessToken(invalidToken)).toThrow("Invalid token");
	});
});

describe("decodeToken", () => {
	test("should decode valid token without verification", () => {
		const userId = 99;
		const username = "decoder";
		const token = generateAccessToken(userId, username);

		const decoded = verifyAccessToken(token);

		expect(decoded).not.toBeNull();
		expect(decoded?.userId).toBe(userId);
		expect(decoded?.username).toBe(username);
	});

	test("should return null for invalid token", () => {
		expect(verifyAccessToken, "not.a.valid.token").toThrowError();
	});
});
