import "$styles/wishlist.css";
import WishListPageClient from "$components/wishlist-page-client";
import { isUserLoggedIn } from "$utils/auth";
import micIcon from "/images/darkmode-microphone.png";

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
				<div className="wishlist-bar">
					<div className="wishlist-row">
						<h1 className="wishlist-title">WISHLIST</h1>
						<button className="wishlist-dictate-btn" type="button">
							<img src={micIcon} alt="Microphone icon" className="icon" />
							<span>open games</span>
						</button>
					</div>
				</div>
				<div className="wish-list-game-card-gallery">
					<WishListPageClient isLoggedIn={loggedIn} />
				</div>
			</main>
		</div>
	);
}
