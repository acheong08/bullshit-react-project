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
const SamuraiImage1 = "/images/samurai_preview_image.png";
const StrategyIcon = "/images/strategy-image.png";

import GameCard from "$components/gameCards/game-card";
import PopularGameCard from "$components/gameCards/popular-game-card";
import SpotlightGameCard from "$components/gameCards/spotlight-game-card";
import "$styles/home.css";
import FiltersBar from "$components/filtersbar";
import CategoriesCard from "$components/gameCards/category-card";
import TopChartsGameCard from "$components/gameCards/top-charts-game-card";
import Pagination from "$components/pagination";
import { SearchBar } from "$components/searchbar";

type CategoryView =
	| "recommended"
	| "top-charts"
	| "categories"
	| "new-this-week";

interface SearchBarProps {
	sortOptions: string[];
	filterOptions: Map<string, string[]>;
}

export function HomePage({ sortOptions, filterOptions }: SearchBarProps) {
	const [activeView, setActiveView] = useState<CategoryView>("recommended");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<string>("all");
	const [selectedDisability, setSelectedDisability] = useState<string>("all");

	return (
		<div id="root">
			<main>
				<SearchBar sortOptions={sortOptions} filterOptions={filterOptions} />
				{/* spotlight which is on every version of the home page */}
				<div className="spotlight-section">
					<div aria-live="assertive">
						<h1 className="spotlight-header">SPOTLIGHT</h1>
					</div>
					<div className="spotlight">
						<SpotlightGameCard
							videoUrl="https://www.youtube.com/embed/gwWiB1C-KBM?si=GbaBQVJqFx8W_R2J"
							title="Samurai Showdown R"
							genres={["Role Playing", "MMORPG"]}
							tag="Dexterity Impairments"
							imagePreview={[
								SamuraiImage1,
								SamuraiImage1,
								SamuraiImage1,
								SamuraiImage1,
							]}
							gameId="123"
						/>
					</div>
				</div>

				<div className="category-bar">
					<div className="category-header-row">
						<h2 className="category-title">CATEGORIES</h2>
					</div>

					<div
						className="category-tabs"
						role="tablist"
						aria-label="Game category tabs"
					>
						<button
							className={`tab ${activeView === "recommended" ? "active" : ""}`}
							type="button"
							role="tab"
							id="tab-recommended"
							aria-selected={activeView === "recommended"}
							aria-controls="panel-recommended"
							onClick={() => setActiveView("recommended")}
						>
							Recommended for You
						</button>

						<button
							className={`tab ${activeView === "top-charts" ? "active" : ""}`}
							type="button"
							role="tab"
							id="tab-top-charts"
							aria-selected={activeView === "top-charts"}
							aria-controls="panel-top-charts"
							onClick={() => setActiveView("top-charts")}
						>
							Top Charts
						</button>

						<button
							className={`tab ${activeView === "categories" ? "active" : ""}`}
							type="button"
							role="tab"
							id="tab-categories"
							aria-selected={activeView === "categories"}
							aria-controls="panel-categories"
							onClick={() => setActiveView("categories")}
						>
							Categories
						</button>

						<button
							className={`tab ${activeView === "new-this-week" ? "active" : ""}`}
							type="button"
							role="tab"
							id="tab-new-this-week"
							aria-selected={activeView === "new-this-week"}
							aria-controls="panel-new-this-week"
							onClick={() => setActiveView("new-this-week")}
						>
							New this Week
						</button>
					</div>
				</div>

				{/* Tab panels */}
				<div
					role="tabpanel"
					id="panel-recommended"
					aria-labelledby="tab-recommended"
					hidden={activeView !== "recommended"}
				/>

				<div
					role="tabpanel"
					id="panel-top-charts"
					aria-labelledby="tab-top-charts"
					hidden={activeView !== "top-charts"}
				/>

				<div
					role="tabpanel"
					id="panel-categories"
					aria-labelledby="tab-categories"
					hidden={activeView !== "categories"}
				/>

				<div
					role="tabpanel"
					id="panel-new-this-week"
					aria-labelledby="tab-new-this-week"
					hidden={activeView !== "new-this-week"}
				/>

				{/* Visually hidden live region to announce active tab when focus leaves the tabs */}
				<div
					aria-live="polite"
					aria-atomic="true"
					style={{
						height: "1px",
						left: "-9999px",
						overflow: "hidden",
						position: "absolute",
						width: "1px",
					}}
				>
					{`You are now on the ${activeView.replace("-", " ")} page`}
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
	selectedGenre,
	setSelectedGenre,
	selectedDisability,
	setSelectedDisability,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
}) {
	const gamesPerPage = 8;

	// Sample game data
	const allGames = Array(20)
		.fill(null)
		.map((_, i) => ({
			gameId: `${123 + i}`,
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: `Stardew Valley ${i + 1}`,
		}));

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);

	return (
		<>
			<div className="popular-games">
				<div className="image-card">
					<a
						href="/game/2"
						className="curators-pick-link"
						aria-label="Animals vs Aliens, Curators Pick game"
					>
						<img
							src={curatorsPick}
							alt="animals vs aliens mobile game icon"
							className="curators-pick"
						/>
						<div className="overlay-text">
							<p className="top-right">Animals vs Aliens</p>
							<p className="bottom-left">CURATORS PICK</p>
						</div>
					</a>
				</div>
				<section
					className="popular-games-gallery"
					aria-label="Popular Games Section"
				>
					<h2 className="popular-title">POPULAR</h2>
					<PopularGameCard
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						gameId="123"
					/>
					<PopularGameCard
						image={StardewValleyLogo}
						title="Hollow Knight"
						genres={["Action", "Adventure"]}
						gameId="124"
					/>
					<PopularGameCard
						image={StardewValleyLogo}
						title="Celeste"
						genres={["Platformer", "Indie"]}
						gameId="125"
					/>
				</section>
			</div>
			<div className="games-bar">
				<section className="games-row">
					<h2 className="games-title">ALL GAMES</h2>
				</section>
			</div>

			<FiltersBar
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				selectedDisability={selectedDisability}
				setSelectedDisability={setSelectedDisability}
			/>

			<section
				className="game-card-gallery"
				aria-label={`${currentGames.length} games displayed`}
			>
				{currentGames.map((game) => (
					<GameCard
						key={game.gameId}
						image={game.image}
						title={game.title}
						genres={game.genres}
						rating={game.rating}
						gameId={game.gameId}
					/>
				))}
			</section>

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
	selectedGenre,
	setSelectedGenre,
	selectedDisability,
	setSelectedDisability,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
}) {
	const gamesPerPage = 8;

	// Sample game data
	const allGames = [
		{
			gameId: "101",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "102",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "103",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "104",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "105",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "106",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "107",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "108",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "109",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "110",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "111",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "112",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "113",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "114",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "115",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "116",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "117",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "118",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "119",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "120",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
	];

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
	return (
		<>
			<div className="top-charts-game-card-gallery">
				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={1}
					tags={["Epilepsy"]}
					gameId="204"
					context="top-charts"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={2}
					tags={["Epilepsy"]}
					gameId="204"
					context="top-charts"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={3}
					tags={["Epilepsy"]}
					gameId="204"
					context="top-charts"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={4}
					tags={["Epilepsy"]}
					gameId="204"
					context="top-charts"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={5}
					tags={["Epilepsy"]}
					gameId="204"
					context="top-charts"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={6}
					tags={["Epilepsy"]}
					gameId="204"
					context="top-charts"
				/>
			</div>

			<div className="games-bar">
				<div className="games-row">
					<h2 className="games-title">ALL GAMES</h2>
				</div>
			</div>
			<FiltersBar
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				selectedDisability={selectedDisability}
				setSelectedDisability={setSelectedDisability}
			/>

			<div className="game-card-gallery">
				{currentGames.map((game) => (
					<GameCard
						key={game.gameId}
						image={game.image}
						title={game.title}
						genres={game.genres}
						rating={game.rating}
						gameId={game.gameId}
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
	selectedGenre,
	setSelectedGenre,
	selectedDisability,
	setSelectedDisability,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
}) {
	const gamesPerPage = 8;

	// Sample game data
	const allGames = [
		{
			gameId: "101",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "102",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "103",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "104",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "105",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "106",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "107",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "108",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "109",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "110",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "111",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "112",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "113",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "114",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "115",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "116",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "117",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "118",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "119",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "120",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
	];

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
	return (
		<>
			<div className="category-gallery">
				<CategoriesCard image={ActionIcon} category="ACTION" />

				<CategoriesCard image={RPGIcon} category="RPG" />

				<CategoriesCard image={PuzzleIcon} category="PUZZLE" />

				<CategoriesCard image={RacingIcon} category="RACING" />

				<CategoriesCard image={SimulationIcon} category="SIMULATION" />

				<CategoriesCard image={StrategyIcon} category="STRATEGY" />

				<CategoriesCard image={BoardIcon} category="BOARD" />

				<CategoriesCard image={MultiplayerIcon} category="MULTIPLAYER" />
				<CategoriesCard image={CardsIcon} category="CARDS" />
			</div>

			<div className="games-bar">
				<div className="games-row">
					<h2 className="games-title">ALL GAMES</h2>
				</div>
			</div>
			<FiltersBar
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				selectedDisability={selectedDisability}
				setSelectedDisability={setSelectedDisability}
			/>

			<div className="game-card-gallery">
				{currentGames.map((game) => (
					<GameCard
						key={game.gameId}
						image={game.image}
						title={game.title}
						genres={game.genres}
						rating={game.rating}
						gameId={game.gameId}
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
	selectedGenre,
	setSelectedGenre,
	selectedDisability,
	setSelectedDisability,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedDisability: string;
	setSelectedDisability: (disability: string) => void;
}) {
	const gamesPerPage = 8;

	// Sample game data
	const allGames = [
		{
			gameId: "101",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "102",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "103",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "104",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "105",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "106",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "107",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "108",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "109",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "110",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "111",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "112",
			genres: ["Action", "Adventure"],
			image: StardewValleyLogo,
			rating: 4.8,
			title: "Hollow Knight",
		},
		{
			gameId: "113",
			genres: ["Platformer", "Indie"],
			image: StardewValleyLogo,
			rating: 4.7,
			title: "Celeste",
		},
		{
			gameId: "114",
			genres: ["Racing", "Sports"],
			image: StardewValleyLogo,
			rating: 4.5,
			title: "Racing Rivals",
		},
		{
			gameId: "115",
			genres: ["Puzzle", "Casual"],
			image: StardewValleyLogo,
			rating: 4.3,
			title: "Puzzle Quest",
		},
		{
			gameId: "116",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "117",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "118",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "119",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
		{
			gameId: "120",
			genres: ["Simulation", "RPG"],
			image: StardewValleyLogo,
			rating: 5,
			title: "Stardew Valley",
		},
	];

	const totalPages = Math.ceil(allGames.length / gamesPerPage);
	const indexOfLastGame = currentPage * gamesPerPage;
	const indexOfFirstGame = indexOfLastGame - gamesPerPage;
	const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
	return (
		<>
			<FiltersBar
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				selectedDisability={selectedDisability}
				setSelectedDisability={setSelectedDisability}
			/>

			<div className="top-charts-game-card-gallery">
				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={1}
					tags={["Epilepsy"]}
					gameId="204"
					context="new-this-week"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={2}
					tags={["Epilepsy"]}
					gameId="204"
					context="new-this-week"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={3}
					tags={["Epilepsy"]}
					gameId="204"
					context="new-this-week"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={4}
					tags={["Epilepsy"]}
					gameId="204"
					context="new-this-week"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={5}
					tags={["Epilepsy"]}
					gameId="204"
					context="new-this-week"
				/>

				<TopChartsGameCard
					image={StardewValleyLogo}
					title="Stardew Vally"
					genres={["Action", "RPG"]}
					rating={4.8}
					rank={6}
					tags={["Epilepsy"]}
					gameId="204"
					context="new-this-week"
				/>
			</div>

			<div className="game-card-gallery">
				{currentGames.map((game) => (
					<GameCard
						key={game.gameId}
						image={game.image}
						title={game.title}
						genres={game.genres}
						rating={game.rating}
						gameId={game.gameId}
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
