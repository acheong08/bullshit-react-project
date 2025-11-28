import "$styles/game-card.css";

const StarIcon = "/images/star.png";

export type GameCardProps = {
	image: string;
	title: string;
	genres: string[];
	rating: number;
	gameId: string;
};

export default function GameCard(props: GameCardProps) {
	// Turn genres list into readable text for screen readers
	const genreText = props.genres.join(", ");

	// Build the full accessible label
	const ariaLabel = `to game page. Game card: image:${props.title}. Title: ${props.title}. Genres: ${genreText}. Rating: ${props.rating} stars. `;

	return (
		<a
			href={`/game/${props.gameId}`}
			className="game-card"
			aria-label={ariaLabel}
		>
			{/* Decorative image, so hide from screen readers */}
			<img
				src={props.image}
				alt={props.title}
				aria-hidden="true"
				className="game-card-image"
			/>

			{/* Hide visible title from screen reader because aria-label already includes it */}
			<h3>{props.title}</h3>

			{/* Hide genre list from screen readers too */}
			<p className="game-card-genres" aria-hidden="true">
				{props.genres.map((genre) => (
					<span key={genre} className="genre-item">
						{genre}
					</span>
				))}
			</p>

			{/* Hide rating text because it's included in aria-label */}
			<p className="game-card-rating" aria-hidden="true">
				Rating: {props.rating}{" "}
				<img src={StarIcon} alt="" aria-hidden="true" className="star-icon" />
			</p>
		</a>
	);
}
