type PaginationProps = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	return (
		<div className="pagination">
			<button
				className="pagination-btn"
				type="button"
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
			>
				First
			</button>
			<button
				className="pagination-arrow"
				type="button"
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
			>
				←
			</button>

			{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
				<button
					key={pageNum}
					className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
					type="button"
					onClick={() => onPageChange(pageNum)}
				>
					{pageNum}
				</button>
			))}

			<button
				className="pagination-arrow"
				type="button"
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
			>
				→
			</button>
			<button
				className="pagination-btn"
				type="button"
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
			>
				Last
			</button>
		</div>
	);
}
