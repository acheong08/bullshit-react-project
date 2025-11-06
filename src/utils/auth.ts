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

// This is a placeholder using isLoggedIn=true cookie before JWT implementation
export function isUserLoggedIn(request: Request): boolean {
	const cookieHeader = request.headers.get("cookie");
	const cookies = parseCookies(cookieHeader);

	return cookies.isLoggedIn === "true";
}
