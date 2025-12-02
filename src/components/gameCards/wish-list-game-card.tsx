"use client";

import { useState } from "react";
import { removeFromWishlistAction } from "../../action";
import "$styles/game-card.css";

const StarIcon = "/images/star.png";

export type WishListGameCardProps = {
	image: string;
	title: string;
	rating: number;
	reviews: string;
	tags: string[];
	downloads: string;
	ageRating: string;
	gameId: string;
};

export default function WishListGameCard(props: WishListGameCardProps) {
	const [isRemoved, setIsRemoved] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);

	const handleRemove = async () => {
		setIsRemoving(true);
		const result = await removeFromWishlistAction(Number(props.gameId));
		if (result.success) {
			setIsRemoved(true);
		}
		setIsRemoving(false);
	};

	// Hide the card after successful removal
	if (isRemoved) {
		return null;
	}

	return (
		<section
			className="wish-list-card"
			aria-label={`${props.title} game card. Image: ${props.title} icon. Title: ${props.title}. Rating: ${props.rating} stars. ${props.reviews} Reviews. Downloads: 1 million. Age Rating: ${props.ageRating}. Game Tags: ${props.tags.join(", ")}`}
		>
			<a href={`/game/${props.gameId}`}>
				<img
					src={props.image}
					alt={props.title}
					className="wish-list-card-image"
				/>
			</a>

			{/* Main info section – hidden from screen readers */}
			<div className="wish-list-card-info" aria-hidden="true">
				<div className="wish-list-card-header">
					<a href={`/game/${props.gameId}`}>
						<h3 className="wish-list-card-title">{props.title}</h3>
					</a>
				</div>

				<div className="wish-list-downloads-age">
					<div className="wish-list-rating-reviews">
						<p className="wish-list-card-rating">
							{Number(props.rating).toFixed(1)}{" "}
							<img src={StarIcon} alt="Star" className="wish-list-star-icon" />
						</p>
						<p className="wish-list-Number-Of-Reviews">
							{props.reviews} reviews
						</p>
					</div>

					<p className="wish-list-Number-Of-Downloads">
						{props.downloads}
						<br />
						Downloads
					</p>

					<div className="wish-list-game-age-rating">
						<p>Rating</p>
						<p>{props.ageRating}</p>
					</div>
				</div>

				<div className="wish-list-tags-container">
					{props.tags.map((tag) => (
						<section
							key={tag}
							className="wish-list-card-tag"
							aria-label={`${tag} game tag`}
						>
							{tag}
						</section>
					))}
				</div>
				<button
					type="button"
					className="remove-button"
					onClick={handleRemove}
					disabled={isRemoving}
				>
					{isRemoving ? "Removing..." : "Remove"}
				</button>
			</div>
		</section>
	);
}
