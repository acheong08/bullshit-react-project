import "./styles/variables.css";
import "./styles/index.css";
import { Navbar } from "./components/navbar.tsx";
import { GamePage } from "./pages/game.tsx";
import { HomePage } from "./pages/home.tsx";
import { LoginPage } from "./pages/login.tsx";
import { NotFoundPage } from "./pages/not-found.tsx";
import { ProfilePage } from "./pages/profile.tsx";
import { isUserLoggedIn } from "./utils/auth.ts";

export function Root(props: { request: Request }) {
	const isLoggedIn = isUserLoggedIn(props.request);
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Vite + RSC</title>
			</head>
			<body>
				<Navbar isLoggedIn={isLoggedIn} />
				<div className="app-container">
					<App url={new URL(props.request.url)} />
				</div>
			</body>
		</html>
	);
}

function App(props: { url: URL }) {
	const pathname = props.url.pathname;

	// Parse route
	if (pathname === "/") {
		return <HomePage />;
	}
	if (pathname === "/login") {
		return <LoginPage />;
	}
	if (pathname === "/profile") {
		return <ProfilePage />;
	}
	if (pathname.startsWith("/game/")) {
		const gameId = pathname.split("/")[2];
		return <GamePage gameId={gameId} />;
	}

	return <NotFoundPage />;
}
