"use client";

import { useEffect, useState } from "react";
import { createGameReport } from "$actions";

interface ReportModalProps {
	gameId: number;
	gameName: string;
	onClose: () => void;
}

export function ReportModal({ gameId, gameName, onClose }: ReportModalProps) {
	const [selectedReason, setSelectedReason] = useState("");
	const [customReason, setCustomReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const predefinedReasons = [
		"Offensive content",
		"Incorrect game details",
		"Broken image link",
		"Wrong genre classification",
		"Inappropriate for age rating",
		"Other (specify below)",
	];

	// Handle escape key globally
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	async function handleSubmit() {
		const reason =
			selectedReason === "Other (specify below)"
				? customReason.trim()
				: selectedReason;

		if (!reason) {
			alert("Please select or enter a reason for reporting");
			return;
		}

		setIsSubmitting(true);

		const result = await createGameReport(gameId, reason);

		if (result.success) {
			alert("Report submitted successfully. Our team will review it shortly.");
			onClose();
		} else {
			alert(result.error || "Failed to submit report. Please try again.");
		}

		setIsSubmitting(false);
	}

	return (
		<div className="modal-overlay">
			<div
				className="modal-content"
				role="dialog"
				aria-labelledby="modal-title"
				aria-modal="true"
			>
				<div className="modal-header">
					<h3 id="modal-title">Report: {gameName}</h3>
					<button
						type="button"
						className="modal-close"
						onClick={onClose}
						aria-label="Close modal"
					>
						×
					</button>
				</div>

				<p>Help us improve by reporting issues with this game.</p>

				<label>
					Select a reason:
					<select
						value={selectedReason}
						onChange={(e) => setSelectedReason(e.target.value)}
					>
						<option value="">-- Choose a reason --</option>
						{predefinedReasons.map((reason) => (
							<option key={reason} value={reason}>
								{reason}
							</option>
						))}
					</select>
				</label>

				{selectedReason === "Other (specify below)" && (
					<label>
						Please explain:
						<textarea
							value={customReason}
							onChange={(e) => setCustomReason(e.target.value)}
							placeholder="Describe the issue..."
							rows={3}
						/>
					</label>
				)}

				<div className="modal-actions">
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitting || !selectedReason}
					>
						{isSubmitting ? "Submitting..." : "Submit Report"}
					</button>
					<button type="button" onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
