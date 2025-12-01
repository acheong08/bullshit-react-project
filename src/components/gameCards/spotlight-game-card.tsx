import "$styles/game-card.css";

export type SpotlightCardProps = {
	videoUrl: string;
	title: string;
	genres: string[];
	accessibilityTags: string[];
	imagePreview: string[];
	gameId: string;
};

export default function SpotlightGameCard(props: SpotlightCardProps) {
	const accessibilityTags = props.accessibilityTags.slice(0, 2);

	return (
		<a href={`/game/${props.gameId}`} className="spotlight-game-card">
			{/* Video Section */}
			<div className="spotlight-video">
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
				<div className="spotlight-info-link">
					<h3 className="spotlight-card-title">{props.title}</h3>
					<div className="spotlight-genre-tag-row">
						<p className="spotlight-game-card-genres">
							{props.genres.map((genre) => (
								<span key={genre} className="spotlight-genre-item">
									{genre}
								</span>
							))}
						</p>
						<p className="spotlight-game-card-genres">
							{accessibilityTags.map((tag) => (
								<span key={tag} className="spotlight-tag-item">
									{tag}
								</span>
							))}
						</p>
					</div>
				</div>

				{/* Image Previews */}
				<div className="image-previews">
					{props.imagePreview.map((img, index) => (
						<img
							key={`${props.gameId}-preview-${index}`}
							src={img}
							alt={`${props.title} preview ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</a>
	);
}
