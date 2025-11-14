import {
	BaseEntity,
	Column,
	Entity,
	ManyToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

enum LabelType {
	Genre = 1,
	Accessibility = 2,
	Misc = 3,
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
}

enum MediaType {
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

	@Column("text")
	description: string;

	@ManyToMany(
		(_) => Label,
		(label) => label.id,
	)
	labels: Label[];

	@ManyToMany(
		(_) => GameMedia,
		(media) => media.id,
	)
	media: GameMedia[];
}
