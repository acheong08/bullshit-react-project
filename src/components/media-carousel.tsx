"use client";

import { useState } from "react";
import { type GameMedia, MediaType } from "$entity/Games";

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
				{currentMedia.type === MediaType.Video ? (
					<iframe
						src={currentMedia.uri}
						title="YouTube video player"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
						className="featured-image"
					/>
				) : (
					<img
						src={currentMedia.uri}
						alt={`${gameName} media ${currentIndex + 1}`}
						className="featured-image"
					/>
				)}
			</div>
			<div className="thumbnails-row">
				{media.map((item, index) => (
					<button
						key={item.id || index}
						type="button"
						className={`thumbnail-btn ${index === currentIndex ? "active" : ""}`}
						onClick={() => setCurrentIndex(index)}
					>
						{item.type === MediaType.Video ? (
							<div className="video-thumbnail-container">
								<div className="play-button-overlay">▶</div>
								<img
									src={(() => {
										// https://img.youtube.com/vi/7h0cgmvIrZw/hqdefault.jpg
										// https://www.youtube.com/embed/7h0cgmvIrZw?si=ljhD5Ov2iuixlFYs?cc_load_policy=1&cc_lang_pref=en
										const videoId = item.uri.split("/embed/")[1].split("?")[0];
										const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
										return thumbnailUrl;
									})()}
									alt={`Thumbnail ${index + 1}`}
									className="video-thumbnail-image"
								/>
							</div>
						) : (
							<img
								src={item.uri}
								alt={`Thumbnail ${index + 1}`}
								className="thumbnail-image"
							/>
						)}
					</button>
				))}
			</div>
		</div>
	);
}
