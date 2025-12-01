// Client-side wishlist utilities
// Uses localStorage for guest users, server actions for authenticated users

// ============================================
// LOCAL STORAGE FUNCTIONS (for guest users)
// ============================================

// Get all game IDs from localStorage wishlist
export function getLocalWishlist(): string[] {
	if (typeof window === "undefined") {
		return [];
	}

	const data = localStorage.getItem("wishlist");
	return data ? JSON.parse(data) : [];
}

// Add a game to the localStorage wishlist
export function addToLocalWishlist(gameId: string) {
	if (typeof window === "undefined") return;

	const wishlist = getLocalWishlist();
	if (!wishlist.includes(gameId)) {
		wishlist.push(gameId);
		localStorage.setItem("wishlist", JSON.stringify(wishlist));
		console.log("Added gameId to localStorage:", gameId);
	}
}

// Remove a game from the localStorage wishlist
export function removeFromLocalWishlist(gameId: string) {
	if (typeof window === "undefined") return;

	const wishlist = getLocalWishlist().filter((id) => id !== gameId);
	localStorage.setItem("wishlist", JSON.stringify(wishlist));
	console.log("Removed gameId from localStorage:", gameId);
}

// Check if a game is in the localStorage wishlist
export function isInLocalWishlist(gameId: string): boolean {
	if (typeof window === "undefined") return false;
	return getLocalWishlist().includes(gameId);
}

// Clear localStorage wishlist (useful after syncing to server)
export function clearLocalWishlist() {
	if (typeof window === "undefined") return;
	localStorage.removeItem("wishlist");
}

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// These will be gradually phased out
// ============================================

// Get all game IDs from wishlist (works on both client and server via cookies)
export function getWishlist(): string[] {
	if (typeof window === "undefined") {
		// Server-side: read from cookie header
		// This is more complex - for now return empty
		return [];
	}

	// Client-side: read from localStorage
	return getLocalWishlist();
}

// Add a game to the wishlist
export function addToWishlist(gameId: string) {
	addToLocalWishlist(gameId);
}

// Remove a game from the wishlist
export function removeFromWishlist(gameId: string) {
	removeFromLocalWishlist(gameId);
}

// Check if a game is already bookmarked
export function isBookmarked(gameId: string): boolean {
	return isInLocalWishlist(gameId);
}
