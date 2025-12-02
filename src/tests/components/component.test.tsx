import { expect, test } from "bun:test";
// import { expect, test, vi } from "bun:test";
// import { fireEvent, render, screen } from "@testing-library/react";
// import { SearchBar } from "$components/searchbar";
// import { getAllSortOptions, getFilterMap } from "$lib/db";
import { afterEach, beforeEach } from "node:test";
import { DataSource } from "typeorm";
import { Game, GameMedia, Label } from "$entity/Games";
import { Review } from "$entity/Review";
import { User } from "$entity/User";

let testDataSource: DataSource;
beforeEach(async () => {
	testDataSource = new DataSource({
		database: ":memory:",
		entities: [User, Game, GameMedia, Label, Review],
		synchronize: true,
		type: "sqlite",
	});
	await testDataSource.initialize();
});

afterEach(async () => {
	await testDataSource.destroy();
});
test("basic math", () => {
	expect(1 + 1).toBe(2);
});

// test("verify search bar component", async () => {
// 	const redirectSpy = vi.spyOn(window.location, "assign");
//
// 	const options = await getAllSortOptions();
//
// 	const filterOptions: Map<string, string[]> = await getFilterMap();
//
// 	const selectedFilters: string[] = [];
// 	for (const labels of filterOptions.values()) {
// 		selectedFilters.push(...labels);
// 	}
//
// 	render(
// 		<SearchBar
// 			sortOptions={options}
// 			filterOptions={filterOptions}
// 			defaultQuery={null}
// 		/>,
// 	);
//
// 	const searchInput = screen.getByPlaceholderText("Search...");
// 	const searchButton = screen.getByText("Search");
// 	const filterButton = screen.getByText("Filter:");
// 	const sortDropdown = screen.getByTestId("sort-by-button");
//
// 	fireEvent.click(filterButton);
// 	fireEvent.click(sortDropdown);
//
// 	for (const option of options) {
// 		const sortByOption = screen.getByText(option);
// 		expect(sortByOption).toBeInTheDocument();
// 		fireEvent.click(sortByOption);
// 		expect(sortDropdown).toHaveTextContent(option);
// 	}
//
// 	for (const filter of selectedFilters) {
// 		const filterOption = screen.getByText(filter);
// 		expect(filterOption).toBeInTheDocument();
// 		fireEvent.click(filterOption);
// 	}
//
// 	fireEvent.change(searchInput, { target: { value: "Test Search" } });
// 	expect(searchInput).toHaveValue("Test Search");
//
// 	fireEvent.click(searchButton);
//
// 	expect(redirectSpy).toHaveBeenCalledTimes(1);
// 	// expect(redirectSpy).toHaveBeenCalledWith(
// 	// 	"/search?query=Test%20Search&filters=Action%2CAdventure%2CRPG%2CStrategy%2CVisual%2CAuditory%2CMotor%2CCognitive%2CMultiplayer%2CSingleplayer%2CCo-op%2CTrending&sort=Price%3A%20High%20to%20Low",
// 	// );
//
// 	const fullUri = `/search?query=Test%20Search&filters=${encodeURIComponent(selectedFilters.join(","))}&sort=${encodeURIComponent("Price: High to Low")}`;
// 	expect(redirectSpy).toHaveBeenCalledWith(fullUri);
// });
