// Server component - fetches data from database
import { getAllReports } from "$lib/db";
import { AdminReportsClient } from "./reports-client";

export async function AdminReportsPage() {
	// Fetch all reports from the database
	const reports = await getAllReports();
	
	console.log("Fetched reports from database:", reports.length);
	
	// Transform the data to match the format expected by the client component
	const reportsData = reports.map(report => ({
		id: report.id,
		gameId: report.game.id.toString(),
		title: report.game.name,
		description: report.game.description,
		image: report.game.media && report.game.media.length > 0 
			? report.game.media[0].uri 
			: '/placeholder.jpg',
		reportReason: report.reportReason,
		reportedAt: report.reportedAt.toISOString().split('T')[0],
		status: report.status,
	}));
	
	console.log("Transformed reports:", reportsData);

	// Pass the data to the client component
	return <AdminReportsClient initialReports={reportsData} />;
}
