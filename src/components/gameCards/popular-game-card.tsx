import "$styles/game-card.css";

export type PopularGameCardProps = {
	image: string;
	title: string;
	genres: string[];
	gameId: string;
};

export default function PopularGameCard(props: PopularGameCardProps) {
	const genreText = props.genres.join(", ");

	const ariaLabel = `Popular game card: image: ${props.title} icon. Title: ${props.title}. Genres: ${genreText}. Links to game page.`;

	return (
		<a
			href={`/game/${props.gameId}`}
			className="popular-game-card"
			aria-label={ariaLabel}
		>
			<img
				src={props.image}
				alt=""
				aria-hidden="true"
				className="popular-game-card-image"
			/>

			<div className="popular-game-card-content">
				<h3 className="popular-game-card-title">{props.title}</h3>

				<p className="popular-game-card-genres" aria-hidden="true">
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
