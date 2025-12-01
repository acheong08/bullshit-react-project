import "$styles/game-card.css";

const StarIcon = "/images/star.png";

export type WishListGameCardProps = {
	image: string;
	title: string;
	rating: number;
	reviews: string;
	tags: string[];
	downloads: string;
	ageRating: string;
	gameId: string;
	remove: () => void;
};

export default function WishListGameCard(props: WishListGameCardProps) {
	const tagText = props.tags.join(", ");

	const ariaLabel = `Wish list game card: image: ${props.title} icon, Title: ${props.title}. Rating: ${props.rating} stars. Reviews: ${props.reviews}. Downloads: ${props.downloads}. Age rating: ${props.ageRating}. Tags: ${tagText}. Links to game page.`;

	return (
		<div className="wish-list-card">
			<a href={`/game/${props.gameId}`}>
				<img
					src={props.image}
					alt={props.title}
					aria-hidden="true"
					className="wish-list-card-image"
				/>
			</a>

			{/* Main info section – hidden from screen readers */}
			<div className="wish-list-card-info" aria-hidden="true">
				<div className="wish-list-card-header">
					<a href={`/game/${props.gameId}`}>
						<h3 className="wish-list-card-title">{props.title}</h3>
					</a>
				</div>

				<div className="wish-list-downloads-age">
					<div className="wish-list-rating-reviews">
						<p className="wish-list-card-rating">
							{props.rating}{" "}
							<img
								src={StarIcon}
								alt="star icon"
								aria-hidden="true"
								className="wish-list-star-icon"
							/>
						</p>
						<p className="wish-list-Number-Of-Reviews">
							{props.reviews} reviews
						</p>
					</div>

					<p className="wish-list-Number-Of-Downloads">
						{props.downloads}
						<br />
						Downloads
					</p>

					<div className="wish-list-game-age-rating">
						<p>Rating</p>
						<p>{props.ageRating}</p>
					</div>
				</div>

				<div className="wish-list-tags-container">
					{props.tags.map((tag) => (
						<span key={tag} className="wish-list-card-tag">
							{tag}
						</span>
					))}
				</div>
				<button type="button" className="remove-button" onClick={props.remove}>
					Remove
				</button>
			</div>

			<button type="button" className="remove-button">
				Remove
			</button>
		</div>
	);
}
