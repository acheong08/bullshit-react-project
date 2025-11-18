import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

export enum LabelType {
	Genre = 1,
	Accessibility = 2,
	Platform = 3,
	Misc = 4,
}

@Entity()
export class Label extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("smallint")
	type: LabelType;

	@Column("text")
	name: string;

	@Column("text")
	description: string;

	@ManyToOne(() => Label, { nullable: true })
	parent: Label | null;
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

	@Column("text", { nullable: true })
	url: string;

	@Column("text", { nullable: true })
	industryRating: string;

	@ManyToMany(() => Label)
	@JoinTable()
	labels: Label[];

	@ManyToMany(() => GameMedia)
	@JoinTable()
	media: GameMedia[];
}
