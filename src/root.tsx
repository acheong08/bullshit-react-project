import "./styles/variables.css";
import "./styles/index.css";
import { instanceToPlain } from "class-transformer";
import { Navbar } from "$components/navbar.tsx";
import { VoiceCommandProvider } from "$components/voice-command-provider.tsx";
import { VoiceNavigationCommands } from "$components/voice-navigation-commands.tsx";
import { Game, GameAverageRating } from "$entity/Games.ts";
import { getAllSortOptions, getFilterMap } from "$lib/db";
import { AdminReportsPage } from "$pages/admin/reports.tsx";
import { GamePage } from "$pages/game.tsx";
import { HomePage } from "$pages/home.tsx";
import { LoginPage } from "$pages/login.tsx";
import { NotFoundPage } from "$pages/not-found.tsx";
import { ProfilePage } from "$pages/profile.tsx";
import { SearchPage } from "$pages/searchpage.tsx";
import { WishListPage } from "$pages/wishlist.tsx";
import { getCurrentUser } from "$utils/auth.ts";
import { initialize } from "./framework/init.ts";
import { RegisterPage } from "./pages/register.tsx";

export async function Root(props: { request: Request }) {
	// Initialize just in case
	await initialize();
	const user = getCurrentUser(props.request);

	const sortOptions = await getAllSortOptions();
	const filterMap = await getFilterMap();
	return (
		<html lang="en" data-theme="dark">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Vite + RSC</title>
			</head>
			<body>
				<VoiceCommandProvider>
					<VoiceNavigationCommands />
					<Navbar user={user} />
					<div className="app-container">
						<App
							url={new URL(props.request.url)}
							request={props.request}
							sortOptions={sortOptions}
							filterMap={filterMap}
						/>
					</div>
				</VoiceCommandProvider>
			</body>
		</html>
	);
}

async function App(props: {
	url: URL;
	request: Request;
	sortOptions: string[];
	filterMap: Map<string, string[]>;
}) {
	const pathname = props.url.pathname;
	const user = getCurrentUser(props.request);

	if (pathname === "/") {
		const [spotlightGame, allGames] = await Promise.all([
			Game.findOne({
				relations: ["media", "labels"],
				where: { id: 1 },
			}),
			await Game.find({
				relations: ["media", "labels"],
			}),
		]);
		const popularGameCards = allGames.slice(1, 4);
		const currentGames = allGames;
		const topChartsGameCards = allGames.slice(4, 10);

		const allRatings = await GameAverageRating.find();

		//NOTE: cannot return objects
		return (
			<HomePage
				searchBarSortOptions={props.sortOptions}
				searchBarFilterOptions={props.filterMap}
				defaultQuery={null}
				spotlightGame={
					spotlightGame ? (instanceToPlain(spotlightGame) as Game) : null
				}
				popularGames={instanceToPlain(popularGameCards) as Game[]}
				currentGames={instanceToPlain(currentGames) as Game[]}
				topChartsGames={instanceToPlain(topChartsGameCards) as Game[]}
				allRatings={instanceToPlain(allRatings) as GameAverageRating[]}
			/>
		);
	}
	if (pathname === "/login") {
		return <LoginPage />;
	}
	if (pathname === "/register") {
		return <RegisterPage />;
	}
	if (pathname === "/profile") {
		return <ProfilePage />;
	}
	if (pathname === "/admin/reports") {
		// The first user is the admin
		if (user?.userId !== 1) {
			return <h1>Permission Denied</h1>;
		}
		return <AdminReportsPage />;
	}
	if (pathname === "/wishlist") {
		return <WishListPage />;
	}
	if (pathname.startsWith("/game/")) {
		const gameId = pathname.split("/")[2];
		return <GamePage gameId={gameId} request={props.request} />;
	}
	if (pathname === "/search") {
		const searchParamsObject = Object.fromEntries(
			props.url.searchParams.entries(),
		);
		return (
			<SearchPage
				urlParams={searchParamsObject}
				searchBarSortOptions={props.sortOptions}
				searchBarFilterOptions={props.filterMap}
			/>
		);
	}
	return <NotFoundPage />;
}
