// Import TypeORM decorators and base classes
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./Games";

// Enum to define the possible states of a report
// This ensures reports can only have these three status values
export enum ReportStatus {
	Pending = "pending", // Report has been submitted but not yet reviewed
	Reviewed = "reviewed", // Admin has reviewed and fixed the game
	Deleted = "deleted", // Admin has marked the game for deletion
}

// @Entity() decorator tells TypeORM this class represents a database table
// The table will be called "report" (lowercase class name by default)
@Entity()
export class Report extends BaseEntity {
	// @PrimaryGeneratedColumn() creates an auto-incrementing ID column
	// This is the unique identifier for each report
	@PrimaryGeneratedColumn()
	id: number;

	// @ManyToOne creates a relationship: many reports can point to one game
	// eager: true means when we load a report, it automatically loads the game too
	// This saves us from having to manually join the tables
	@ManyToOne(() => Game, { eager: true })
	game: Game;

	// @Column defines a regular database column
	// "text" means it can store long strings (like full sentences)
	// This stores the reason why the game was reported (e.g., "Offensive content")
	@Column("text")
	reportReason: string;

	// @Column with enum type ensures only valid ReportStatus values can be stored
	// default: ReportStatus.Pending means new reports start as "pending"
	@Column({
		default: ReportStatus.Pending,
		enum: ReportStatus,
		type: "enum",
	})
	status: ReportStatus;

	// @CreateDateColumn automatically sets this to the current date/time when created
	// We don't need to manually set this - TypeORM does it for us
	// This tracks when the report was submitted
	@CreateDateColumn()
	reportedAt: Date;
}
