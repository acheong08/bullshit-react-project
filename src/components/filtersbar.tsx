import "../styles/home.css";

export default function FiltersBar({
	selectedGenre,
	setSelectedGenre,
	selectedDisability,
	setSelectedDisability,
}: {
	selectedGenre: string;
	setSelectedGenre: (g: string) => void;
	selectedDisability: string;
	setSelectedDisability: (d: string) => void;
}) {
	return (
		<div className="filters-row">
			<div className="filter-container">
				<select
					id="genre-filter"
					className="filter-dropdown"
					value={selectedGenre}
					onChange={(e) => setSelectedGenre(e.target.value)}
				>
					<option value="all">Genre</option>
					<option value="action">Action</option>
					<option value="adventure">Adventure</option>
					<option value="rpg">RPG</option>
					<option value="strategy">Strategy</option>
					<option value="simulation">Simulation</option>
					<option value="sports">Sports</option>
					<option value="racing">Racing</option>
					<option value="puzzle">Puzzle</option>
					<option value="horror">Horror</option>
					<option value="platformer">Platformer</option>
					<option value="fighting">Fighting</option>
					<option value="indie">Indie</option>
				</select>
			</div>

			<div className="filter-container">
				<select
					id="disability-filter"
					className="filter-dropdown"
					value={selectedDisability}
					onChange={(e) => setSelectedDisability(e.target.value)}
				>
					<option value="all">Disability</option>
					<option value="visual">Visual Impairments</option>
					<option value="hearing">Hearing Impairments</option>
					<option value="mobility">Mobility Impairments</option>
					<option value="cognitive">Cognitive Impairments</option>
					<option value="speech">Speech Impairments</option>
				</select>
			</div>
		</div>
	);
}
