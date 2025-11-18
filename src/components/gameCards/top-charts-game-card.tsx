import "./game-card.css";
import StarIcon from "$tmpimg/star.png";
// this is props for the top chart games that will be on the home page-top charts section / new this week section
export type TopChartsGameCardProps = {
	rank: number;
	image: string;
	title: string;
	genres: string[];
	rating: number;
	tags: string[];
	gameId: string;
};

export default function TopChartsGameCard(props: TopChartsGameCardProps) {
	return (
		<a href={`/game/${props.gameId}`} className="top-charts-card">
			<div className="top-charts-card-left">
				<h2 className="top-charts-card-rank">{props.rank}</h2>
			</div>

			<div className="top-charts-card-main">
				<img
					src={props.image}
					alt={props.title}
					className="top-charts-card-image"
				/>

				<div className="top-charts-card-info">
					<div className="top-charts-card-title-rating">
						<h3 className="top-charts-card-title">{props.title}</h3>
						<p className="top-charts-card-rating">
							{props.rating}{" "}
							<img src={StarIcon} alt="Star" className="top-charts-star-icon" />
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
