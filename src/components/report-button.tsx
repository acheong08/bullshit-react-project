"use client";
import { useState } from "react";
import { ReportModal } from "./report-modal";

interface ReportButtonProps {
	gameId: number;
	gameName: string;
}

export function ReportButton({ gameId, gameName }: ReportButtonProps) {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button 
				type="button"
				onClick={() => setShowModal(true)}
				className="report-game-btn"
			>
				⚑ Report Issue
			</button>

			{showModal && (
				<ReportModal
					gameId={gameId}
					gameName={gameName}
					onClose={() => setShowModal(false)}
				/>
			)}
		</>
	);
}
