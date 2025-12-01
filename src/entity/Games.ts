import {
	BaseEntity,
	Column,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	ViewColumn,
	ViewEntity,
} from "typeorm";

export enum LabelType {
	Genre = 1,
	Accessibility = 2,
	Platform = 3,
	IndustryRating = 4,
	Misc = 5,
}

export enum IndustryRating {
	Everyone = "Everyone",
	Teen = "Teen",
	Mature = "Mature",
	AdultsOnly = "Adults Only",
}

@Entity()
export class Label extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("smallint")
	type: LabelType;

	@Column("text")
	name: string | IndustryRating;

	@Column("text")
	description: string;
}

export enum MediaType {
	PreviewImg = 1,
	Video = 2,
	Icon = 3,
}

@Entity()
export class GameMedia extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("smallint")
	type: MediaType;

	@Column("text")
	uri: string;
}
@Entity()
export class Game extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text")
	name: string;

	@Column("text", { default: "" })
	description: string;

	@ManyToMany(() => Label)
	@JoinTable()
	labels: Label[];

	@ManyToMany(() => GameMedia)
	@JoinTable()
	media: GameMedia[];
}

@ViewEntity({
	expression: (dataSource) =>
		dataSource
			.createQueryBuilder()
			.select("game.id", "gameId")
			.addSelect("AVG(review.enjoyabilityRating)", "averageEnjoyabilityRating")
			.addSelect(
				"AVG(review.accessibilityRating)",
				"averageAccessibilityRating",
			)
			.from(Game, "game")
			.leftJoin("review", "review", "review.gameId = game.id")
			.groupBy("game.id"),
	materialized: true,
})
export class GameAverageRating extends BaseEntity {
	@ViewColumn()
	@Index({ unique: true })
	gameId: number;

	@ViewColumn()
	averageEnjoyabilityRating: number;

	@ViewColumn()
	averageAccessibilityRating: number;
}
