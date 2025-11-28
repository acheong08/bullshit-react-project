import "$styles/game-card.css";

const StarIcon = "/images/star.png";

export type WishListGameCardProps = {
	image: string;
	title: string;
	rating: number;
	reviews: string;
	tags: string[];
	downloads: string;
	ageImage: string;
	ageRating: string;
	gameId: string;
};

export default function WishListGameCard(props: WishListGameCardProps) {
	const tagText = props.tags.join(", ");

	const ariaLabel = `Wish list game card: image: ${props.title} icon, Title: ${props.title}. Rating: ${props.rating} stars. Reviews: ${props.reviews}. Downloads: ${props.downloads}. Age rating: ${props.ageRating}. Tags: ${tagText}. Links to game page.`;

	return (
		<a
			href={`/game/${props.gameId}`}
			className="wish-list-card"
			aria-label={ariaLabel}
		>
			{/* Game image */}
			<img
				src={props.image}
				alt=""
				aria-hidden="true"
				className="wish-list-card-image"
			/>

			{/* Main info section – hidden from screen readers */}
			<div className="wish-list-card-info" aria-hidden="true">
				<h3 className="wish-list-card-title">{props.title}</h3>

				<div className="wish-list-downloads-age">
					<div className="wish-list-rating-reviews">
						<p className="wish-list-card-rating">
							{props.rating}{" "}
							<img
								src={StarIcon}
								alt=""
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
						<img
							src={props.ageImage}
							alt=""
							aria-hidden="true"
							className="wish-list-age-rating-icon"
						/>
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
			</div>

			{/* Remove button remains interactive but separate */}
			<button type="button" className="remove-button">
				Remove
			</button>
		</a>
	);
}
