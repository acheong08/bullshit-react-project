// Server component - fetches data from database
import { getAllReports } from "$lib/db";
import { AdminReportsClient } from "./reports-client";

export async function AdminReportsPage() {
	// Fetch all reports from the database
	const reports = await getAllReports();

	console.log("Fetched reports from database:", reports.length);

	// Transform the data to match the format expected by the client component
	const reportsData = reports.map((report) => ({
		description: report.game.description,
		gameId: report.game.id.toString(),
		id: report.id,
		image:
			report.game.media && report.game.media.length > 0
				? report.game.media[0].uri
				: "/placeholder.jpg",
		reportedAt: report.reportedAt.toISOString().split("T")[0],
		reportReason: report.reportReason,
		status: report.status,
		title: report.game.name,
	}));
  //This is very very messy and not my code - This was Claude AI, not entierly sure how its changing the data,
  //its very unreadable and looks so messy but it does work. 

	console.log("Transformed reports:", reportsData);

	// Pass the data to the client component
	return <AdminReportsClient initialReports={reportsData} />;
}
