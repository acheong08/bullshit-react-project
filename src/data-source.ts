import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
	database: "test",
	entities: [User],
	host: "postgres",
	logging: false,
	migrations: [],
	password: "test",
	port: 5432,
	subscribers: [],
	synchronize: true,
	type: "postgres",
	username: "test",
});
