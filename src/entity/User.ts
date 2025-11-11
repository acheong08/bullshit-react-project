import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 32, type: "varchar" })
	username: string;

	@Column({ length: 98, type: "varchar" })
	passwordHash: string;

	@Column({ length: 128, type: "varchar" })
	email: string;
}
