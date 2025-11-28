"use client";
import { useState } from "react";

type ReportStatus = "pending" | "reviewed" | "deleted";

// Game report type definition
interface GameReport {
	id: number;
	gameId: string;
	title: string;
	description: string;
	image: string;
	reportReason: string;
	reportedAt: string;
	status: ReportStatus;
}

// Mock data - to be filled in with actual database information
const mockReports: GameReport[] = [
	{
		description: "An intense battle royale game with 100 players",
		gameId: "game-001",
		id: 1,
		image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
		reportedAt: "2025-11-20",
		reportReason: "Offensive content",
		status: "pending",
		title: "Battle Royale Extreme",
	},
	{
		description: "Solve challenging puzzles and unlock new levels",
		gameId: "game-002",
		id: 2,
		image: "https://images.unsplash.com/photo-1606503153255-59d7f9ceb4dc?w=400",
		reportedAt: "2025-11-21",
		reportReason: "Incorrect game details",
		status: "pending",
		title: "Puzzle Master",
	},
	{
		description: "High-speed racing action with stunning graphics",
		gameId: "game-003",
		id: 3,
		image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=400",
		reportedAt: "2025-11-22",
		reportReason: "Offensive content",
		status: "pending",
		title: "Racing Thunder",
	},
];

//Always remember to get rid of defaulf as it messes things up.
export function AdminReportsPage() {
	const [reports, setReports] = useState<GameReport[]>(mockReports);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [activeTab, setActiveTab] = useState<ReportStatus>("pending");

	const selectedReport = reports.find((r) => r.id === selectedId);
	const [editValues, setEditValues] = useState<Omit<
		GameReport,
		"id" | "gameId" | "status" | "reportReason" | "reportedAt"
	> | null>(null);

	// Filter reports by status
	const pendingReports = reports.filter((r) => r.status === "pending");
	const reviewedReports = reports.filter((r) => r.status === "reviewed");
	const deletedReports = reports.filter((r) => r.status === "deleted");

	// Get current tab's reports
	const currentReports =
		activeTab === "pending"
			? pendingReports
			: activeTab === "reviewed"
				? reviewedReports
				: deletedReports;

	// Select a report and start editing
	function startEditing(report: GameReport) {
		setSelectedId(report.id);
		setEditValues({
			description: report.description,
			image: report.image,
			title: report.title,
		});
	}

	// Save edits to local state - to be edited for database.
	function saveEdits() {
		if (selectedId && editValues) {
			setReports((prev) =>
				prev.map((report) =>
					report.id === selectedId ? { ...report, ...editValues } : report,
				),
			);
			setSelectedId(null);
			setEditValues(null);
		}
	}

	//report mapping to reviewed section

	function markResolved(id: number) {
		setReports((prev) =>
			prev.map((report) =>
				report.id === id ? { ...report, status: "reviewed" } : report,
			),
		);
		setSelectedId(null);
		setEditValues(null);
	}
	// report mapping to deleted section.

	function deleteReport(id: number) {
		if (window.confirm("Are you sure you want to delete this game?")) {
			setReports((prev) =>
				prev.map((report) =>
					report.id === id ? { ...report, status: "deleted" } : report,
				),
			);
			setSelectedId(null);
			setEditValues(null);
		}
	}

	function cancelEdit() {
		setSelectedId(null);
		setEditValues(null);
	}

	return (
		<main style={{ margin: "auto", maxWidth: 900, padding: "2rem" }}>
			<h2>Game Reports Admin Panel</h2>

			{/* Tab Navigation */}
			<div style={{ marginBottom: "2rem" }}>
				<button
					type="button"
					onClick={() => setActiveTab("pending")}
					style={{
						fontWeight: activeTab === "pending" ? "bold" : "normal",
						marginRight: "10px",
						padding: "10px 20px",
						textDecoration: activeTab === "pending" ? "underline" : "none",
					}}
				>
					Pending ({pendingReports.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("reviewed")}
					style={{
						fontWeight: activeTab === "reviewed" ? "bold" : "normal",
						marginRight: "10px",
						padding: "10px 20px",
						textDecoration: activeTab === "reviewed" ? "underline" : "none",
					}}
				>
					Reviewed ({reviewedReports.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("deleted")}
					style={{
						fontWeight: activeTab === "deleted" ? "bold" : "normal",
						padding: "10px 20px",
						textDecoration: activeTab === "deleted" ? "underline" : "none",
					}}
				>
					Deleted ({deletedReports.length})
				</button>
			</div>

			{/* Reports List */}
			{currentReports.length === 0 ? (
				<p>No {activeTab} reports</p>
			) : (
				<ul>
					{currentReports.map((report) => (
						<li key={report.id} style={{ marginBottom: 15 }}>
							<strong>{report.title}</strong> - {report.reportReason}
							<br />
							<small>
								Reported: {report.reportedAt} | Status: {report.status}
							</small>
							<br />
							<button
								type="button"
								style={{ marginTop: 5 }}
								onClick={() => startEditing(report)}
							>
								Review & Edit
							</button>
						</li>
					))}
				</ul>
			)}

			{/* Edit Panel */}
			{selectedReport && editValues && (
				<section
					style={{ border: "1px solid #ccc", marginTop: 30, padding: 15 }}
				>
					<h3>Edit Game Details</h3>

					<p>
						<strong>Report Reason:</strong> {selectedReport.reportReason}
						<br />
						<strong>Reported:</strong> {selectedReport.reportedAt}
						<br />
						<strong>Status:</strong> {selectedReport.status}
					</p>

					<label>
						Title:
						<br />
						<input
							type="text"
							value={editValues.title}
							onChange={(e) =>
								setEditValues((edit) =>
									edit ? { ...edit, title: e.target.value } : edit,
								)
							}
							style={{ marginBottom: 8, width: "100%" }}
						/>
					</label>
					<br />

					<label>
						Description:
						<br />
						<textarea
							value={editValues.description}
							onChange={(e) =>
								setEditValues((edit) =>
									edit ? { ...edit, description: e.target.value } : edit,
								)
							}
							rows={3}
							style={{ marginBottom: 8, width: "100%" }}
						/>
					</label>
					<br />

					<label>
						Image URL:
						<br />
						<input
							type="text"
							value={editValues.image}
							onChange={(e) =>
								setEditValues((edit) =>
									edit ? { ...edit, image: e.target.value } : edit,
								)
							}
							style={{ marginBottom: 8, width: "100%" }}
						/>
					</label>
					<br />

					<img
						src={editValues.image}
						alt={editValues.title}
						style={{ marginBottom: 12, maxWidth: "300px" }}
					/>

					<div>
						<button type="button" onClick={saveEdits}>
							Save Changes
						</button>
						{selectedReport.status === "pending" && (
							<button
								type="button"
								onClick={() => markResolved(selectedReport.id)}
								style={{ marginLeft: 10 }}
							>
								Mark as Reviewed
							</button>
						)}
						<button
							type="button"
							onClick={() => deleteReport(selectedReport.id)}
							style={{ marginLeft: 10 }}
						>
							Delete
						</button>
						<button
							type="button"
							onClick={cancelEdit}
							style={{ marginLeft: 10 }}
						>
							Cancel
						</button>
					</div>
				</section>
			)}
		</main>
	);
}
