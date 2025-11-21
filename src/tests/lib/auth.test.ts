import { describe, expect, test } from "bun:test";
import { getAuthToken, getCurrentUser, isUserLoggedIn } from "$utils/auth";
import { generateAccessToken } from "$utils/jwt";

describe("getAuthToken", () => {
	test("should extract and verify valid token from cookie", () => {
		const userId = 123;
		const username = "testuser";
		const token = generateAccessToken(userId, username);

		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${token}`,
			},
		});

		const decoded = getAuthToken(request);

		expect(decoded).not.toBeNull();
		expect(decoded?.userId).toBe(userId);
		expect(decoded?.username).toBe(username);
	});

	test("should return null when no cookie header present", () => {
		const request = new Request("http://localhost");

		const decoded = getAuthToken(request);

		expect(decoded).toBeNull();
	});

	test("should return null when authToken cookie is missing", () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: "otherCookie=value",
			},
		});

		const decoded = getAuthToken(request);

		expect(decoded).toBeNull();
	});

	test("should return null for invalid token in cookie", () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: "authToken=invalid.token.here",
			},
		});

		const decoded = getAuthToken(request);

		expect(decoded).toBeNull();
	});

	test("should handle multiple cookies and extract authToken", () => {
		const token = generateAccessToken(1, "user");
		const request = new Request("http://localhost", {
			headers: {
				cookie: `session=abc123; authToken=${token}; theme=dark`,
			},
		});

		const decoded = getAuthToken(request);

		expect(decoded).not.toBeNull();
		expect(decoded?.userId).toBe(1);
	});
});

describe("isUserLoggedIn", () => {
	test("should return true for valid token", () => {
		const token = generateAccessToken(1, "testuser");
		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${token}`,
			},
		});

		expect(isUserLoggedIn(request)).toBe(true);
	});

	test("should return false when no token present", () => {
		const request = new Request("http://localhost");

		expect(isUserLoggedIn(request)).toBe(false);
	});

	test("should return false for invalid token", () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: "authToken=invalid.token",
			},
		});

		expect(isUserLoggedIn(request)).toBe(false);
	});
});

describe("getCurrentUser", () => {
	test("should return user info from valid token", () => {
		const userId = 42;
		const username = "johndoe";
		const token = generateAccessToken(userId, username);

		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${token}`,
			},
		});

		const user = getCurrentUser(request);

		expect(user).not.toBeNull();
		expect(user?.userId).toBe(userId);
		expect(user?.username).toBe(username);
	});

	test("should return null when no token present", () => {
		const request = new Request("http://localhost");

		const user = getCurrentUser(request);

		expect(user).toBeNull();
	});

	test("should return null for invalid token", () => {
		const request = new Request("http://localhost", {
			headers: {
				cookie: "authToken=bad.token.value",
			},
		});

		const user = getCurrentUser(request);

		expect(user).toBeNull();
	});

	test("should return only userId and username, not other token fields", () => {
		const token = generateAccessToken(99, "specificuser");

		const request = new Request("http://localhost", {
			headers: {
				cookie: `authToken=${token}`,
			},
		});

		const user = getCurrentUser(request);

		expect(user).not.toBeNull();
		expect(Object.keys(user || {}).sort()).toEqual(["userId", "username"]);
	});
});
