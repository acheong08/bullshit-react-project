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
	return (
		<div className="wish-list-card">
			<a href={`/game/${props.gameId}`}>
				<img
					src={props.image}
					alt={props.title}
					className="wish-list-card-image"
				/>
			</a>

			<div className="wish-list-card-info">
				<div className="wish-list-card-header">
					<a href={`/game/${props.gameId}`}>
						<h3 className="wish-list-card-title">{props.title}</h3>
					</a>
				</div>

				<div className="wish-list-downloads-age">
					<div className="wish-list-rating-reviews">
						<p className="wish-list-card-rating">
							{props.rating}{" "}
							<img src={StarIcon} alt="Star" className="wish-list-star-icon" />
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
		</div>
	);
}
