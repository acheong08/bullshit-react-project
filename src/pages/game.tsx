interface GamePageProps {
	gameId: string;
}

export function GamePage({ gameId }: GamePageProps) {
	return (
		<div id="root">
			<main>
				<h1>This is the Game page</h1>
				<p>Game ID: {gameId}</p>
			</main>
		</div>
	);
}
