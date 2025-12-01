import "$styles/wishlist.css";
import { WishListPageClient } from "$components/wishlist-page-client";

export function WishListPage() {
	return (
		<div id="root">
			<main>
				<div className="back-button-container">
					<a href="/" className="clear-a-stylings back-button" aria-label="Back to home page button">
						↩
					</a>
					<p>Back to home page</p>
				</div>

				<div className="wish-list-game-card-gallery">
					<WishListPageClient />
				</div>
			</main>
		</div>
	);
}
