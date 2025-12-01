import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { Settings } from "../action.tsx";

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

	@Column({ nullable: true, type: "bytea" })
	profileImage: Buffer | null;

	@Column({ length: 50, nullable: true, type: "varchar" })
	imageType: string | null;

	@Column({ nullable: true, type: "jsonb" })
	accessibilitySettings: Settings | null;
}
