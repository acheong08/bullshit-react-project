"use client";
import { useState } from "react";
import {
	deleteGameAction,
	updateGameAction,
	updateReportStatusAction,
} from "$actions";

type ReportStatus = "pending" | "reviewed" | "deleted";

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

interface Props {
	initialReports: GameReport[];
}

export function AdminReportsClient({ initialReports }: Props) {
	const [reports, setReports] = useState<GameReport[]>(initialReports);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [activeTab, setActiveTab] = useState<ReportStatus>("pending");

	const selectedReport = reports.find((r) => r.id === selectedId);
	const [editValues, setEditValues] = useState<{
		title: string;
		description: string;
		image: string;
	} | null>(null);

	const pendingReports = reports.filter((r) => r.status === "pending");
	const reviewedReports = reports.filter((r) => r.status === "reviewed");
	const deletedReports = reports.filter((r) => r.status === "deleted");

	const currentReports =
		activeTab === "pending"
			? pendingReports
			: activeTab === "reviewed"
				? reviewedReports
				: deletedReports;

	function startEditing(report: GameReport) {
		setSelectedId(report.id);
		setEditValues({
			description: report.description,
			image: report.image,
			title: report.title,
		});
	}

	// Save edits to database via server action
	async function saveEdits() {
		if (!selectedId || !editValues || !selectedReport) return;

		try {
			const result = await updateGameAction(Number(selectedReport.gameId), {
				description: editValues.description,
				imageUri: editValues.image,
				name: editValues.title,
			});

			if (!result.success) throw new Error("Failed to update game");

			setReports((prev) =>
				prev.map((report) =>
					report.id === selectedId ? { ...report, ...editValues } : report,
				),
			);

			alert("Game updated successfully!");
			setSelectedId(null);
			setEditValues(null);
		} catch (error) {
			alert("Error updating game");
			console.error(error);
		}
	}

	// Mark report as reviewed in database
	async function markResolved(reportId: number) {
		try {
			const result = await updateReportStatusAction(reportId, "reviewed");

			if (!result.success) throw new Error("Failed to update status");

			setReports((prev) =>
				prev.map((report) =>
					report.id === reportId ? { ...report, status: "reviewed" } : report,
				),
			);
			setSelectedId(null);
			setEditValues(null);
		} catch (error) {
			alert("Error updating report status");
			console.error(error);
		}
	}

	// Delete game from database
	async function deleteReport(reportId: number, gameId: string) {
		if (!window.confirm("Are you sure you want to delete this game?")) return;

		try {
			const result = await deleteGameAction(Number(gameId));

			if (!result.success) throw new Error("Failed to delete game");

			setReports((prev) =>
				prev.map((report) =>
					report.id === reportId ? { ...report, status: "deleted" } : report,
				),
			);
			setSelectedId(null);
			setEditValues(null);

			alert("Game deleted successfully!");
		} catch (error) {
			alert("Error deleting game");
			console.error(error);
		}
	}

	function cancelEdit() {
		setSelectedId(null);
		setEditValues(null);
	}

	return (
		<main style={{ margin: "auto", maxWidth: 900, padding: "2rem" }}>
			<h2>Game Reports Admin Panel</h2>

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
							onClick={() =>
								deleteReport(selectedReport.id, selectedReport.gameId)
							}
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
