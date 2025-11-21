import { describe, expect, test } from "bun:test";
import {
	hashPassword,
	validatePassword,
	verifyPassword,
} from "$utils/password";

describe("validatePassword", () => {
	test("should accept valid password with all requirements", () => {
		const result = validatePassword("Password123");
		expect(result.isValid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	test("should reject empty password", () => {
		const result = validatePassword("");
		expect(result.isValid).toBe(false);
		expect(result.error).toBe("Password is required");
	});

	test("should reject password shorter than 8 characters", () => {
		const result = validatePassword("Pass1");
		expect(result.isValid).toBe(false);
		expect(result.error).toContain("at least 8 characters");
	});

	test("should reject password longer than 128 characters", () => {
		const longPassword = `${"A".repeat(129)}a1`;
		const result = validatePassword(longPassword);
		expect(result.isValid).toBe(false);
		expect(result.error).toContain("no more than 128 characters");
	});

	test("should reject password without uppercase letter", () => {
		const result = validatePassword("password123");
		expect(result.isValid).toBe(false);
		expect(result.error).toContain("uppercase letter");
	});

	test("should reject password without lowercase letter", () => {
		const result = validatePassword("PASSWORD123");
		expect(result.isValid).toBe(false);
		expect(result.error).toContain("lowercase letter");
	});

	test("should reject password without number", () => {
		const result = validatePassword("PasswordABC");
		expect(result.isValid).toBe(false);
		expect(result.error).toContain("number");
	});

	test("should accept password at minimum length with all requirements", () => {
		const result = validatePassword("Pass123w");
		expect(result.isValid).toBe(true);
	});
});

describe("password hashing workflow", () => {
	test("should hash and verify correct password", async () => {
		const password = "CorrectPassword123";
		const hash = await hashPassword(password);

		const isValid = await verifyPassword(password, hash);
		expect(isValid).toBe(true);
	});

	test("should reject incorrect password against hash", async () => {
		const password = "CorrectPassword123";
		const wrongPassword = "WrongPassword456";
		const hash = await hashPassword(password);

		const isValid = await verifyPassword(wrongPassword, hash);
		expect(isValid).toBe(false);
	});

	test("should be case sensitive when verifying", async () => {
		const password = "Password123";
		const hash = await hashPassword(password);

		const isValid = await verifyPassword("password123", hash);
		expect(isValid).toBe(false);
	});
});
