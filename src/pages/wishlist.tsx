import "$styles/wishlist.css";
import WishListPageClient from "$components/wishlist-page-client";
import { isUserLoggedIn } from "$utils/auth";

interface WishlistPageProps {
	request: Request;
}

export function WishListPage({ request }: WishlistPageProps) {
	const loggedIn = isUserLoggedIn(request);

	return (
		<div id="root">
			<main>
				<div className="back-button-container">
					<a href="/" className="clear-a-stylings back-button">
						↩
					</a>
					<p>Back to home page</p>
				</div>

				<div className="wish-list-game-card-gallery">
					<WishListPageClient isLoggedIn={loggedIn} />
				</div>
			</main>
		</div>
	);
}
