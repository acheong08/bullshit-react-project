import { expect, test, vi } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { SearchBar } from "$components/searchbar";

test("basic math", () => {
	expect(1 + 1).toBe(2);
});

test("verify search bar component", async () => {
	const redirectSpy = vi.spyOn(window.location, "assign");

	const options = [
		"Relevance",
		"Release Date",
		"Popularity",
		"Alphabetical",
		"Rating",
		"Price: Low to High",
		"Price: High to Low",
	];

	const filterOptions: Map<string, string[]> = new Map([
		["Genre", ["Action", "Adventure", "RPG", "Strategy"]],
		["Accessibility", ["Visual", "Auditory", "Motor", "Cognitive"]],
		["Miscellaneous", ["Multiplayer", "Singleplayer", "Co-op", "Trending"]],
	]);

	const selectedFilters = [
		"Action",
		"Adventure",
		"RPG",
		"Strategy",
		"Visual",
		"Auditory",
		"Motor",
		"Cognitive",
		"Multiplayer",
		"Singleplayer",
		"Co-op",
		"Trending",
	];

	render(
		<SearchBar
			sortOptions={options}
			filterOptions={filterOptions}
			defaultQuery={null}
		/>,
	);

	const searchInput = screen.getByPlaceholderText("Search...");
	const searchButton = screen.getByText("Search");
	const filterButton = screen.getByText("Filter:");
	const sortDropdown = screen.getByTestId("sort-by-button");

	fireEvent.click(filterButton);
	fireEvent.click(sortDropdown);

	for (const option of options) {
		const sortByOption = screen.getByText(option);
		expect(sortByOption).toBeInTheDocument();
		fireEvent.click(sortByOption);
		expect(sortDropdown).toHaveTextContent(option);
	}

	for (const filter of selectedFilters) {
		const filterOption = screen.getByText(filter);
		expect(filterOption).toBeInTheDocument();
		fireEvent.click(filterOption);
	}

	fireEvent.change(searchInput, { target: { value: "Test Search" } });
	expect(searchInput).toHaveValue("Test Search");

	fireEvent.click(searchButton);

	expect(redirectSpy).toHaveBeenCalledTimes(1);
	expect(redirectSpy).toHaveBeenCalledWith(
		"/search?query=Test%20Search&filters=Action%2CAdventure%2CRPG%2CStrategy%2CVisual%2CAuditory%2CMotor%2CCognitive%2CMultiplayer%2CSingleplayer%2CCo-op%2CTrending&sort=Price%3A%20High%20to%20Low",
	);
});
