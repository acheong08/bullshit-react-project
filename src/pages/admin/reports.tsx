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
// Mock data - to be filled in with actual database information ( can edit all fields and images)
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

//Always remember to remove "default" from export as this mesess things up.
export function AdminReportsPage() {
	const [reports, setReports] = useState<GameReport[]>(mockReports);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const selectedReport = reports.find((r) => r.id === selectedId);
	const [editValues, setEditValues] = useState<Omit<
		GameReport,
		"id" | "gameId" | "status" | "reportReason" | "reportedAt"
	> | null>(null);

	// Select a report and start editing
	function startEditing(report: GameReport) {
		setSelectedId(report.id);
		setEditValues({
			description: report.description,
			image: report.image,
			title: report.title,
		});
	}

	// Save edits to local state
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

	function markResolved(id: number) {
		setReports((prev) =>
			prev.map((report) =>
				report.id === id ? { ...report, status: "resolved" } : report,
			),
		);
		setSelectedId(null);
		setEditValues(null);
	}

	function deleteReport(id: number) {
		if (window.confirm("Are you sure you want to delete this game?")) {
			setReports((prev) => prev.filter((report) => report.id !== id));
			setSelectedId(null);
			setEditValues(null);
		}
	}

	function cancelEdit() {
		setSelectedId(null);
		setEditValues(null);
	}

  const pendingReports = reports.filter (r => status == "pending");
  const reviewedReports = reports.filter (r => status == "reviewed");
  const deletedReports = reports.filter (r => status == "deleted");


	return (
		<main style={{ margin: "auto", maxWidth: 700, padding: "2rem" }}>
			<h2>Game Reports Admin Panel</h2>
			<ul>
				{reports
					.filter((r) => r.status === "pending")
					.map((report) => (
						<li key={report.id} style={{ marginBottom: 15 }}>
							<strong>{report.title}</strong> ({report.reportReason})
							<button
								type="button"
								style={{ marginLeft: 10 }}
								onClick={() => startEditing(report)}
							>
								Review & Edit
							</button>
						</li>
					))}
			</ul>
			{selectedReport && editValues && (
				<section
					style={{ border: "1px solid #ddd", marginTop: 30, padding: 15 }}
				>
					<h3>Edit Game Details</h3>
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
						style={{ marginBottom: 12, width: "200px" }}
					/>
					<div>
						<button type="button" onClick={saveEdits}>
							Save Changes
						</button>
						<button
							type="button"
							onClick={() => markResolved(selectedReport.id)}
							style={{ marginLeft: 10 }}
						>
							Mark as Resolved
						</button>
						<button
							type="button"
							onClick={() => deleteReport(selectedReport.id)}
							style={{ color: "red", marginLeft: 10 }}
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

//TO BE Finished - instead of using API data - retrieve from database records once they have been added.
//Include status panels so you can see admin history, appended games, deleted.
//
