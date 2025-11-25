import "./game-card.css";

// these are props for poplur games on the home page recommend section
export type PopularGameCardProps = {
	image: string;
	title: string;
	genres: string[];
	gameId: string;
};

export default function PopularGameCard(props: PopularGameCardProps) {
	return (
		<a href={`/game/${props.gameId}`} className="popular-game-card">
			<img
				src={props.image}
				alt={props.title}
				className="popular-game-card-image"
			/>

			<div className="popular-game-card-content">
				<h3>{props.title}</h3>

				<p className="popular-game-card-genres">
					{props.genres.map((genre) => (
						<span key={genre} className="genre-item">
							{genre}
						</span>
					))}
				</p>
			</div>
		</a>
	);
}
