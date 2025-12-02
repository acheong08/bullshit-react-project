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
		<section className="pagination" aria-label="Pagination">
			<button
				className="pagination-btn"
				type="button"
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
				aria-label="Go to first page"
			>
				First
			</button>

			<button
				className="pagination-arrow"
				type="button"
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				aria-label="Go to previous page"
			>
				←
			</button>

			{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
				<button
					key={pageNum}
					className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
					type="button"
					onClick={() => onPageChange(pageNum)}
					aria-label={
						currentPage === pageNum
							? `Page ${pageNum}, current page`
							: `Go to page ${pageNum}`
					}
					aria-current={currentPage === pageNum ? "page" : undefined}
				>
					{pageNum}
				</button>
			))}

			<button
				className="pagination-arrow"
				type="button"
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
				aria-label="Go to next page"
			>
				→
			</button>

			<button
				className="pagination-btn"
				type="button"
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
				aria-label="Go to last page"
			>
				Last
			</button>
		</section>
	);
}
