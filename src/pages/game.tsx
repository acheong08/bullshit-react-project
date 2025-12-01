import { instanceToPlain } from "class-transformer";
import { BookmarkButton } from "$components/bookmark-button";
import { MediaCarousel } from "$components/media-carousel";
import { ReportButton } from "$components/report-button";
import { ReviewsSection } from "$components/reviews-section";
import type { Game, GameMedia } from "$entity/Games";
import { GameAverageRating, LabelType } from "$entity/Games";
import { getGameById, getReviewsByGameId } from "$lib/db";
import { getCurrentUser, isUserLoggedIn } from "$utils/auth";

interface GamePageProps {
	gameId: string;
	request: Request;
}

// Type for serialized review data
type SerializedReview = {
	id: number;
	user: {
		username: string;
	};
	accessibilityRating: number;
	enjoyabilityRating: number;
	comment: string;
	createdAt: string;
};

export async function GamePage({ gameId, request }: GamePageProps) {
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

	// Fetch reviews for this game
	const reviews = await getReviewsByGameId(gameIdNumber);
	const serializedReviews = instanceToPlain(reviews) as SerializedReview[];

	// Check if user is logged in and get username
	const loggedIn = isUserLoggedIn(request);
	const currentUser = getCurrentUser(request);
	const currentUsername = currentUser?.username;

	const rating = await GameAverageRating.findOne({
		where: { gameId: game.id },
	});
	const averageRating = rating?.averageEnjoyabilityRating || 0;

	// Organize labels by type

	const accessibilityLabels =
		game.labels?.filter((label) => label.type === LabelType.Accessibility) ||
		[];

	const heroImage =
		game.media && game.media.length > 0
			? game.media[0].uri
			: "/placeholder-hero.jpg";

	return (
		<div id="root">
			<main className="game-page-main">
				{/* Hero Section */}
				<div
					className="game-hero"
					style={{
						backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${heroImage})`,
					}}
				>
					<div className="hero-content-wrapper">
						<div className="hero-details">
							<h1 className="game-title">{game.name}</h1>
							<div className="hero-stats">
								<div className="stat-group">
									<img src={heroImage} alt="Icon" className="game-icon-small" />
									<div className="stat-text">
										<span className="rating-score">
											{Number(averageRating || 0).toFixed(1)} ★
										</span>
										<span className="review-count">11.7K reviews</span>
									</div>
								</div>
								<div className="stat-divider" />
								<div className="stat-group">
									<span className="download-count">1M+</span>
									<span className="download-label">Downloads</span>
								</div>
								<div className="stat-divider" />
								<div className="pegi-badge">
									{game.labels
										.filter((l) => l.type === LabelType.IndustryRating)
										.pop()?.name || "No ratings"}
								</div>
							</div>
							<div className="hero-actions">
								<button type="button" className="install-btn">
									Install
								</button>
								<BookmarkButton gameId={gameId} isLoggedIn={loggedIn} />
								<ReportButton gameId={gameIdNumber} gameName={game.name} />
							</div>
						</div>
					</div>
				</div>

				<div className="game-content-container">
					{/* Media Section */}
					<div className="media-section">
						{game.media && game.media.length > 0 && (
							<MediaCarousel
								media={instanceToPlain(game.media) as GameMedia[]}
								gameName={game.name}
							/>
						)}
					</div>

					{/* About Section */}
					<div className="about-section">
						<h2>About the game</h2>
						<p className="game-description">
							{game.description ||
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sagittis vestibulum justo, eu commodo sapien finibus at. In elementum mattis suscipit. Nullam nec suscipit ligula."}
						</p>

						<section className="tags-container" aria-label="Game tags">
							{accessibilityLabels.map((label) => (
								<span key={label.id} className="game-tag">
									{label.name}
								</span>
							))}
						</section>

						<div className="meta-info">
							<div className="meta-item">
								<h3>Available on</h3>
								<p>
									{game.labels
										.filter((label) => label.type === LabelType.Platform)
										.map((label) => label.name)
										.join(", ")}
								</p>
							</div>
						</div>
					</div>

					{/* Ratings and Reviews Section */}
					<div className="reviews-section">
						<h2>Ratings and reviews</h2>
						<ReviewsSection
							reviews={serializedReviews}
							gameId={gameIdNumber}
							isLoggedIn={loggedIn}
							currentUsername={currentUsername}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
