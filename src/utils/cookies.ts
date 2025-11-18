/**
 * Cookie utility functions using the Cookie Store API
 * Assumes modern browser support
 */

export interface CookieOptions {
	path?: string;
	maxAge?: number;
	sameSite?: "strict" | "lax" | "none";
}

/**
 * Set a cookie using the Cookie Store API
 */
export async function setCookie(
	name: string,
	value: string,
	options: CookieOptions = {},
): Promise<void> {
	const { path = "/", maxAge, sameSite = "strict" } = options;

	await cookieStore.set({
		expires: maxAge ? Date.now() + maxAge * 1000 : undefined,
		name,
		path,
		sameSite,
		value,
	});
}

/**
 * Get a cookie value using the Cookie Store API
 */
export async function getCookie(name: string): Promise<string | null> {
	const cookie = await cookieStore.get(name);
	return cookie?.value ?? null;
}

/**
 * Delete a cookie using the Cookie Store API
 */
export async function deleteCookie(name: string): Promise<void> {
	await cookieStore.delete(name);
}
