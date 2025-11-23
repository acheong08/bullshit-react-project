"use client";

import { useState } from "react";
import type { GameMedia } from "$entity/Games";

interface MediaCarouselProps {
	media: GameMedia[];
	gameName: string;
}

export function MediaCarousel({ media, gameName }: MediaCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!media || media.length === 0) {
		return null;
	}

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? media.length - 1 : prevIndex - 1,
		);
	};

	const goToNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === media.length - 1 ? 0 : prevIndex + 1,
		);
	};

	const currentMedia = media[currentIndex];

	return (
		<div className="carousel-container">
			<div className="carousel">
				<img
					src={currentMedia.uri}
					alt={`${gameName} media gallery ${currentIndex + 1} of ${media.length}`}
					className="carousel-image active"
				/>
			</div>
			<div className="carousel-controls">
				<button
					onClick={goToPrevious}
					className="carousel-button"
					disabled={media.length <= 1}
					type="button"
				>
					← Previous
				</button>
				<span className="carousel-counter">
					{currentIndex + 1} / {media.length}
				</span>
				<button
					onClick={goToNext}
					className="carousel-button"
					disabled={media.length <= 1}
					type="button"
				>
					Next →
				</button>
			</div>
		</div>
	);
}
