import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from "typeorm";
import { Game } from "./Games";
import { User } from "./User";

@Entity()
@Unique(["user", "game"]) // Prevent duplicate reviews from same user for same game
export class Review extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("smallint")
	accessibilityRating: number; // 1-5 scale (mandatory)

	@Column("smallint")
	enjoyabilityRating: number; // 1-5 scale (mandatory)

	@Column("text", { nullable: true })
	comment: string | null; // Optional comment

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => User, { eager: false })
	user: User;

	@ManyToOne(() => Game, { eager: false })
	game: Game;
}
