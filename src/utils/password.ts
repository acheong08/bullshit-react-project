import bcrypt from "bcrypt";

// Number of salt rounds for bcrypt (higher = more secure but slower)
// 10 is a good balance for most applications
const SALT_ROUNDS = 10;

// Password validation requirements
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

/**
 * Validates password strength requirements
 * @param password - The password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePassword(password: string): {
	isValid: boolean;
	error?: string;
} {
	if (!password) {
		return { error: "Password is required", isValid: false };
	}

	if (password.length < MIN_PASSWORD_LENGTH) {
		return {
			error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
			isValid: false,
		};
	}

	if (password.length > MAX_PASSWORD_LENGTH) {
		return {
			error: `Password must be no more than ${MAX_PASSWORD_LENGTH} characters long`,
			isValid: false,
		};
	}

	// Add more validation rules as needed (uppercase, lowercase, numbers, special chars, etc.)
	// Example: Check for at least one uppercase, one lowercase, one number
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);

	if (!hasUpperCase || !hasLowerCase || !hasNumber) {
		return {
			error:
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			isValid: false,
		};
	}

	return { isValid: true };
}

/**
 * Hashes a plain text password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
	try {
		const salt = await bcrypt.genSalt(SALT_ROUNDS);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (_error) {
		throw new Error("Failed to hash password");
	}
}

/**
 * Verifies a plain text password against a bcrypt hash
 * @param password - The plain text password to verify
 * @param hash - The bcrypt hash to compare against
 * @returns Promise that resolves to true if password matches, false otherwise
 */
export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	try {
		return await bcrypt.compare(password, hash);
	} catch (_error) {
		throw new Error("Failed to verify password");
	}
}
