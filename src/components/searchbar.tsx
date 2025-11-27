"use client"; // enables client-side rendering, with RSC it's off by default
import {
	type Dispatch,
	type FormEvent,
	type SetStateAction,
	useEffect,
	useRef,
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

interface SearchBarProps {
	sortOptions: string[];
	filterOptions: Map<string, string[]>;
}

function sortDropdown(
	{ selectedOption, setSelectedOption }: SortDropdownProps,
	sortOptions: string[],
) {
	const [open, setOpen] = useState(false);
	//NOTE: in future these will be pulled from the database
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
					{sortOptions.map((option: string) => (
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
				<div className="filters-dropdown-container">
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

function searchFilterComponent(
	{ selectedOption }: SortDropdownProps,
	{ selectedFilters, setSelectedFilters }: FilterSummaryProps,
	filterOptions: Map<string, string[]>,
) {
	const [filterOpen, setFilterOpen] = useState(false);
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);
		const searchQuery = formData.get("search") as string;
		const filters = Array.from(selectedFilters).join(",");
		const sort = selectedOption;
		const fullQuery = `/search?query=${encodeURIComponent(searchQuery)}&filters=${encodeURIComponent(filters)}&sort=${encodeURIComponent(sort)}`;
		if (searchQuery.trim() !== "") {
			window.location.assign(fullQuery);
		}
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
				filterOptions,
			)}
			{selectedFiltersDisplay({ selectedFilters, setSelectedFilters })}
		</div>
	);
}

export function SearchBar({ sortOptions, filterOptions }: SearchBarProps) {
	const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
	const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
		new Set(),
	);

	const sortZeroRef = useRef(sortOptions[0]);

	// Initialize state from URL parameters on component mount
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const initialSort = searchParams.get("sort") || sortZeroRef.current;
		const filterParams = searchParams.get("filters")?.split(",") || [];
		//TODO: have query also populate search bar input field (defaultValue)

		setSelectedSort(initialSort);
		setSelectedFilters(new Set(filterParams));
	}, []);

	return (
		<div>
			<div className="flex center">
				{searchFilterComponent(
					{ selectedOption: selectedSort, setSelectedOption: setSelectedSort },
					{ selectedFilters, setSelectedFilters },
					filterOptions,
				)}
				{sortDropdown(
					{
						selectedOption: selectedSort,
						setSelectedOption: setSelectedSort,
					},
					sortOptions,
				)}
			</div>
		</div>
	);
}
