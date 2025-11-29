import GameCard from "$components/gameCards/game-card";
import { SearchBar } from "$components/searchbar";
import { LabelType, MediaType } from "$entity/Games";
import { Review } from "$entity/Review";
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
							Search results for '{query}'
						</h1>
					</div>

					<div className="game-card-gallery">
						{games.map(async (game) => {
							const previewImage = game.media.find(
								(media) => media.type === MediaType.Icon,
							);
							const ratings = await Review.find({
								where: { game: { id: game.id } },
							});
							const averageRating =
								ratings.length > 0
									? ratings.reduce(
											(sum, review) => sum + review.enjoyabilityRating,
											0,
										) / ratings.length
									: 0;

							return (
								<GameCard
									key={game.id}
									image={previewImage ? previewImage.uri : StardewValleyLogo}
									title={game.name}
									genres={game.labels
										.filter((label) => label.type === LabelType.Genre)
										.slice(0, 3)
										.map((label) => label.name.toString())}
									rating={averageRating}
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
