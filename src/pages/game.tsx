import { instanceToPlain } from "class-transformer";
import { MediaCarousel } from "$components/media-carousel";
import type { Game, GameMedia } from "$entity/Games";
import { LabelType } from "$entity/Games";
import { getGameById } from "$lib/db";

interface GamePageProps {
	gameId: string;
}

export async function GamePage({ gameId }: GamePageProps) {
	// Fetch the game data
	const gameIdNumber = Number.parseInt(gameId, 10);
	const game: Game | null = await getGameById(gameIdNumber);

	if (!game) {
		return (
			<div id="root">
				<main>
					<h1>Game Not Found</h1>
					<p>The game with ID {gameId} could not be found.</p>
				</main>
			</div>
		);
	}

	// Organize labels by type
	const platformLabels =
		game.labels?.filter((label) => label.type === LabelType.Platform) || [];
	const ratingLabels =
		game.labels?.filter((label) => label.type === LabelType.IndustryRating) ||
		[];
	const accessibilityLabels =
		game.labels?.filter((label) => label.type === LabelType.Accessibility) ||
		[];

	return (
		<div id="root">
			<main>
				<div className="game-page">
					<div className="game-header">
						<h1>{game.name}</h1>
					</div>

					<div className="game-content">
						{/* Media Carousel on the Left */}
						<div className="carousel-section">
							{game.media && game.media.length > 0 && (
								<MediaCarousel
									media={instanceToPlain(game.media) as GameMedia[]}
									gameName={game.name}
								/>
							)}
						</div>

						{/* Info Section on the Right */}
						<div className="game-info">
							<section className="info-section">
								<h2>Details</h2>
								<p>{game.description || "No description available"}</p>
							</section>

							{platformLabels.length > 0 && (
								<section className="info-section">
									<h3>Platforms</h3>
									<ul>
										{platformLabels.map((label) => (
											<li key={label.id}>{label.name}</li>
										))}
									</ul>
								</section>
							)}

							{ratingLabels.length > 0 && (
								<section className="info-section">
									<h3>Rating</h3>
									<ul>
										{ratingLabels.map((label) => (
											<li key={label.id}>{label.name}</li>
										))}
									</ul>
								</section>
							)}

							{accessibilityLabels.length > 0 && (
								<section className="info-section">
									<h3>Accessibility Features</h3>
									<ul>
										{accessibilityLabels.map((label) => (
											<li key={label.id}>{label.name}</li>
										))}
									</ul>
								</section>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
