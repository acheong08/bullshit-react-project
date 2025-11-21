"use client";

interface SearchPageProps {
	params: Record<string, string>;
}

export function SearchPage({ params }: SearchPageProps) {
	const query = params.query || "no query";
	const filters = params.filters || "no filters";
	const sort = params.sort || "no sort";

	return (
		<div>
			<p>Query: {query}</p>
			<p>Filters: {filters}</p>
			<p>Sort: {sort}</p>
		</div>
	);
}
