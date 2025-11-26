import "$styles/game-card.css";

export type CategoryCardProps = {
	image: string;
	category: string;
};

export default function CategoryCard(props: CategoryCardProps) {
	return (
		<a href={"/categories"} className="category-card">
			{/* Masked gradient image */}
			<div
				className="category-card-image masked-icon"
				style={
					{
						"--icon-image": `url(${props.image})`,
					} as React.CSSProperties
				}
			/>

			<h3>{props.category}</h3>
		</a>
	);
}
