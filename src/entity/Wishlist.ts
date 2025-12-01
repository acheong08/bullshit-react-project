import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { Game } from "./Games";
import { User } from "./User";

@Entity()
@Unique(["user", "game"]) // Prevent duplicate wishlist entries
export class Wishlist extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	user: User;

	@ManyToOne(() => Game, { onDelete: "CASCADE" })
	game: Game;

	@Column({ default: () => "CURRENT_TIMESTAMP", type: "timestamp" })
	addedAt: Date;
}
