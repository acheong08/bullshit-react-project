import "$styles/game-card.css";

export type SpotlightCardProps = {
	videoUrl: string;
	title: string;
	genres: string[];
	tag: string;
	imagePreview: string[];
	gameId: string;
};

export default function SpotlightGameCard(props: SpotlightCardProps) {
	const genreText = props.genres.join(", ");
	const previewCount = props.imagePreview.length;

	const ariaLabel = `Spotlight game card: ${props.title}. Genres: ${genreText}. Tag: ${props.tag}. Contains video and ${previewCount} image preview${previewCount !== 1 ? "s" : ""}. Links to game page.`;

	return (
		<a
			href={`/game/${props.gameId}`}
			className="spotlight-game-card"
			aria-label={ariaLabel}
		>
			{/* Video Section */}
			<div className="spotlight-video">
				{/* Actual iframe */}
				<iframe
					width="100%"
					height="315"
					src={props.videoUrl}
					title={props.title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			</div>

			{/* Game Info Section */}
			<div className="spotlight-info">
				<div className="spotlight-info-link" aria-hidden="true">
					<h3 className="spotlight-card-title">{props.title}</h3>

					<div className="spotlight-genre-tag-row">
						<p className="spotlight-game-card-genres">
							{props.genres.map((genre) => (
								<span key={genre} className="spotlight-genre-item">
									{genre}
								</span>
							))}
						</p>
						<p className="spotlight-tag">{props.tag}</p>
					</div>
				</div>

				<div className="image-previews" aria-hidden="true">
					{props.imagePreview.map((img, index) => (
						<img
							key={`${props.gameId}-preview-${index}`}
							src={img}
							alt=""
							aria-hidden="true"
						/>
					))}
				</div>
			</div>
		</a>
	);
}
