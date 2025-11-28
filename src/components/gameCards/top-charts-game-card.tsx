import "$styles/game-card.css";

const StarIcon = "/images/star.png";

export type TopChartsGameCardProps = {
	rank: number;
	image: string;
	title: string;
	genres: string[];
	rating: number;
	tags: string[];
	gameId: string;
	context?: "top-charts" | "new-this-week";
};

export default function TopChartsGameCard(props: TopChartsGameCardProps) {
	const genreText = props.genres.join(", ");
	const tagText = props.tags.join(", ");
	const contextLabel =
		props.context === "new-this-week"
			? "New this week game card"
			: "Top charts game card";

	const ariaLabel = `${contextLabel}, rank ${props.rank}. Image: ${props.title} icon, Title: ${props.title}. Rating: ${props.rating} stars. Genres: ${genreText}. Tags: ${tagText}. Links to game page.`;

	return (
		<a
			href={`/game/${props.gameId}`}
			className="top-charts-card"
			aria-label={ariaLabel}
		>
			{/* Rank */}
			<div className="top-charts-card-left" aria-hidden="true">
				<div className="top-charts-card-rank">{props.rank}</div>
			</div>

			{/* Main content */}
			<div className="top-charts-card-main">
				{/* Game image */}
				<img
					src={props.image}
					alt=""
					aria-hidden="true"
					className="top-charts-card-image"
				/>

				<div className="top-charts-card-info" aria-hidden="true">
					<div className="top-charts-card-title-rating">
						<div className="top-charts-card-title">{props.title}</div>
						<p className="top-charts-card-rating">
							{props.rating}{" "}
							<img
								src={StarIcon}
								alt=""
								aria-hidden="true"
								className="top-charts-star-icon"
							/>
						</p>
					</div>

					<p className="top-charts-card-genres">
						{props.genres.map((genre) => (
							<span key={genre} className="top-charts-genre-item">
								{genre}
							</span>
						))}
					</p>

					<div className="top-charts-tags-container">
						{props.tags.map((tag) => (
							<span key={tag} className="top-charts-card-tag">
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</a>
	);
}
