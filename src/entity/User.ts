import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 32, type: "varchar" })
	username: string;

	@Column({ length: 60, type: "varchar" })
	passwordHash: string;

	@Column({ length: 128, type: "varchar" })
	email: string;

	@Column({ nullable: true, type: "text" })
	profileImage: string | null;

	@Column({ nullable: true, type: "text" })
	accessibilitySettings: string | null;
}
