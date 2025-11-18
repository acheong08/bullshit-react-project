import "./game-card.css";
import StarIcon from "$tmpimg/star.png";
//this is wish list game card  props for what will show up whe a game is added to the wishlist

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
	return (
		<a href={`/game/${props.gameId}`} className="wish-list-card">
			<img
				src={props.image}
				alt={props.title}
				className="wish-list-card-image"
			/>

			<div className="wish-list-card-info">
				<h3 className="wish-list-card-title">{props.title}</h3>

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
						<img
							src={props.ageImage}
							alt={props.ageRating}
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

			<button type="button" className="remove-button">
				Remove
			</button>
		</a>
	);
}
