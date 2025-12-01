"use client";
import { useState } from "react";

// Images from public directory - use direct paths
const ActionIcon = "/images/action-image.png";
const curatorsPick = "/images/animals-vs-aliens.png";
const BoardIcon = "/images/board-image.png";
const CardsIcon = "/images/cards-image.png";
const MultiplayerIcon = "/images/multiplayer-image.png";
const PuzzleIcon = "/images/puzzle-image.png";
const RacingIcon = "/images/racing-image.png";
const RPGIcon = "/images/rpg-image.png";
const SimulationIcon = "/images/Simulation-image.png";
const StardewValleyLogo = "/images/Stardew_Valley_image.png";
const StrategyIcon = "/images/strategy-image.png";

import GameCard from "$components/gameCards/game-card";
import PopularGameCard from "$components/gameCards/popular-game-card";
import SpotlightGameCard from "$components/gameCards/spotlight-game-card";
import "$styles/home.css";
import CategoriesCard from "$components/gameCards/category-card";
import TopChartsGameCard from "$components/gameCards/top-charts-game-card";
import Pagination from "$components/pagination";
import { SearchBar } from "$components/searchbar";
import {
	type Game,
	type GameAverageRating,
	type GameMedia,
	type Label,
	LabelType,
	MediaType,
} from "$entity/Games";

type CategoryView =
	| "recommended"
	| "top-charts"
	| "categories"
	| "new-this-week";

const SamuraiImage1 = "/images/samurai_preview_image.png";

interface HomePageProps {
	searchBarSortOptions: string[];
	searchBarFilterOptions: Map<string, string[]>;
	defaultQuery: string | null;
	spotlightGame: Game | null;
	popularGames: Game[];
	currentGames: Game[];
	topChartsGames: Game[];
	allRatings: GameAverageRating[];
}

export function HomePage({
	searchBarSortOptions: sortOptions,
	searchBarFilterOptions: filterOptions,
	defaultQuery,
	spotlightGame,
	popularGames,
	currentGames,
	topChartsGames,
	allRatings,
}: HomePageProps) {
	const [activeView, setActiveView] = useState<CategoryView>("recommended");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<string>("all");
	const [selectedDisability, setSelectedDisability] = useState<string>("all");

	const spotlightTitle = spotlightGame ? spotlightGame.name : "Samurai Saga";
	const spotlightGenres = spotlightGame
		? spotlightGame.labels
				.filter((label: Label) => label.type === LabelType.Genre)
				.map((label: Label) => label.name)
		: ["Action", "RPG"];
	const spotlightVideo = spotlightGame
		? spotlightGame.media.filter(
				(media: GameMedia) => media.type === MediaType.Video,
			)[0].uri
		: "https://www.youtube.com/embed/gwWiB1C-KBM?si=GbaBQVJqFx8W_R2J";
	const spotlightAccessibilityTags = spotlightGame
		? spotlightGame.labels
				.filter((label: Label) => label.type === LabelType.Accessibility)
				.map((label: Label) => label.name)
		: ["Epilepsy", "Colorblind"];
	const spotlightImages = spotlightGame
		? spotlightGame.media
				.filter((media: GameMedia) => media.type === MediaType.PreviewImg)
				.map((media: GameMedia) => media.uri)
		: [SamuraiImage1, SamuraiImage1, SamuraiImage1, SamuraiImage1];
	const spotlightId = spotlightGame ? spotlightGame.id.toString() : "1";

	return (
		<div id="root">
			<main>
				<SearchBar
					sortOptions={sortOptions}
					filterOptions={filterOptions}
					defaultQuery={defaultQuery}
				/>
				{/* spotlight which is on every version of the home page */}
				<div className="spotlight-section">
					<h1 className="spotlight-header">SPOTLIGHT</h1>
					<div className="spotlight">
						<SpotlightGameCard
							videoUrl={spotlightVideo}
							title={spotlightTitle}
							genres={spotlightGenres}
							accessibilityTags={spotlightAccessibilityTags}
							imagePreview={spotlightImages}
							gameId={spotlightId}
						/>
					</div>
				</div>

				<div className="category-bar">
					<div className="category-header-row">
						<h2 className="category-title">CATEGORIES</h2>
					</div>
					{/* category tabs for s=switching between secstions of the home page e.g. top charts, categories etc */}
					<nav className="category-tabs">
						<button
							className={`tab ${activeView === "recommended" ? "active" : ""}`}
							type="button"
							onClick={() => setActiveView("recommended")}
						>
							Recommended for You
						</button>
						<button
							className={`tab ${activeView === "top-charts" ? "active" : ""}`}
							type="button"
							onClick={() => setActiveView("top-charts")}
						>
							Top Charts
						</button>
						<button
							className={`tab ${activeView === "categories" ? "active" : ""}`}
							type="button"
							onClick={() => setActiveView("categories")}
						>
							Categories
						</button>
						<button
							className={`tab ${activeView === "new-this-week" ? "active" : ""}`}
							type="button"
							onClick={() => setActiveView("new-this-week")}
						>
							New this Week
						</button>
					</nav>
				</div>

				{/* Conditional rendering based on active view */}
				{activeView === "recommended" && (
					<RecommendedView
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						selectedGenre={selectedGenre}
						setSelectedGenre={setSelectedGenre}
						selectedDisability={selectedDisability}
						setSelectedDisability={setSelectedDisability}
						popularGameCards={popularGames}
						allGames={currentGames}
						allRatings={allRatings}
					/>
				)}

				{activeView === "top-charts" && (
					<TopChartsView
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						selectedGenre={selectedGenre}
						setSelectedGenre={setSelectedGenre}
						selectedDisability={selectedDisability}
						setSelectedDisability={setSelectedDisability}
						allGames={currentGames}
						topChartsGames={topChartsGames}
						allRatings={allRatings}
					/>
				)}

				{activeView === "categories" && (
					<CategoriesView
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						selectedGenre={selectedGenre}
						setSelectedGenre={setSelectedGenre}
						selectedDisability={selectedDisability}
						setSelectedDisability={setSelectedDisability}
						allGames={currentGames}
						allRatings={allRatings}
					/>
				)}

				{activeView === "new-this-week" && (
					<NewThisWeekView
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						selectedGenre={selectedGenre}
						setSelectedGenre={setSelectedGenre}
						selectedDisability={selectedDisability}
						setSelectedDisability={setSelectedDisability}
						allGames={currentGames}
						topChartsGames={topChartsGames}
						allRatings={allRatings}
					/>
				)}
			</main>
		</div>
	);
}

// Recommended View (the current layout when page loads)
function RecommendedView({
	currentPage,
	setCurrentPage,
	popularGameCards,
	allGames,
	allRatings,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
	popularGameCards: Game[];
	allGames: Game[];
	allRatings: GameAverageRating[];
}) {
	const gamesPerPage = 8;

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);

	return (
		<>
			<div className="popular-games">
				<div className="image-card">
					<img
						src={curatorsPick}
						alt="animals vs aliens mobile game icon"
						className="curators-pick"
					/>
					<div className="overlay-text">
						<p className="top-right">Animals vs Aliens</p>
						<p className="bottom-left">CURATORS PICK</p>
					</div>
				</div>
				<div className="popular-games-gallery">
					<p className="popular-title">POPULAR</p>
					{popularGameCards.map((game) => (
						<PopularGameCard
							key={game.id}
							image={
								game.media.filter(
									(m: GameMedia) => m.type === MediaType.Icon,
								)[0]?.uri || StardewValleyLogo
							}
							title={game.name}
							genres={
								game.labels
									?.filter((label: Label) => label.type === LabelType.Genre)
									?.map((label: Label) => label.name) || []
							}
							gameId={game.id.toString()}
						/>
					))}
				</div>
			</div>
			<div className="games-bar">
				<div className="games-row">
					<h2 className="games-title">ALL GAMES</h2>
				</div>
			</div>

			<div className="game-card-gallery">
				{currentGames.map((game) => {
					return (
						<GameCard
							key={game.id}
							image={
								game.media.filter(
									(m: GameMedia) => m.type === MediaType.Icon,
								)[0]?.uri || StardewValleyLogo
							}
							title={game.name}
							genres={game.labels
								.filter((label: Label) => label.type === LabelType.Genre)
								.map((label: Label) => label.name)}
							rating={Number(
								Number(
									allRatings.find((rating) => rating.gameId === game.id)
										?.averageEnjoyabilityRating || 0,
								).toFixed(1),
							)}
							gameId={game.id.toString()}
						/>
					);
				})}
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</>
	);
}

// Top Charts View
function TopChartsView({
	currentPage,
	setCurrentPage,
	allGames,
	topChartsGames,
	allRatings,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
	allGames: Game[];
	topChartsGames: Game[];
	allRatings: GameAverageRating[];
}) {
	const gamesPerPage = 8;

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
	return (
		<>
			<div className="top-charts-game-card-gallery">
				{topChartsGames.map((game, index) => (
					<TopChartsGameCard
						key={game.id}
						image={
							game.media.filter((m: GameMedia) => m.type === MediaType.Icon)[0]
								?.uri || StardewValleyLogo
						}
						title={game.name}
						genres={
							game.labels
								?.filter((label: Label) => label.type === LabelType.Genre)
								?.map((label: Label) => label.name) || []
						}
						rating={Number(
							Number(
								allRatings.find((rating) => rating.gameId === game.id)
									?.averageEnjoyabilityRating || 0,
							).toFixed(1),
						)}
						rank={index + 1}
						tags={
							game.labels
								?.filter(
									(label: Label) => label.type === LabelType.Accessibility,
								)
								?.map((label: Label) => label.name) || []
						}
						gameId={game.id.toString()}
					/>
				))}
			</div>

			<div className="games-bar">
				<div className="games-row">
					<h2 className="games-title">ALL GAMES</h2>
				</div>
			</div>
			<div className="game-card-gallery">
				{currentGames.map((game) => (
					<GameCard
						key={game.id}
						image={
							game.media.filter((m: GameMedia) => m.type === MediaType.Icon)[0]
								?.uri || StardewValleyLogo
						}
						title={game.name}
						genres={game.labels
							.filter((label: Label) => label.type === LabelType.Genre)
							.map((label: Label) => label.name)}
						rating={Number(
							Number(
								allRatings.find((rating) => rating.gameId === game.id)
									?.averageEnjoyabilityRating || 0,
							).toFixed(1),
						)}
						gameId={game.id.toString()}
					/>
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</>
	);
}

// Categories View
function CategoriesView({
	currentPage,
	setCurrentPage,
	allGames,
	allRatings,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
	allGames: Game[];
	allRatings: GameAverageRating[];
}) {
	const gamesPerPage = 8;

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
	return (
		<>
			<div className="category-gallery">
				<CategoriesCard
					image={ActionIcon}
					category="ACTION"
					link="/search?query=&filters=Action&sort="
				/>

				<CategoriesCard
					image={RPGIcon}
					category="RPG"
					link="/search?query=&filters=RPG&sort="
				/>

				<CategoriesCard
					image={PuzzleIcon}
					category="PUZZLE"
					link="/search?query=&filters=Puzzle&sort="
				/>

				<CategoriesCard
					image={RacingIcon}
					category="RACING"
					link="/search?query=&filters=Racing&sort="
				/>

				<CategoriesCard
					image={SimulationIcon}
					category="SIMULATION"
					link="/search?query=&Simulation&sort="
				/>

				<CategoriesCard
					image={StrategyIcon}
					category="STRATEGY"
					link="/search?query=&filters=Strategy&sort="
				/>

				<CategoriesCard
					image={BoardIcon}
					category="BOARD"
					link="/search?query=&filters=Board&sort="
				/>

				<CategoriesCard
					image={MultiplayerIcon}
					category="MULTIPLAYER"
					link="/search?query=&filters=Multiplayer&sort="
				/>
				<CategoriesCard
					image={CardsIcon}
					category="CARDS"
					link="/search?query=&filters=Cards&sort="
				/>
			</div>

			<div className="games-bar">
				<div className="games-row">
					<h2 className="games-title">ALL GAMES</h2>
				</div>
			</div>
			<div className="game-card-gallery">
				{currentGames.map((game) => (
					<GameCard
						key={game.id}
						image={
							game.media.filter((m: GameMedia) => m.type === MediaType.Icon)[0]
								?.uri || StardewValleyLogo
						}
						title={game.name}
						genres={game.labels
							.filter((label: Label) => label.type === LabelType.Genre)
							.map((label: Label) => label.name)}
						rating={Number(
							Number(
								allRatings.find((rating) => rating.gameId === game.id)
									?.averageEnjoyabilityRating || 0,
							).toFixed(1),
						)}
						gameId={game.id.toString()}
					/>
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</>
	);
}

// New This Week View
function NewThisWeekView({
	currentPage,
	setCurrentPage,
	allGames,
	topChartsGames,
	allRatings,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
	allGames: Game[];
	topChartsGames: Game[];
	allRatings: GameAverageRating[];
}) {
	const gamesPerPage = 8;

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
	return (
		<>
			<div className="top-charts-game-card-gallery">
				{topChartsGames.map((game, index) => (
					<TopChartsGameCard
						key={game.id}
						image={
							game.media.filter((m: GameMedia) => m.type === MediaType.Icon)[0]
								?.uri || StardewValleyLogo
						}
						title={game.name}
						genres={
							game.labels
								?.filter((label: Label) => label.type === LabelType.Genre)
								?.map((label: Label) => label.name) || []
						}
						rating={Number(
							Number(
								allRatings.find((rating) => rating.gameId === game.id)
									?.averageEnjoyabilityRating || 0,
							).toFixed(1),
						)}
						rank={index + 1}
						tags={
							game.labels
								?.filter(
									(label: Label) => label.type === LabelType.Accessibility,
								)
								?.map((label: Label) => label.name) || []
						}
						gameId={game.id.toString()}
					/>
				))}
			</div>

			<div className="game-card-gallery">
				{currentGames.map((game) => (
					<GameCard
						key={game.id}
						image={
							game.media.filter((m: GameMedia) => m.type === MediaType.Icon)[0]
								?.uri || StardewValleyLogo
						}
						title={game.name}
						genres={game.labels
							.filter((label: Label) => label.type === LabelType.Genre)
							.map((label: Label) => label.name)}
						rating={Number(
							Number(
								allRatings.find((rating) => rating.gameId === game.id)
									?.averageEnjoyabilityRating || 0,
							).toFixed(1),
						)}
						gameId={game.id.toString()}
					/>
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</>
	);
}
