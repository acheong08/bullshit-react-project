// Get all game IDs from wishlist (works on both client and server via cookies)
export function getWishlist(): string[] {
    if (typeof window === "undefined") {
        // Server-side: read from cookie header
        // This is more complex - for now return empty
        return [];
    }
    
    // Client-side: read from localStorage
    const data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
}

// Add a game to the wishlist
export function addToWishlist(gameId: string) {
    if (typeof window === "undefined") return;
    
    const wishlist = getWishlist();
    if (!wishlist.includes(gameId)) {
        wishlist.push(gameId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        console.log("Added gameId:", gameId, "New wishlist:", wishlist);
    }
}

// Remove a game from the wishlist
export function removeFromWishlist(gameId: string) {
    if (typeof window === "undefined") return;
    
    const wishlist = getWishlist().filter((id) => id !== gameId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    console.log("Removed gameId:", gameId);
}

// Check if a game is already bookmarked
export function isBookmarked(gameId: string): boolean {
    if (typeof window === "undefined") return false;
    return getWishlist().includes(gameId);
}