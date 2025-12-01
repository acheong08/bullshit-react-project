import GameCard from "$components/gameCards/game-card";
import { SearchBar } from "$components/searchbar";
import { GameAverageRating, LabelType, MediaType } from "$entity/Games";
import { searchGames } from "$lib/db";

const StardewValleyLogo = "/images/Stardew_Valley_image.png";

interface SearchPageProps {
	urlParams: Record<string, string>;
	searchBarSortOptions: string[];
	searchBarFilterOptions: Map<string, string[]>;
}

export async function SearchPage({
	urlParams: params,
	searchBarSortOptions,
	searchBarFilterOptions,
}: SearchPageProps) {
	const query = params.query;
	const filterOptions = params.filters ? params.filters.split(",") : [];
	const sortOption = params.sort;

	const games = await searchGames(filterOptions, sortOption, query);

	return (
		<>
			<SearchBar
				sortOptions={searchBarSortOptions}
				filterOptions={searchBarFilterOptions}
				defaultQuery={query}
			/>
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
							{query.trim() !== "" ? `Search results for '${query}'` : ""}
						</h1>
					</div>

					<div className="game-card-gallery">
						{games.map(async (game) => {
							const previewImage = game.media.find(
								(media) => media.type === MediaType.Icon,
							);
							const rating = await GameAverageRating.findOne({
								where: { gameId: game.id },
							});
							const averageRating = rating?.averageEnjoyabilityRating || 0;

							return (
								<GameCard
									key={game.id}
									image={previewImage ? previewImage.uri : StardewValleyLogo}
									title={game.name}
									genres={game.labels
										.filter((label) => label.type === LabelType.Genre)
										.map((label) => label.name.toString())}
									rating={Number(Number(averageRating || 0).toFixed(1))}
									gameId={game.id.toString()}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}
