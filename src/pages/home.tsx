import Pegi3 from "$tmpimg/Pegi-3.png";
import StardewValleyLogo from "$tmpimg/Stardew_Valley_image.png";
import GameCard from "../components/gameCards/game-card";
import TopChartsGameCard from "../components/gameCards/top-charts-game-card";
import WishListGameCard from "../components/gameCards/wish-list-game-card";

export function HomePage() {
	return (
		<div id="root">
			<main>
				<h1 className="page-title">This is the Home page</h1>
				<div className="quicklinks">
					<a href="/game/123">Some random game title</a>
				</div>
				{/* these will be on the page anyway but just put here for me to see how they would look*/}
				<div className="top-charts-game-card-gallery">
					<TopChartsGameCard
						rank={1}
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						tags={["Epilepsy", "Epilepsy", "Epilepsy", "Epilepsy"]}
						gameId="123"
					/>

					<TopChartsGameCard
						rank={2}
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						tags={["Epilepsy"]}
						gameId="123"
					/>

					<TopChartsGameCard
						rank={3}
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						tags={["Epilepsy"]}
						gameId="123"
					/>
					<TopChartsGameCard
						rank={3}
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						tags={["Epilepsy"]}
						gameId="123"
					/>
				</div>

				<div className="game-card-gallery">
					<GameCard
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						gameId="123"
					/>

					<GameCard
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						gameId="123"
					/>

					<GameCard
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						gameId="123"
					/>

					<GameCard
						image={StardewValleyLogo}
						title="Stardew Valley"
						genres={["Simulation", "RPG"]}
						rating={5}
						gameId="123"
					/>
				</div>
				{/*this is just here for me to test how the wishlist game cards will look as we don't have a page for it yet */}
				<div className="wish-list-game-card-gallery">
					<WishListGameCard
						image={StardewValleyLogo}
						title="Stardew Valley"
						rating={5}
						reviews="1M+"
						tags={["Epilepsy"]}
						downloads="1K+"
						ageRating="PEGI 3"
						ageImage={Pegi3}
						gameId="123"
					/>

					<WishListGameCard
						image={StardewValleyLogo}
						title="Stardew Valley"
						rating={5}
						reviews="1M+"
						tags={["Epilepsy"]}
						downloads="1K+"
						ageRating="PEGI 3"
						ageImage={Pegi3}
						gameId="123"
					/>
				</div>
			</main>
		</div>
	);
}
