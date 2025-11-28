"use client";

import { useState } from "react";
import { createReview, deleteReview } from "../action";

interface ReviewData {
	id: number;
	user: {
		username: string;
	};
	accessibilityRating: number;
	enjoyabilityRating: number;
	comment: string;
	createdAt: Date | string; // Can be Date or string after serialization
}

interface ReviewsSectionProps {
	reviews?: ReviewData[];
	gameId: number;
	isLoggedIn: boolean;
	currentUsername?: string;
}

export function ReviewsSection({
	reviews = [],
	gameId,
	isLoggedIn,
	currentUsername,
}: ReviewsSectionProps) {
	const [activeTab, setActiveTab] = useState<"Game" | "Accessibility">("Game");
	const [comment, setComment] = useState("");
	const [accessibilityRating, setAccessibilityRating] = useState(3);
	const [enjoyabilityRating, setEnjoyabilityRating] = useState(3);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

	const handleSubmitReview = async () => {
		setIsSubmitting(true);
		setSubmitError(null);
		setSubmitSuccess(false);

		try {
			const result = await createReview({
				accessibilityRating,
				comment: comment.trim() || undefined,
				enjoyabilityRating,
				gameId,
			});

			if (result.success) {
				setSubmitSuccess(true);
				setComment("");
				setAccessibilityRating(3);
				setEnjoyabilityRating(3);
			} else {
				setSubmitError(result.error || "Failed to submit review");
			}
		} catch (_) {
			setSubmitError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteReview = async (reviewId: number) => {
		if (!confirm("Are you sure you want to delete this review?")) {
			return;
		}

		setDeletingReviewId(reviewId);

		try {
			const result = await deleteReview(reviewId);

			if (!result.success) {
				alert(result.error || "Failed to delete review");
			}
		} catch (_) {
			alert("An error occurred. Please try again.");
		} finally {
			setDeletingReviewId(null);
		}
	};

	// Calculate averages
	const avgAccessibility =
		reviews.length > 0
			? reviews.reduce((sum, r) => sum + r.accessibilityRating, 0) /
				reviews.length
			: 0;
	const avgEnjoyability =
		reviews.length > 0
			? reviews.reduce((sum, r) => sum + r.enjoyabilityRating, 0) /
				reviews.length
			: 0;

	// Calculate rating distribution
	const ratingCounts = [1, 2, 3, 4, 5]
		.map((star) => {
			const count = reviews.filter((r) => {
				const rating =
					activeTab === "Game" ? r.enjoyabilityRating : r.accessibilityRating;
				return Math.round(rating) === star;
			}).length;
			return {
				count,
				star,
				width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%",
			};
		})
		.reverse();

	const currentAvg = activeTab === "Game" ? avgEnjoyability : avgAccessibility;

	// Format date helper - handles both Date objects and ISO strings
	const formatDate = (date: Date | string) => {
		const d = new Date(date);
		return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
	};

	return (
		<div className="reviews-container">
			<div className="review-tabs">
				<button
					type="button"
					className={`tab-btn ${activeTab === "Game" ? "active" : ""}`}
					onClick={() => setActiveTab("Game")}
					role="tab"
					aria-selected={activeTab === "Game"}
					aria-controls="game-review-panel"
					aria-label="Game review section"
				>
					Game
				</button>
				<button
					type="button"
					className={`tab-btn ${activeTab === "Accessibility" ? "active" : ""}`}
					onClick={() => setActiveTab("Accessibility")}
					role="tab"
					aria-selected={activeTab === "Accessibility"}
					aria-controls="accessibility-review-panel"
					aria-label="Accessibility review section"
				>
					Accessibility
				</button>
			</div>

			<div className="rating-overview">
				<div className="rating-score-container">
					<span className="big-rating">{currentAvg.toFixed(1)}</span>
					<div className="stars">★★★★★</div>
					<span className="total-reviews">
						based on {reviews.length} reviews
					</span>
				</div>

				<div className="rating-bars">
					{ratingCounts.map((item) => (
						<div key={item.star} className="rating-bar-row">
							<section
								className="star-label"
								aria-label={`${item.star} star reviews`}
							>
								{item.star}
							</section>
							<div className="bar-track">
								<div className="bar-fill" style={{ width: item.width }} />
							</div>
							<section
								className="count-label"
								aria-label={`${item.count} ${item.star}" star reviews"`}
							>
								({item.count})
							</section>
						</div>
					))}
				</div>
			</div>

			{/* Review Form or Login Prompt */}
			{isLoggedIn ? (
				<div className="review-form">
					<h3>Leave a Review</h3>

					{submitSuccess && (
						<div className="success-message">
							Review submitted successfully!
						</div>
					)}

					{submitError && <div className="error-message">{submitError}</div>}

					<div className="rating-inputs">
						<div className="rating-input-group">
							<label htmlFor="accessibility-rating">
								Accessibility Rating: {accessibilityRating}
							</label>
							<input
								id="accessibility-rating"
								type="range"
								min="1"
								max="5"
								value={accessibilityRating}
								onChange={(e) => setAccessibilityRating(Number(e.target.value))}
							/>
						</div>

						<div className="rating-input-group">
							<label htmlFor="enjoyability-rating">
								Enjoyability Rating: {enjoyabilityRating}
							</label>
							<input
								id="enjoyability-rating"
								type="range"
								min="1"
								max="5"
								value={enjoyabilityRating}
								onChange={(e) => setEnjoyabilityRating(Number(e.target.value))}
							/>
						</div>
					</div>

					<textarea
						className="comment-input"
						placeholder="Leave your comment here (optional)"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={4}
					/>

					<button
						type="button"
						className="submit-review-btn"
						onClick={handleSubmitReview}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Submit Review"}
					</button>
				</div>
			) : (
				<div className="login-prompt-banner">
					<p>You must be logged in to leave a review.</p>
					<a href="/login" className="login-link-btn">
						Go to Login
					</a>
				</div>
			)}

			<div className="reviews-list">
				{reviews.map((review) => (
					<div key={review.id} className="review-card">
						<img
							src="/images/example-images/example-profile-icon.png"
							alt={review.user.username}
							className="review-avatar"
						/>
						<div className="review-content">
							<div className="review-header">
								<span className="review-author">{review.user.username}</span>
								<span className="review-date">
									{formatDate(review.createdAt)}
								</span>
								{currentUsername === review.user.username ? (
									<button
										type="button"
										className="delete-review-btn"
										onClick={() => handleDeleteReview(review.id)}
										disabled={deletingReviewId === review.id}
									>
										{deletingReviewId === review.id ? "Deleting..." : "Delete"}
									</button>
								) : (
									<button type="button" className="report-btn">
										⚑ Report
									</button>
								)}
							</div>
							<p className="review-text">{review.comment}</p>

							{/* Accessibility Rating */}
							<div className="review-rating-row">
								<span className="rating-label">Accessibility:</span>
								<div className="review-stars">
									{[1, 2, 3, 4, 5].map((star) => (
										<span
											key={`acc-${star}`}
											className={
												star <= review.accessibilityRating
													? "star filled"
													: "star"
											}
										>
											★
										</span>
									))}
								</div>
							</div>

							{/* Gameplay/Enjoyability Rating */}
							<div className="review-rating-row">
								<span className="rating-label">Gameplay:</span>
								<div className="review-stars">
									{[1, 2, 3, 4, 5].map((star) => (
										<span
											key={`enjoy-${star}`}
											className={
												star <= review.enjoyabilityRating
													? "star filled"
													: "star"
											}
										>
											★
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{reviews.length > 0 && (
				<button type="button" className="see-all-btn">
					See all reviews
				</button>
			)}
		</div>
	);
}
