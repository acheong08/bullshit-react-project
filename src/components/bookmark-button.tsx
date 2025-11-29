"use client";

import { addToWishlist as addToWishlistStorage, isBookmarked } from "$utils/wishlist";

type BookmarkButtonProps = {
	gameId: string;
};

export function BookmarkButton({ gameId }: BookmarkButtonProps) {
	const handleClick = () => {
		console.log("Bookmark clicked for gameId:", gameId);
		addToWishlistStorage(gameId);
		
		// Redirect to wishlist page
		window.location.href = "/wishlist";
	};

	return (
		<button 
			type="button" 
			className="bookmark-btn"
			onClick={handleClick}
		>
			Bookmark
		</button>
	);
}           