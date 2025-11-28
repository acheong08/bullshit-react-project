import "$styles/game-card.css";

export type CategoryCardProps = {
	image: string;
	category: string;
};

export default function CategoryCard(props: CategoryCardProps) {
	return (
		<a
			href="/categories"
			className="category-card"
			aria-label={`Category card: ${props.category}`}
		>
			{/* Masked gradient image */}
			<div
				className="category-card-image masked-icon"
				style={
					{
						"--icon-image": `url(${props.image})`,
					} as React.CSSProperties
				}
				aria-hidden="true" // hides decorative image
			/>

			<div className="category-card-title" aria-hidden="true">
				{props.category}
			</div>
		</a>
	);
}
