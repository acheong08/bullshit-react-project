"use client";
import { useState } from "react";
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
		"Other (specify below)"
	];

	async function handleSubmit() {
		const reason = selectedReason === "Other (specify below)" 
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
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<h3>Report: {gameName}</h3>
				
				<p>Help us improve by reporting issues with this game.</p>

				<label>
					Select a reason:
					<select 
						value={selectedReason} 
						onChange={(e) => setSelectedReason(e.target.value)}
					>
						<option value="">-- Choose a reason --</option>
						{predefinedReasons.map(reason => (
							<option key={reason} value={reason}>{reason}</option>
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
					<button onClick={handleSubmit} disabled={isSubmitting || !selectedReason}>
						{isSubmitting ? "Submitting..." : "Submit Report"}
					</button>
					<button onClick={onClose}>Cancel</button>
				</div>
			</div>
		</div>
	);
}
