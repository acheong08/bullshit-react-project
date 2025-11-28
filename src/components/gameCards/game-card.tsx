import "$styles/game-card.css";

const StarIcon = "/images/star.png";

// this is props for the main game card component that will be on the home page and in search results
export type GameCardProps = {
	image: string;
	title: string;
	genres: string[];
	rating: number;
	gameId: string;
};

export default function GameCard(props: GameCardProps) {
	return (
		<a href={`/game/${props.gameId}`} className="game-card">
			<img src={props.image} alt={props.title} className="game-card-image" />

			<h3>{props.title}</h3>

			<p className="game-card-genres">
				{props.genres.map((genre) => (
					<span key={genre} className="genre-item">
						{genre}
					</span>
				))}
			</p>

			<p className="game-card-rating">
				Rating: {props.rating}{" "}
				<img src={StarIcon} alt="Star" className="star-icon" />
			</p>
		</a>
	);
}
