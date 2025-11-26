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

	const currentMedia = media[currentIndex];

	return (
		<div className="media-gallery">
			<div className="featured-media">
				<img
					src={currentMedia.uri}
					alt={`${gameName} media ${currentIndex + 1}`}
					className="featured-image"
				/>
				<div className="media-caption">TODO: Captions</div>
			</div>
			<div className="thumbnails-row">
				{media.map((item, index) => (
					<button
						key={item.id || index}
						type="button"
						className={`thumbnail-btn ${index === currentIndex ? "active" : ""}`}
						onClick={() => setCurrentIndex(index)}
					>
						<img
							src={item.uri}
							alt={`Thumbnail ${index + 1}`}
							className="thumbnail-image"
						/>
					</button>
				))}
			</div>
		</div>
	);
}
