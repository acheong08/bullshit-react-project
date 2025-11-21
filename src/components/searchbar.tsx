"use client"; // enables client-side rendering, with RSC it's off by default
import {
	type Dispatch,
	type FormEvent,
	type SetStateAction,
	useState,
} from "react";

interface FilterSummaryProps {
	selectedFilters: Set<string>;
	setSelectedFilters: Dispatch<SetStateAction<Set<string>>>;
}

interface DropdownFilterSelectorProps {
	filterOpen: boolean;
}

interface SortDropdownProps {
	selectedOption: string;
	setSelectedOption: Dispatch<SetStateAction<string>>;
}

function sortDropdown({
	selectedOption,
	setSelectedOption,
}: SortDropdownProps) {
	const [open, setOpen] = useState(false);
	//NOTE: in future these will be pulled from the database
	const options = [
		"Relevance",
		"Release Date",
		"Popularity",
		"Alphabetical",
		"Rating",
		"Price: Low to High",
		"Price: High to Low",
	];

	return (
		<div className="">
			<button
				data-testid="sort-by-button"
				className="search-component-button sort-by-label"
				type="button"
				onClick={() => setOpen(!open)}
			>
				Sort By: {selectedOption}
			</button>
			{open && (
				<ul className="sort-dropdown-container">
					{options.map((option: string) => (
						<li key={option} className="center">
							<button
								type="button"
								className="filter-button"
								onClick={() => {
									setSelectedOption(option);
								}}
							>
								{option}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function dropdownFilterSelector(
	{ filterOpen }: DropdownFilterSelectorProps,
	{ setSelectedFilters, selectedFilters }: FilterSummaryProps,
	filters: Map<string, string[]>,
) {
	return (
		<div>
			{filterOpen && (
				<div className="dropdown-container">
					{Array.from(filters.entries()).map(
						([category, options]: [string, string[]]) => (
							<ul className="category-header center" key={category}>
								<strong>{category}</strong>
								{options.map((option: string) => (
									<li key={option}>
										<button
											type="button"
											className={`
                                                filter-button ${selectedFilters.has(option) ? "highlight" : ""}
                                            `}
											id={`filter-${option}`}
											onClick={() => {
												setSelectedFilters((prev) => {
													const newSet = new Set(prev);
													if (newSet.has(option)) {
														newSet.delete(option);
													} else {
														newSet.add(option);
													}
													return newSet;
												});
											}}
										>
											{option}
										</button>
									</li>
								))}
							</ul>
						),
					)}
				</div>
			)}
		</div>
	);
}

function selectedFiltersDisplay({ selectedFilters }: FilterSummaryProps) {
	return (
		<div className="filters-display">
			{Array.from(selectedFilters).map((filter) => (
				<p key={filter} className="filter-label">
					{filter}
				</p>
			))}
		</div>
	);
}

function searchFilterComponent({ selectedOption }: SortDropdownProps) {
	const [filterOpen, setFilterOpen] = useState(false);

	//NOTE: this is clunky as hell, in future these will be pulled from the database
	const filters: Map<string, string[]> = new Map([
		["Genre", ["Action", "Adventure", "RPG", "Strategy"]],
		["Accessibility", ["Visual", "Auditory", "Motor", "Cognitive"]],
		["Miscellaneous", ["Multiplayer", "Singleplayer", "Co-op", "Trending"]],
	]);
	const _filtersReversed: Map<string, string> = new Map([
		["Action", "Genre"],
		["Adventure", "Genre"],
		["RPG", "Genre"],
		["Strategy", "Genre"],
		["Visual", "Accessibility"],
		["Auditory", "Accessibility"],
		["Motor", "Accessibility"],
		["Cognitive", "Accessibility"],
		["Multiplayer", "Miscellaneous"],
		["Singleplayer", "Miscellaneous"],
		["Co-op", "Miscellaneous"],
		["Trending", "Miscellaneous"],
	]);
	const [selectedFilters, setSelectedFilters] = useState(new Set<string>());

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);
		const searchQuery = formData.get("search") as string;
		const filters = Array.from(selectedFilters).join(",");
		const sort = selectedOption;
		const fullQuery = `/search?query=${encodeURIComponent(searchQuery)}&filters=${encodeURIComponent(filters)}&sort=${encodeURIComponent(sort)}`;
		window.location.assign(fullQuery);
	};

	return (
		<div className="center">
			<div className="flex center">
				<form onSubmit={handleSubmit} className="flex">
					<input
						className="search-bar-input"
						type="text"
						name="search"
						placeholder="Search..."
					/>
					<button className="search-component-button" type="submit">
						Search
					</button>
				</form>
				<div>
					<button
						className="search-component-button"
						type="button"
						onClick={() => setFilterOpen(!filterOpen)}
					>
						Filter:
					</button>
				</div>
			</div>
			{dropdownFilterSelector(
				{ filterOpen },
				{ selectedFilters, setSelectedFilters },
				filters,
			)}
			{selectedFiltersDisplay({ selectedFilters })}
		</div>
	);
}

export function SearchBar() {
	const options = [
		"Relevance",
		"Release Date",
		"Popularity",
		"Alphabetical",
		"Rating",
		"Price: Low to High",
		"Price: High to Low",
	];

	const [selectedOption, setSelectedOption] = useState(options[0]);

	return (
		<div>
			<div className="flex center">
				{searchFilterComponent({ selectedOption })}
				{sortDropdown({ selectedOption, setSelectedOption })}
			</div>
		</div>
	);
}
