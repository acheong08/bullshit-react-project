"use client";

import { useState } from "react";

interface Review {
	id: string;
	author: string;
	date: string;
	rating: number;
	text: string;
	avatar: string;
	tags: string[];
}

const MOCK_REVIEWS: Review[] = [
	{
		author: "John Doe",
		avatar: "https://i.pravatar.cc/150?u=1",
		date: "14/10/2025",
		id: "1",
		rating: 5,
		tags: ["WOULD RECOMMEND"],
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sagittis vestibulum justo, eu commodo sapien finibus at. In elementum mattis suscipit. Nullam nec suscipit ligula. Ut sagittis finibus elit, tincidunt aliquet velit consequat commodo.",
	},
	{
		author: "Jane Doe",
		avatar: "https://i.pravatar.cc/150?u=2",
		date: "11/09/2025",
		id: "2",
		rating: 3,
		tags: ["WOULD RECOMMEND"],
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sagittis vestibulum justo, eu commodo sapien finibus at. In elementum mattis suscipit. Nullam nec suscipit ligula. Ut sagittis finibus elit, tincidunt aliquet velit consequat commodo.",
	},
	{
		author: "Jack Doe",
		avatar: "https://i.pravatar.cc/150?u=3",
		date: "10/08/2025",
		id: "3",
		rating: 4,
		tags: ["WOULD RECOMMEND"],
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sagittis vestibulum justo, eu commodo sapien finibus at. In elementum mattis suscipit. Nullam nec suscipit ligula. Ut sagittis finibus elit, tincidunt aliquet velit consequat commodo.",
	},
];

export function ReviewsSection() {
	const [activeTab, setActiveTab] = useState<"Game" | "Accessibility">("Game");

	return (
		<div className="reviews-container">
			<div className="review-tabs">
				<button
					type="button"
					className={`tab-btn ${activeTab === "Game" ? "active" : ""}`}
					onClick={() => setActiveTab("Game")}
				>
					Game
				</button>
				<button
					type="button"
					className={`tab-btn ${activeTab === "Accessibility" ? "active" : ""}`}
					onClick={() => setActiveTab("Accessibility")}
				>
					Accessibility
				</button>
			</div>

			<div className="rating-overview">
				<div className="rating-score-container">
					<span className="big-rating">4.6</span>
					<div className="stars">★★★★★</div>
					<span className="total-reviews">based on 120 reviews</span>
				</div>

				<div className="rating-bars">
					{[
						{ count: 30, star: 5, width: "30%" },
						{ count: 40, star: 4, width: "40%" },
						{ count: 20, star: 3, width: "20%" },
						{ count: 5, star: 2, width: "5%" },
						{ count: 2, star: 1, width: "2%" },
					].map((item) => (
						<div key={item.star} className="rating-bar-row">
							<span className="star-label">{item.star}</span>
							<div className="bar-track">
								<div className="bar-fill" style={{ width: item.width }} />
							</div>
							<span className="count-label">({item.count})</span>
						</div>
					))}
				</div>

				<button type="button" className="leave-review-btn">
					Leave a Review
				</button>
			</div>

			<div className="reviews-list">
				{MOCK_REVIEWS.map((review) => (
					<div key={review.id} className="review-card">
						<img
							src={review.avatar}
							alt={review.author}
							className="review-avatar"
						/>
						<div className="review-content">
							<div className="review-header">
								<span className="review-author">{review.author}</span>
								<span className="review-date">{review.date}</span>
								{review.tags.map((tag) => (
									<span key={tag} className="review-tag">
										{tag}
									</span>
								))}
								<button type="button" className="report-btn">
									⚑ Report
								</button>
							</div>
							<p className="review-text">{review.text}</p>
							<div className="review-stars">
								{[1, 2, 3, 4, 5].map((star) => (
									<span
										key={star}
										className={star <= review.rating ? "star filled" : "star"}
									>
										★
									</span>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			<button type="button" className="see-all-btn">
				See all reviews
			</button>
		</div>
	);
}
