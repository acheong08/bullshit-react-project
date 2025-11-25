"use client";
import GameCard from "$components/gameCards/game-card";
import { SearchBar } from "$components/searchbar";
import StardewValleyLogo from "$tmpimg/Stardew_Valley_image.png";

interface SearchPageProps {
	params: Record<string, string>;
}

export function SearchPage({ params }: SearchPageProps) {
	const query = params.query;

	return (
		<>
			<SearchBar />
			<div className="overall-container center">
				<div className="alignment-container">
					<div className="flex back-button-container">
						<a href="/" className="clear-a-stylings back-button">
							↩
						</a>
						<p>Back to home page</p>
					</div>
					<div className="flex">
						<h1 className="query-header center">
							Search results for '{query}'
						</h1>
					</div>

					<div className="game-card-gallery">
						{Array.from({ length: 20 }).map((_, _index) => (
							<GameCard
								image={StardewValleyLogo}
								title="Stardew Valley"
								genres={["Simulation", "RPG"]}
								rating={5}
								gameId="123"
								key="erg"
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
