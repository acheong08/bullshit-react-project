import "./styles/variables.css";
import "./styles/index.css";
import { Navbar } from "$components/navbar.tsx";
import { VoiceCommandProvider } from "$components/voice-command-provider.tsx";
import { VoiceNavigationCommands } from "$components/voice-navigation-commands.tsx";
import { getAllSortOptions, getFilterMap } from "$lib/db";
import { GamePage } from "$pages/game.tsx";
import { HomePage } from "$pages/home.tsx";
import { LoginPage } from "$pages/login.tsx";
import { NotFoundPage } from "$pages/not-found.tsx";
import { ProfilePage } from "$pages/profile.tsx";
import { SearchPage } from "$pages/searchpage.tsx";
import { isUserLoggedIn } from "$utils/auth.ts";
import { RegisterPage } from "./pages/register.tsx";

export async function Root(props: { request: Request }) {
	const isLoggedIn = isUserLoggedIn(props.request);

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
					<Navbar isLoggedIn={isLoggedIn} />
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

function App(props: {
	url: URL;
	request: Request;
	sortOptions: string[];
	filterMap: Map<string, string[]>;
}) {
	const pathname = props.url.pathname;

	// Parse route
	if (pathname === "/") {
		return (
			<HomePage
				sortOptions={props.sortOptions}
				filterOptions={props.filterMap}
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
				params={searchParamsObject}
				searchBarSortOptions={props.sortOptions}
				searchBarFilterOptions={props.filterMap}
			/>
		);
	}

	return <NotFoundPage />;
}
