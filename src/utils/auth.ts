import { type DecodedToken, verifyAccessToken } from "./jwt";

function parseCookies(cookieHeader: string | null): Record<string, string> {
	const cookies: Record<string, string> = {};
	if (!cookieHeader) return cookies;

	cookieHeader.split(";").forEach((cookie) => {
		const [name, value] = cookie.split("=").map((s) => s.trim());
		if (name && value) {
			cookies[name] = decodeURIComponent(value);
		}
	});

	return cookies;
}

/**
 * Extracts and verifies JWT token from request
 * @param request - The incoming HTTP request
 * @returns Decoded token payload if valid, null otherwise
 */
export function getAuthToken(request: Request): DecodedToken | null {
	const cookieHeader = request.headers.get("cookie");
	const cookies = parseCookies(cookieHeader);

	const token = cookies.authToken;

	if (!token) {
		return null;
	}

	try {
		return verifyAccessToken(token);
	} catch {
		return null;
	}
}

/**
 * Checks if user is logged in by verifying JWT token
 * @param request - The incoming HTTP request
 * @returns True if user has valid JWT token, false otherwise
 */
export function isUserLoggedIn(request: Request): boolean {
	return getAuthToken(request) !== null;
}

/**
 * Gets the current authenticated user's information from JWT
 * @param request - The incoming HTTP request
 * @returns User information from token or null if not authenticated
 */
export function getCurrentUser(request: Request): {
	userId: number;
	username: string;
} | null {
	const token = getAuthToken(request);

	if (!token) {
		return null;
	}

	return {
		userId: token.userId,
		username: token.username,
	};
}
