import "$styles/game-card.css";

export type CategoryCardProps = {
	image: string;
	category: string;
	link: string;
};

export default function CategoryCard(props: CategoryCardProps) {
	return (
		<a
			href={props.link}
			className="category-card"
			aria-label={`${props.category} category, links to ${props.category} games search page`}
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
