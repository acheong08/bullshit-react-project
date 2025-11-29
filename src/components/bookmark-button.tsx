"use client";

import { useState } from "react";
import { addToLocalWishlist, isInLocalWishlist } from "$utils/wishlist";
import { addToWishlistAction } from "../action";

type BookmarkButtonProps = {
	gameId: string;
	isLoggedIn?: boolean;
};

export function BookmarkButton({
	gameId,
	isLoggedIn = false,
}: BookmarkButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(() => {
		// Check localStorage on initial render for immediate feedback
		if (typeof window !== "undefined") {
			return isInLocalWishlist(gameId);
		}
		return false;
	});

	const handleClick = async () => {
		if (isLoading) return;

		setIsLoading(true);
		console.log("Bookmark clicked for gameId:", gameId);

		if (isLoggedIn) {
			// User is logged in - use server action
			const result = await addToWishlistAction(Number(gameId));

			if (result.success) {
				setIsBookmarked(true);
				// Also add to localStorage for immediate UI feedback
				addToLocalWishlist(gameId);
				// Redirect to wishlist page
				window.location.href = "/wishlist";
			} else {
				console.error("Failed to add to wishlist:", result.error);
				// Fall back to localStorage
				addToLocalWishlist(gameId);
				window.location.href = "/wishlist";
			}
		} else {
			// Guest user - use localStorage
			addToLocalWishlist(gameId);
			// Redirect to wishlist page
			window.location.href = "/wishlist";
		}

		setIsLoading(false);
	};

	return (
		<button
			type="button"
			className="bookmark-btn"
			onClick={handleClick}
			disabled={isLoading}
		>
			{isLoading ? "Adding..." : isBookmarked ? "Bookmarked" : "Bookmark"}
		</button>
	);
}
